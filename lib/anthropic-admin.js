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
    const orgId = process.env.ANTHROPIC_ORG_ID
    const costUrl = `https://api.anthropic.com/v1/organizations/${orgId}/usage_report/messages`
    
    const costResponse = await fetch(costUrl, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.ANTHROPIC_ADMIN_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (!costResponse.ok) {
      console.error('Anthropic Cost API error:', costResponse.status, costResponse.statusText)
      return null
    }

    const costData = await costResponse.json()

    // Parse response - Admin API returns usage data with costs
    let totalSpent = 0

    // Try different response formats
    if (costData.cost) {
      // Direct cost field
      totalSpent = parseFloat(costData.cost)
    } else if (costData.usage && Array.isArray(costData.usage)) {
      // Array of usage items with costs
      costData.usage.forEach((item) => {
        if (item.cost) {
          totalSpent += parseFloat(item.cost)
        }
      })
    } else if (costData.data && Array.isArray(costData.data)) {
      // Legacy format: data array with costs in cents
      costData.data.forEach((item) => {
        if (item.cost) {
          totalSpent += parseFloat(item.cost) / 100 // Convert cents to dollars
        }
      })
    }

    return {
      spent: parseFloat(totalSpent.toFixed(2)),
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error fetching Anthropic cost data:', error)
    return null
  }
}
