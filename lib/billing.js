// Real billing integrations for Anthropic and Google Cloud

export async function getAnthropicBilling() {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('ANTHROPIC_API_KEY not set')
      return null
    }

    const response = await fetch('https://api.anthropic.com/v1/usage', {
      method: 'GET',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
      },
    })

    if (!response.ok) {
      console.error('Anthropic API error:', response.status)
      return null
    }

    const data = await response.json()
    
    return {
      spent: data.total_cost || 0,
      inputTokens: data.input_tokens || 0,
      outputTokens: data.output_tokens || 0,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error fetching Anthropic billing:', error)
    return null
  }
}

export async function getGoogleBilling() {
  try {
    if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_PROJECT_ID) {
      console.warn('Google credentials not configured')
      return null
    }

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: generateJWT(),
      }),
    })

    if (!tokenResponse.ok) {
      console.error('Failed to get Google access token')
      return null
    }

    const { access_token } = await tokenResponse.json()

    // Fetch billing data
    const billingResponse = await fetch(
      `https://www.googleapis.com/cloudbilling/v1/projects/${process.env.GOOGLE_PROJECT_ID}/billingInfo`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    )

    if (!billingResponse.ok) {
      console.error('Google Billing API error:', billingResponse.status)
      return null
    }

    const data = await billingResponse.json()
    
    return {
      spent: data.costData?.total || 0,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error fetching Google billing:', error)
    return null
  }
}

// Helper to generate JWT for Google service account
function generateJWT() {
  const crypto = require('crypto')
  
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    sub: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/cloud-billing.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url')
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .sign('RSA-SHA256', Buffer.from(`${headerB64}.${payloadB64}`), {
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      padding: crypto.constants.RSA_PKCS1_PADDING,
    })
    .toString('base64url')

  return `${headerB64}.${payloadB64}.${signature}`
}
