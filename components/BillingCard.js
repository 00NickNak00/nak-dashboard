export default function BillingCard({ provider, budget, used, currency }) {
  const percent = Math.min((used / budget) * 100, 100)
  const remaining = budget - used
  const isWarning = percent > 50
  const isDanger = percent > 90

  return (
    <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4 sm:p-6 hover:border-purple-500/60 transition-all shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-sm sm:text-base font-bold truncate pr-2">{provider}</h3>
        <span className={`text-base sm:text-xl font-black shrink-0 ${
          isDanger ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-green-400'
        }`}>
          {percent.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 mb-4 overflow-hidden border border-slate-700">
        <div
          className={`h-full transition-all duration-500 ${
            isDanger
              ? 'bg-red-500'
              : isWarning
              ? 'bg-yellow-500'
              : 'bg-purple-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Stats - Responsive Grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-4 text-center">
        <div className="flex flex-col">
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter sm:tracking-normal">Used</p>
          <p className="text-white text-xs sm:text-sm font-mono">{currency}{used.toFixed(2)}</p>
        </div>
        <div className="flex flex-col border-x border-slate-700/50 px-1">
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter sm:tracking-normal">Left</p>
          <p className="text-purple-400 text-xs sm:text-sm font-mono">{currency}{remaining.toFixed(2)}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter sm:tracking-normal">Cap</p>
          <p className="text-slate-300 text-xs sm:text-sm font-mono">{currency}{budget}</p>
        </div>
      </div>
    </div>
  )
}
