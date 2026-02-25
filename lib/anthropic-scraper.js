// Scrape Anthropic console for real billing data
import puppeteer from 'puppeteer'

export async function scrapeAnthropicBilling() {
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    
    // Navigate to Anthropic console
    await page.goto('https://console.anthropic.com/account/usage', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    // Wait for billing data to load
    await page.waitForSelector('[class*="cost"]', { timeout: 10000 }).catch(() => null)

    // Extract the cost value (adjust selector based on actual HTML)
    const cost = await page.evaluate(() => {
      // Try multiple selectors to find the cost
      const selectors = [
        'div:has-text("Total token cost")',
        '[data-testid="total-cost"]',
        'span:has-text("USD")',
      ]

      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element) {
          const text = element.textContent
          const match = text.match(/\d+\.\d+/)
          if (match) return parseFloat(match[0])
        }
      }

      // Fallback: look for any USD amount
      const allText = document.body.innerText
      const match = allText.match(/USD\s*([\d.]+)/)
      return match ? parseFloat(match[1]) : null
    })

    await browser.close()

    if (cost === null || cost === undefined) {
      console.warn('Could not extract Anthropic cost from console')
      return null
    }

    return {
      spent: cost,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error scraping Anthropic billing:', error)
    if (browser) await browser.close()
    return null
  }
}
