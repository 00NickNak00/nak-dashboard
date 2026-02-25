// Anthropic Usage & Cost Admin API integration

export async function getAnthropicUsageAndCost() {
  try {
    if (!process.env.ANTHROPIC_ADMIN_KEY) {
      console.warn('Anthropic admin key not configured')
      return null
    }

    // Get cost for last 30 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const startIso = startDate.toISOString()
    const endIso = endDate.toISOString()

    // Fetch COST data (actual USD amounts)
    const costUrl = `https://api.anthropic.com/v1/organizations/cost_report?starting_at=${startIso}&ending_at=${endIso}&group_by[]=workspace_id&group_by[]=description&bucket_width=1d`
    
    const costResponse = await fetch(costUrl, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.ANTHROPIC_ADMIN_KEY,
        'anthropic-version': '2023-06-01',
        'User-Agent': 'NAK-Dashboard/1.0.0',
      },
    })

    if (!costResponse.ok) {
      console.error('Anthropic Cost API error:', costResponse.status, costResponse.statusText)
      return null
    }

    const costData = await costResponse.json()

    // Sum all costs (already in USD)
    let totalCostCents = 0

    if (costData.data && Array.isArray(costData.data)) {
      costData.data.forEach((item) => {
        if (item.cost) {
          // Cost is in cents (lowest units)
          totalCostCents += parseFloat(item.cost)
        }
      })
    }

    // Convert cents to dollars
    const totalCostUSD = totalCostCents / 100

    return {
      spent: parseFloat(totalCostUSD.toFixed(2)),
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error fetching Anthropic cost data:', error)
    return null
  }
}
