import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import BillingCard from '../components/BillingCard'
import AgentCard from '../components/AgentCard'
import TradingCard from '../components/TradingCard'

export default function Dashboard() {
  const [data, setData] = useState({
    billing: null,
    agents: null,
    trading: null,
    loading: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billingRes, agentsRes, tradingRes] = await Promise.all([
          fetch('/api/billing'),
          fetch('/api/agents'),
          fetch('/api/trading'),
        ])

        setData({
          billing: await billingRes.json(),
          agents: await agentsRes.json(),
          trading: await tradingRes.json(),
          loading: false,
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setData(prev => ({ ...prev, loading: false }))
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Nick</h1>
          <p className="text-purple-300">Trading dashboard & billing monitor</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Billing Section - Left */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <BillingCard
                  provider="Gemini Flash"
                  budget={100}
                  used={data.billing?.gemini?.spent || 0}
                  currency="$"
                />
                <BillingCard
                  provider="Anthropic Haiku"
                  budget={50}
                  used={data.billing?.anthropic?.spent || 0}
                  currency="$"
                />
              </div>

              {/* Trading Cards */}
              <div className="grid grid-cols-2 gap-4">
                <TradingCard
                  title="Open Positions"
                  value={data.trading?.positions?.length || 0}
                  type="positions"
                />
                <TradingCard
                  title="P&L Today"
                  value={data.trading?.pnl || 0}
                  type="pnl"
                />
              </div>
            </div>
          </div>

          {/* Agent Status - Right */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Agent Status</h2>
            <div className="space-y-3">
              <AgentCard name="Trader" status={data.agents?.trader?.status || 'idle'} />
              <AgentCard name="Researcher" status={data.agents?.researcher?.status || 'offline'} />
              <AgentCard name="Monitor" status={data.agents?.monitor?.status || 'offline'} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
