import { getHyperliquidTradingData } from '../../lib/hyperliquid-api'

export default async function handler(req, res) {
  try {
    const hlData = await getHyperliquidTradingData()

    const tradingData = {
      positions: hlData.positions || [],
      history: hlData.history || [],
      pnl: (hlData.positions || []).reduce((acc, p) => acc + parseFloat(p.pnl || 0), 0),
      equity: hlData.equity || 0,
      available: hlData.available || 0,
      mode: 'testnet',
      lastUpdated: new Date().toISOString(),
    }

    res.status(200).json(tradingData)
  } catch (error) {
    console.error('Trading API Error:', error)
    res.status(200).json({ 
      positions: [], 
      history: [], 
      pnl: 0, 
      equity: 0,
      available: 0
    })
  }
}
