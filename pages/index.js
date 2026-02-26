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
    const interval = setInterval(fetchData, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 min-h-screen">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">Mission Control</h1>
          <p className="text-indigo-300 text-sm sm:text-base font-medium opacity-80">Connected to Hyperliquid & GPT-4o</p>
        </div>

        {/* Grid Layout - 1 col on mobile, 3 col on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Main Stats Area - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Billing Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* OpenAI Status Card */}
              <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-5 shadow-inner">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Main Brain</h3>
                    <p className="text-2xl font-black text-white">GPT-4o</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 mb-1">PRO</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-indigo-500/10">
                  <div>
                    <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-tight">Window Quota</p>
                    <p className="text-base font-black text-indigo-200">{data.billing?.openai?.windowLeft || '100%'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-tight">Daily Quota</p>
                    <p className="text-base font-black text-indigo-200">{data.billing?.openai?.dayLeft || '100%'}</p>
                  </div>
                </div>
              </div>

              {/* Gemini Status */}
              <BillingCard
                provider="Google Flash"
                budget={100}
                used={data.billing?.gemini?.spent || 0}
                currency="$"
              />
            </div>

            {/* Trading Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TradingCard
                title="Active Trades"
                value={data.trading?.positions?.length || 0}
                type="positions"
              />
              <TradingCard
                title="Unrealized P&L"
                value={data.trading?.pnl || 0}
                type="pnl"
              />
            </div>
          </div>

          {/* Agent Status - Sidebar (Moves to bottom on mobile) */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-white px-1">Specialists</h2>
            <div className="grid grid-cols-1 gap-3">
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
