import { getGoogleBilling } from '../../lib/google-billing'
import { getOpenAIStatus } from '../../lib/openai-status'

export default async function handler(req, res) {
  try {
    // Fetch real data from providers
    const [googleData, openaiData] = await Promise.all([
      getGoogleBilling(),
      getOpenAIStatus()
    ])

    const billingData = {
      gemini: {
        provider: 'Google Gemini Flash',
        budget: 100,
        spent: googleData?.spent || 0,
        dailySpend: googleData?.spent ? (googleData.spent / 25) : 0, 
        threshold_warning: 50,
        threshold_danger: 90,
        lastUpdated: googleData?.lastUpdated || new Date().toISOString(),
      },
      openai: {
        provider: 'ChatGPT Pro (GPT-4o)',
        budget: 200,
        spent: 0, // It's a flat rate
        windowLeft: openaiData?.windowLeft || '100%',
        dayLeft: openaiData?.dayLeft || '100%',
        status: openaiData?.status || 'active',
        lastUpdated: openaiData?.lastUpdated || new Date().toISOString(),
      },
      total: {
        fixed_cost: 200, // Monthly Pro fee
        api_spend: googleData?.spent || 0,
      },
    }

    res.status(200).json(billingData)
  } catch (error) {
    console.error('Error in billing API:', error)
    res.status(200).json({ 
      error: 'Failed to fetch some data',
      openai: { provider: 'ChatGPT Pro', budget: 200, spent: 0, windowLeft: '100%', dayLeft: '100%' },
      gemini: { provider: 'Gemini', budget: 100, spent: 10.67 } 
    })
  }
}
