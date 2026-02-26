import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

export default function TradingPage() {
  const [data, setData] = useState({ positions: [], history: [], pnl: 0, equity: 0, available: 0, loading: true })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/trading')
        const tradingData = await res.json()
        setData({ ...tradingData, loading: false })
      } catch (err) {
        console.error('Error fetching trading data:', err)
        setData(prev => ({ ...prev, loading: false }))
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  // Helper to safely format numbers
  const fmt = (val) => (typeof val === 'number' ? val.toFixed(2) : '0.00');

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">Trading Log</h1>
          <p className="text-indigo-300 text-sm font-medium opacity-80">Hyperliquid Testnet Live</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5 shadow-lg">
            <p className="text-slate-500 text-xs font-black uppercase mb-1">Account Value</p>
            <p className="text-2xl font-black text-white">${fmt(data.equity)}</p>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5 shadow-lg">
            <p className="text-slate-500 text-xs font-black uppercase mb-1">Unrealized P&L</p>
            <p className={`text-2xl font-black ${data.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${fmt(data.pnl)}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5 shadow-lg">
            <p className="text-slate-500 text-xs font-black uppercase mb-1">Buying Power</p>
            <p className="text-2xl font-black text-indigo-300">${fmt(data.available)}</p>
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Open Positions
          </h2>
          {data.positions && data.positions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.positions.map((pos, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-black text-white">{pos.coin}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-black ${pos.pnl_pct >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {pos.pnl_pct >= 0 ? '+' : ''}{pos.pnl_pct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 font-bold uppercase text-[10px]">Size</p>
                      <p className="text-white font-mono">{parseFloat(pos.size).toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold uppercase text-[10px]">Entry</p>
                      <p className="text-white font-mono">${parseFloat(pos.entry).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-8 text-center">
              <p className="text-slate-500 font-bold">No active positions</p>
            </div>
          )}
        </div>

        {/* Trade History */}
        <div>
          <h2 className="text-xl font-black text-white mb-4">Recent Fills</h2>
          <div className="bg-slate-800/50 border border-purple-500/10 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Coin</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Side</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {data.history && data.history.map((t, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-indigo-500/5 transition-colors">
                    <td className="p-4 text-white font-black">{t.coin}</td>
                    <td className="p-4">
                      <span className={`font-black text-[10px] ${t.side === 'B' ? 'text-green-400' : 'text-red-400'}`}>
                        {t.side === 'B' ? 'BUY' : 'SELL'}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-300 font-mono">${parseFloat(t.px).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
