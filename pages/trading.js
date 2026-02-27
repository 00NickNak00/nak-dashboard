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

  const fmt = (val) => (typeof val === 'number' ? val.toFixed(2) : '0.00')

  return (
    <Layout>
      <div className="min-h-screen px-4 py-6 sm:px-6 bg-[radial-gradient(circle_at_top,_#1f2a5a_0%,_#0b1025_45%,_#070b18_100%)] text-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">Control Interface</p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black tracking-[0.08em] text-fuchsia-300 drop-shadow-[0_0_16px_rgba(217,70,239,0.6)]">
              CONTROL CENTER FOR TRADING FEM-BOT
            </h1>
            <p className="text-cyan-200/70 text-xs mt-2">Live feed from trading bot execution</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-1 space-y-4">
              <div className="rounded-2xl border border-emerald-400/30 bg-slate-950/70 shadow-[0_0_20px_rgba(16,185,129,0.2)] p-4">
                <p className="text-[11px] font-black uppercase text-emerald-300">● Your Bot is Live</p>
                <div className="mt-4 rounded-xl border border-cyan-400/20 bg-slate-900/80 p-4 text-center">
                  <p className="text-lg font-black tracking-wide text-fuchsia-300">TRADING FEM-BOT</p>
                  <p className="mt-1 text-xs text-cyan-300">The Surgeon</p>
                  <p className="mt-4 text-2xl font-black">{data.loading ? 'SYNCING...' : data.positions?.length ? 'ACTIVE' : 'WAITING...'}</p>
                  <p className="text-xs text-slate-400">Unrealized P&L</p>
                  <p className={`mt-1 text-xl font-black ${data.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>${fmt(data.pnl)}</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-slate-900/80 p-2 border border-cyan-500/20">
                    <p className="text-[10px] text-slate-400 uppercase">Equity</p>
                    <p className="font-black text-cyan-200">${fmt(data.equity)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-2 border border-cyan-500/20">
                    <p className="text-[10px] text-slate-400 uppercase">Buying</p>
                    <p className="font-black text-cyan-200">${fmt(data.available)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 p-2 border border-cyan-500/20">
                    <p className="text-[10px] text-slate-400 uppercase">Open</p>
                    <p className="font-black text-cyan-200">{data.positions?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-fuchsia-500/20 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-fuchsia-300 font-black">Live Trade Notes</p>
                <div className="mt-3 space-y-2 max-h-40 overflow-auto">
                  {(data.history || []).slice(0, 5).map((t, i) => (
                    <div key={i} className="text-xs border border-slate-700 rounded-lg p-2 bg-slate-900/70">
                      <span className="font-black text-cyan-200">{t.coin}</span>{' '}
                      <span className={t.side === 'B' ? 'text-emerald-400' : 'text-rose-400'}>{t.side === 'B' ? 'BUY' : 'SELL'}</span>{' '}
                      @ <span className="font-mono text-slate-300">${parseFloat(t.px).toFixed(2)}</span>
                    </div>
                  ))}
                  {!data.history?.length && <p className="text-xs text-slate-500">No fills yet.</p>}
                </div>
              </div>
            </div>

            <div className="xl:col-span-1 space-y-4">
              <div className="rounded-2xl border border-cyan-400/25 bg-slate-950/70 p-4 min-h-[260px]">
                <p className="text-xs uppercase tracking-wide text-cyan-300 font-black">Talk to Trading Fem-Bot</p>
                <div className="mt-4 h-[210px] rounded-xl border border-cyan-500/20 bg-slate-900/60 flex items-center justify-center text-center">
                  <div>
                    <p className="text-2xl">💬</p>
                    <p className="text-cyan-200 font-black">LIVE CHAT</p>
                    <p className="text-xs text-slate-400">Coming soon</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-400/25 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-amber-300 font-black">Graceful End</p>
                <p className="text-[11px] text-slate-400 mt-2">Finish current cycle and stop new entries.</p>
                <button className="mt-4 w-full rounded-lg py-2 text-xs font-black border border-amber-300/50 text-amber-200 hover:bg-amber-400/10 transition">
                  END GRACEFULLY
                </button>
              </div>
            </div>

            <div className="xl:col-span-1 space-y-4">
              <div className="rounded-2xl border border-emerald-400/25 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-300 font-black">Settings</p>
                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1"><span className="text-slate-400">Aggressiveness</span><span className="text-emerald-300">Moderate</span></div>
                    <div className="h-1.5 rounded-full bg-slate-800"><div className="h-1.5 rounded-full bg-emerald-400 w-1/2" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span className="text-slate-400">Frequency</span><span className="text-emerald-300">5m</span></div>
                    <div className="h-1.5 rounded-full bg-slate-800"><div className="h-1.5 rounded-full bg-emerald-400 w-1/3" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span className="text-slate-400">Budget</span><span className="text-emerald-300">$50,000</span></div>
                    <div className="h-1.5 rounded-full bg-slate-800"><div className="h-1.5 rounded-full bg-emerald-400 w-2/3" /></div>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-lg py-2 text-xs font-black border border-emerald-300/50 text-emerald-200 hover:bg-emerald-400/10 transition">
                  UPDATE
                </button>
              </div>

              <div className="rounded-2xl border border-rose-400/30 bg-slate-950/70 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-rose-300 font-black">Emergency Stop</p>
                <p className="text-[11px] text-rose-200/80 mt-2">ALL SYSTEMS ABORT</p>
                <button className="mt-4 w-full rounded-lg py-2 text-xs font-black border border-rose-300/50 text-rose-200 hover:bg-rose-500/10 transition">
                  EMERGENCY STOP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
