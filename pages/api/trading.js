// API route to fetch trading data from Trader workspace

export default async function handler(req, res) {
  try {
    // Return mock trading data
    const tradingData = {
      positions: [],
      pnl: 0,
      capital: 10000,
      mode: 'paper',
      lastUpdated: new Date().toISOString(),
    }

    res.status(200).json(tradingData)
  } catch (error) {
    console.error('Error fetching trading data:', error)
    res.status(500).json({ error: 'Failed to fetch trading data' })
  }
}
