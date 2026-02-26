import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import BillingCard from '../components/BillingCard'

export default function BillingPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/billing')
        setData(await res.json())
        setLoading(false)
      } catch (err) {
        console.error('Error fetching billing data:', err)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Billing & Budget</h1>
          <p className="text-purple-300">Predictable Flat-Rate Monitoring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">ChatGPT Pro (Codex)</h2>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                Active
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Monthly Plan</p>
                <p className="text-2xl font-bold text-white">$200.00 <span className="text-sm font-normal text-slate-500">/ mo</span></p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Window Quota</p>
                  <p className="text-xl font-bold text-purple-300">{data?.openai?.windowLeft || '100%'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Daily Quota</p>
                  <p className="text-xl font-bold text-purple-300">{data?.openai?.dayLeft || '100%'}</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-slate-500">Unlimited GPT-4o usage via OAuth provider</p>
              </div>
            </div>
          </div>

          <BillingCard
            provider="Google Gemini Flash"
            budget={100}
            used={data?.gemini?.spent || 0}
            currency="$"
          />
        </div>

        <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Account Efficiency</h2>
          <div className="flex items-center gap-4">
            <div className="h-4 flex-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-[100%]"></div>
            </div>
            <span className="text-purple-300 font-bold">100% Ready</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            System migrated to OpenAI Codex. Claude API usage has been discontinued.
          </p>
        </div>
      </div>
    </Layout>
  )
}
