export default async function handler(req, res) {
  try {
    // Placeholder adapter for iSolarCloud/Sungrow integration.
    // When credentials are added, replace this with real upstream calls.
    // Suggested env vars:
    // SUNGROW_USERNAME, SUNGROW_PASSWORD, SUNGROW_PLANT_ID

    const mock = {
      source: 'mock',
      siteName: '24 Oceanfront Drive',
      status: 'Normal',
      pvKw: 15.0,
      loadKw: 10.3,
      batteryKw: 4.6,
      batterySoc: 63,
      gridKw: 0.0,
      updatedAt: new Date().toISOString(),
    }

    res.status(200).json(mock)
  } catch (error) {
    console.error('Sungrow API adapter error:', error)
    res.status(500).json({ error: 'Failed to fetch Sungrow data' })
  }
}
