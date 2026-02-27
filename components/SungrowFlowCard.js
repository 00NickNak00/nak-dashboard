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

  const battDirection = safe.batteryKw >= 0 ? 'toHome' : 'charge'
  const gridDirection = safe.gridKw >= 0 ? 'import' : 'export'

  return (
    <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">Energy System</p>
          <h3 className="text-lg font-black text-white">{safe.siteName}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${chip}`}>{safe.status}</span>
      </div>

      {/* Animated flow map */}
      <div className="relative rounded-xl border border-slate-700 bg-slate-950/60 p-4 mb-4 overflow-hidden">
        <svg viewBox="0 0 360 170" className="w-full h-44">
          {/* nodes */}
          <g>
            <rect x="148" y="8" width="64" height="26" rx="8" fill="#1f2937" stroke="#334155" />
            <text x="180" y="25" textAnchor="middle" fill="#67e8f9" fontSize="10" fontWeight="700">PV</text>

            <rect x="148" y="72" width="64" height="26" rx="8" fill="#1f2937" stroke="#334155" />
            <text x="180" y="89" textAnchor="middle" fill="#67e8f9" fontSize="10" fontWeight="700">HOME</text>

            <rect x="20" y="118" width="80" height="32" rx="8" fill="#1f2937" stroke="#334155" />
            <text x="60" y="138" textAnchor="middle" fill="#67e8f9" fontSize="10" fontWeight="700">BATTERY</text>

            <rect x="260" y="118" width="80" height="32" rx="8" fill="#1f2937" stroke="#334155" />
            <text x="300" y="138" textAnchor="middle" fill="#67e8f9" fontSize="10" fontWeight="700">GRID</text>
          </g>

          {/* static wires */}
          <g stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M180 34 L180 72" />
            <path d="M180 98 L60 118" />
            <path d="M180 98 L300 118" />
          </g>

          {/* animated pulses */}
          <g strokeWidth="4" fill="none" strokeLinecap="round">
            {safe.pvKw > 0 && (
              <path className="flow flow-down" d="M180 34 L180 72" stroke="#22d3ee" style={{ animationDuration: `${Math.max(0.8, 4 - safe.pvKw / 5)}s` }} />
            )}

            {Math.abs(safe.batteryKw) > 0.05 && battDirection === 'toHome' && (
              <path className="flow flow-up-left" d="M180 98 L60 118" stroke="#34d399" style={{ animationDuration: `${Math.max(0.8, 4 - Math.abs(safe.batteryKw))}s` }} />
            )}
            {Math.abs(safe.batteryKw) > 0.05 && battDirection === 'charge' && (
              <path className="flow flow-down-left" d="M180 98 L60 118" stroke="#60a5fa" style={{ animationDuration: `${Math.max(0.8, 4 - Math.abs(safe.batteryKw))}s` }} />
            )}

            {Math.abs(safe.gridKw) > 0.05 && gridDirection === 'import' && (
              <path className="flow flow-up-right" d="M180 98 L300 118" stroke="#fbbf24" style={{ animationDuration: `${Math.max(0.8, 4 - Math.abs(safe.gridKw))}s` }} />
            )}
            {Math.abs(safe.gridKw) > 0.05 && gridDirection === 'export' && (
              <path className="flow flow-down-right" d="M180 98 L300 118" stroke="#f472b6" style={{ animationDuration: `${Math.max(0.8, 4 - Math.abs(safe.gridKw))}s` }} />
            )}
          </g>
        </svg>
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

      <style jsx>{`
        .flow {
          stroke-dasharray: 6 14;
          opacity: 0.95;
        }
        .flow-down { animation: dash-down linear infinite; }
        .flow-up-left { animation: dash-up-left linear infinite; }
        .flow-down-left { animation: dash-down-left linear infinite; }
        .flow-up-right { animation: dash-up-right linear infinite; }
        .flow-down-right { animation: dash-down-right linear infinite; }

        @keyframes dash-down { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -40; } }
        @keyframes dash-up-left { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 40; } }
        @keyframes dash-down-left { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -40; } }
        @keyframes dash-up-right { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 40; } }
        @keyframes dash-down-right { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -40; } }
      `}</style>
    </div>
  )
}
