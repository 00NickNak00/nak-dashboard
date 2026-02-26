import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

export default function TradingPage() {
  const [data, setData] = useState({ positions: [], history: [], pnl: 0, capital: 1000, loading: true })

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
    const interval = setInterval(fetchData, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Trading Dashboard</h1>
          <p className="text-purple-300">Hyperliquid Testnet Live Feed</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Account Value</p>
            <p className="text-3xl font-bold text-white">${data.capital.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Unrealized P&L</p>
            <p className={`text-3xl font-bold ${data.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${data.pnl.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Open Positions</p>
            <p className="text-3xl font-bold text-purple-300">{data.positions.length}</p>
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">📈 Open Positions</h2>
          {data.positions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.positions.map((pos, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{pos.coin}</h3>
                      <p className="text-xs text-slate-400 uppercase tracking-widest">LONG</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pos.pnl_pct >= 0 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {pos.pnl_pct >= 0 ? '+' : ''}{pos.pnl_pct.toFixed(2)}%
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Size</span>
                      <span className="text-white font-medium">{parseFloat(pos.size).toFixed(4)} {pos.coin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Entry</span>
                      <span className="text-white font-medium">${parseFloat(pos.entry).toFixed(5)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-700">
                      <span className="text-slate-400">Unrealized</span>
                      <span className={parseFloat(pos.pnl) >= 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                        ${parseFloat(pos.pnl).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
              <p className="text-slate-400">No open positions</p>
            </div>
          )}
        </div>

        {/* Trade History */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">📊 Trade History (Last 10)</h2>
          {data.history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left text-slate-400 font-medium">Asset</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-medium">Action</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-medium">Size</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-medium">Price</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.history.map((trade, idx) => (
                    <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-white font-bold">{trade.coin}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.side === 'B' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.side === 'B' ? 'BUY' : 'SELL'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{parseFloat(trade.sz).toFixed(4)}</td>
                      <td className="px-4 py-3 text-slate-300">${parseFloat(trade.px).toFixed(5)}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {new Date(parseInt(trade.time)).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
              <p className="text-slate-400">No trade history</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
