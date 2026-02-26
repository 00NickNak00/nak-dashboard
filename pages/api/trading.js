export default async function handler(req, res) {
  try {
    // TEMPORARY: Return hardcoded data to verify frontend works
    const tradingData = {
      positions: [
        {
          coin: "ETH",
          size: "0.049",
          entry: "2056.7",
          pnl: 1.23,
          pnl_pct: 0.06
        }
      ],
      history: [
        { coin: "ETH", side: "B", sz: "0.049", px: "2056.7", time: Date.now() }
      ],
      pnl: 1.23,
      equity: 1008.46,
      available: 992.35,
      mode: 'testnet',
      lastUpdated: new Date().toISOString(),
    }

    console.log("Trading API returning hardcoded test data");
    res.status(200).json(tradingData)
  } catch (error) {
    console.error('Trading API Error:', error)
    res.status(500).json({ error: error.message })
  }
}
