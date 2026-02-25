import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  try {
    // Read billing data from JSON file
    const dataPath = path.join(process.cwd(), 'data', 'billing.json')
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

    const billingData = {
      gemini: {
        provider: 'Google Gemini Flash',
        budget: data.gemini.budget,
        spent: data.gemini.spent,
        dailySpend: data.gemini.dailySpend,
        threshold_warning: 50,
        threshold_danger: 90,
        lastUpdated: new Date().toISOString(),
      },
      anthropic: {
        provider: 'Anthropic Haiku',
        budget: data.anthropic.budget,
        spent: data.anthropic.spent,
        dailySpend: data.anthropic.dailySpend,
        threshold_warning: 50,
        threshold_danger: 90,
        lastUpdated: new Date().toISOString(),
      },
      total: {
        spent: data.gemini.spent + data.anthropic.spent,
        budgetRemaining: (data.gemini.budget + data.anthropic.budget) - (data.gemini.spent + data.anthropic.spent),
      },
    }

    res.status(200).json(billingData)
  } catch (error) {
    console.error('Error fetching billing data:', error)
    res.status(500).json({ error: 'Failed to fetch billing data' })
  }
}
