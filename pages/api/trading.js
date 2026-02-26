import { getHyperliquidTradingData } from '../../lib/hyperliquid-api'

export default async function handler(req, res) {
  try {
    const hlData = await getHyperliquidTradingData()

    const tradingData = {
      ...hlData,
      pnl: (hlData.positions || []).reduce((acc, p) => acc + parseFloat(p.pnl || 0), 0),
      mode: 'testnet',
      lastUpdated: new Date().toISOString(),
    }

    res.status(200).json(tradingData)
  } catch (error) {
    console.error('Trading API Error:', error)
    res.status(500).json({ error: error.message })
  }
}
