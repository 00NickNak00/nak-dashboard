import crypto from 'crypto'

const GATEWAY = process.env.SUNGROW_GATEWAY || 'https://gateway.isolarcloud.com'
const APP_KEY = process.env.SUNGROW_APP_KEY || 'B0455FBE7AA0328DB57B59AA729F05D8'
const ACCESS_KEY = process.env.SUNGROW_ACCESS_KEY || '9grzgbmxdsp3arfmmgq347xjbza4ysps'
const PUBLIC_KEY_B64 = (process.env.SUNGROW_PUBLIC_KEY_B64 || 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCkecphb6vgsBx4LJknKKes+eyj7+RKQ3fikF5B67EObZ3t4moFZyMGuuJPiadYdaxvRqtxyblIlVM7omAasROtKRhtgKwwRxo2a6878qBhTgUVlsqugpI/7ZC9RmO2Rpmr8WzDeAapGANfHN5bVr7G7GYGwIrjvyxMrAVit/oM4wIDAQAB').replace(/[-_]/g, m => (m === '-' ? '+' : '/'))

const pem = `-----BEGIN PUBLIC KEY-----\n${PUBLIC_KEY_B64.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----\n`

function randWord(n) {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let s = ''
  for (let i = 0; i < n; i += 1) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

function aesHexEncrypt(text, key) {
  const alg = key.length === 32 ? 'aes-256-ecb' : key.length === 24 ? 'aes-192-ecb' : 'aes-128-ecb'
  const cipher = crypto.createCipheriv(alg, Buffer.from(key, 'utf8'), null)
  cipher.setAutoPadding(true)
  return Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]).toString('hex').toUpperCase()
}

function aesHexDecrypt(hex, key) {
  const alg = key.length === 32 ? 'aes-256-ecb' : key.length === 24 ? 'aes-192-ecb' : 'aes-128-ecb'
  const decipher = crypto.createDecipheriv(alg, Buffer.from(key, 'utf8'), null)
  decipher.setAutoPadding(true)
  return Buffer.concat([decipher.update(Buffer.from(hex, 'hex')), decipher.final()]).toString('utf8')
}

function rsaEncrypt(value) {
  return crypto.publicEncrypt({ key: pem, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(value)).toString('base64')
}

async function sgCall(path, payload, opts = {}) {
  const randomKey = `web${randWord(29)}`
  const bodyObj = {
    appkey: APP_KEY,
    sys_code: 200,
    lang: '_en_US',
    ...payload,
    api_key_param: { timestamp: Date.now(), nonce: randWord(32) },
  }

  const headers = {
    'content-type': 'text/plain;charset=UTF-8',
    'x-random-secret-key': rsaEncrypt(randomKey),
    'x-access-key': ACCESS_KEY,
  }

  if (opts.xLimitObj) headers['x-limit-obj'] = rsaEncrypt(opts.xLimitObj)
  if (opts.cookie) headers.cookie = opts.cookie

  const resp = await fetch(`${GATEWAY}${path}`, {
    method: 'POST',
    headers,
    body: aesHexEncrypt(JSON.stringify(bodyObj), randomKey),
  })

  const setCookie = resp.headers.get('set-cookie') || ''
  const raw = await resp.text()
  const dec = aesHexDecrypt(raw, randomKey)
  return { data: JSON.parse(dec), setCookie }
}

function mockData(reason = 'mock') {
  return {
    source: reason,
    siteName: '24 Oceanfront Drive',
    status: 'Normal',
    pvKw: 15.0,
    loadKw: 10.3,
    batteryKw: 4.6,
    batterySoc: 63,
    gridKw: 0.0,
    updatedAt: new Date().toISOString(),
  }
}

export default async function handler(req, res) {
  try {
    const username = process.env.SUNGROW_USERNAME
    const password = process.env.SUNGROW_PASSWORD
    const psId = process.env.SUNGROW_PLANT_ID || process.env.SUNGROW_PS_ID

    if (!username || !password || !psId) {
      return res.status(200).json(mockData('missing-env'))
    }

    // 1) Login
    const login = await sgCall('/v1/userService/login', {
      user_account: username,
      user_password: password,
    })

    const loginState = login?.data?.result_data?.login_state
    const token = login?.data?.result_data?.token

    // Some accounts return login_state -1 and require extra challenge.
    if (!token) {
      return res.status(200).json({
        ...mockData('login-needs-verification'),
        status: 'Auth Pending',
        loginState,
      })
    }

    const tokenPrefix = String(token).split('_')[0]

    // 2) Pull plant summaries (best-effort with known endpoints)
    const [prod, cons, detail] = await Promise.all([
      sgCall('/v1/powerStationService/getPsProductionInfo', { ps_id: Number(psId), token }, { xLimitObj: tokenPrefix, cookie: login.setCookie }),
      sgCall('/v1/powerStationService/getPsConsumptionInfo', { ps_id: Number(psId), token }, { xLimitObj: tokenPrefix, cookie: login.setCookie }),
      sgCall('/v1/powerStationService/getPsDetailWithPsType', { ps_id: Number(psId), token }, { xLimitObj: tokenPrefix, cookie: login.setCookie }),
    ])

    const d = detail?.data?.result_data || {}
    const p = prod?.data?.result_data || {}
    const c = cons?.data?.result_data || {}

    // field mapping is defensive because response structure varies by account type
    const pvKw = Number(p.pv_power ?? p.pvPower ?? p.productionPower ?? 0)
    const loadKw = Number(c.load_power ?? c.loadPower ?? c.consumptionPower ?? 0)
    const batteryKw = Number(c.battery_power ?? d.batteryPower ?? 0)
    const batterySoc = Number(c.battery_soc ?? d.batterySoc ?? d.soc ?? 0)
    const gridKw = Number(c.grid_power ?? d.gridPower ?? 0)

    return res.status(200).json({
      source: 'isolarcloud-live',
      siteName: d.ps_name || d.psName || `Plant ${psId}`,
      status: d.ps_status_desc || d.status || 'Normal',
      pvKw,
      loadKw,
      batteryKw,
      batterySoc,
      gridKw,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Sungrow API adapter error:', error)
    return res.status(200).json(mockData('adapter-error'))
  }
}
