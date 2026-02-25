import { getAnthropicUsageAndCost } from '../../lib/anthropic-admin'
import { getGoogleBilling } from '../../lib/billing'

export default async function handler(req, res) {
  try {
    // Fetch real data from both providers
    const [anthropicData, googleData] = await Promise.all([
      getAnthropicUsageAndCost(),
      getGoogleBilling(),
    ])

    const billingData = {
      gemini: {
        provider: 'Google Gemini Flash',
        budget: 100,
        spent: googleData?.spent || 0,
        dailySpend: googleData?.spent ? (googleData.spent / 25) : 0, // Rough daily average
        threshold_warning: 50,
        threshold_danger: 90,
        lastUpdated: googleData?.lastUpdated || new Date().toISOString(),
      },
      anthropic: {
        provider: 'Anthropic Haiku',
        budget: 50,
        spent: anthropicData?.spent || 0,
        dailySpend: anthropicData?.spent ? (anthropicData.spent / 25) : 0, // Rough daily average
        threshold_warning: 50,
        threshold_danger: 90,
        lastUpdated: anthropicData?.lastUpdated || new Date().toISOString(),
      },
      total: {
        spent: (googleData?.spent || 0) + (anthropicData?.spent || 0),
        budgetRemaining: 150 - ((googleData?.spent || 0) + (anthropicData?.spent || 0)),
      },
    }

    res.status(200).json(billingData)
  } catch (error) {
    console.error('Error in billing API:', error)
    res.status(500).json({ error: 'Failed to fetch billing data' })
  }
}
