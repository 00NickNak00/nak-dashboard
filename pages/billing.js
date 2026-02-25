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
          <p className="text-purple-300">API spending overview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BillingCard
            provider="Gemini Flash"
            budget={100}
            used={data?.gemini?.spent || 0}
            currency="$"
          />
          <BillingCard
            provider="Anthropic Haiku"
            budget={50}
            used={data?.anthropic?.spent || 0}
            currency="$"
          />
        </div>

        <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Total Spend This Month</h2>
          <p className="text-4xl font-bold text-purple-300">
            ${((data?.gemini?.spent || 0) + (data?.anthropic?.spent || 0)).toFixed(2)}
          </p>
        </div>
      </div>
    </Layout>
  )
}
