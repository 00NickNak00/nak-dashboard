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
          <p className="text-purple-300">Command Centre: OpenAI Pro Active</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Billing Section - Left */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-4">
                {/* OpenAI Status Card */}
                <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Brain (Pro)</h3>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-white">GPT-4o</p>
                    <p className="text-xs text-purple-400 font-medium">Unlimited</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase">Quota: {data.billing?.openai?.windowLeft || '100%'} Window / {data.billing?.openai?.dayLeft || '100%'} Day</p>
                </div>

                <BillingCard
                  provider="Google Flash"
                  budget={100}
                  used={data.billing?.gemini?.spent || 0}
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
              <AgentCard name="Trader" status={data.agents?.trader?.status || 'active'} />
              <AgentCard name="Scanner" status={data.agents?.scanner?.status || 'active'} />
              <AgentCard name="Whale-Watch" status={data.agents?.whale?.status || 'active'} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
