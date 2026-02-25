// API route to fetch trading data from Trader workspace

import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  try {
    const traderPath = process.env.TRADER_WORKSPACE || '/Users/nak-bot/.openclaw/agents/trader'
    
    let tradingData = {
      positions: [],
      pnl: 0,
      capital: 10000,
      mode: 'paper',
      lastUpdated: new Date().toISOString(),
    }

    // Try to read TRADE_STATE.md
    try {
      const stateFile = path.join(traderPath, 'TRADE_STATE.md')
      if (fs.existsSync(stateFile)) {
        // Parse TRADE_STATE.md for position data
        // For now, use mock data
        tradingData.positions = []
        tradingData.pnl = 0
        tradingData.capital = 10000
      }
    } catch (err) {
      console.error('Error reading trader state:', err)
    }

    res.status(200).json(tradingData)
  } catch (error) {
    console.error('Error fetching trading data:', error)
    res.status(500).json({ error: 'Failed to fetch trading data' })
  }
}
