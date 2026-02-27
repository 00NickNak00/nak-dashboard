export default function SungrowFlowCard({ data }) {
  const safe = {
    siteName: data?.siteName || 'Plant',
    status: data?.status || 'Unknown',
    pvKw: Number(data?.pvKw || 0),
    loadKw: Number(data?.loadKw || 0),
    batteryKw: Number(data?.batteryKw || 0),
    batterySoc: Number(data?.batterySoc || 0),
    gridKw: Number(data?.gridKw || 0),
  }

  const chip = safe.status?.toLowerCase() === 'normal' ? 'text-emerald-300 border-emerald-400/30' : 'text-amber-300 border-amber-400/30'

  return (
    <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">Energy System</p>
          <h3 className="text-lg font-black text-white">{safe.siteName}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${chip}`}>{safe.status}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        <div className="rounded-xl bg-slate-800/70 p-3 border border-slate-700">
          <p className="text-[10px] text-slate-400 uppercase">PV</p>
          <p className="text-cyan-200 font-black">{safe.pvKw.toFixed(1)} kW</p>
        </div>
        <div className="rounded-xl bg-slate-800/70 p-3 border border-slate-700">
          <p className="text-[10px] text-slate-400 uppercase">Home</p>
          <p className="text-cyan-200 font-black">{safe.loadKw.toFixed(1)} kW</p>
        </div>
        <div className="rounded-xl bg-slate-800/70 p-3 border border-slate-700">
          <p className="text-[10px] text-slate-400 uppercase">Battery</p>
          <p className="text-cyan-200 font-black">{safe.batteryKw.toFixed(1)} kW</p>
        </div>
        <div className="rounded-xl bg-slate-800/70 p-3 border border-slate-700">
          <p className="text-[10px] text-slate-400 uppercase">SOC</p>
          <p className="text-cyan-200 font-black">{safe.batterySoc.toFixed(0)}%</p>
        </div>
        <div className="rounded-xl bg-slate-800/70 p-3 border border-slate-700">
          <p className="text-[10px] text-slate-400 uppercase">Grid</p>
          <p className="text-cyan-200 font-black">{safe.gridKw.toFixed(1)} kW</p>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mt-3">
        Adapter ready: <code className="text-slate-300">/api/sungrow</code> (currently mock/live-fallback)
      </p>
    </div>
  )
}
