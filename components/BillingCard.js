export default function BillingCard({ provider, budget, used, currency }) {
  const percent = Math.min((used / budget) * 100, 100)
  const remaining = budget - used
  const isWarning = percent > 50
  const isDanger = percent > 90

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-semibold">{provider}</h3>
          <p className="text-slate-400 text-sm">Monthly Budget</p>
        </div>
        <span className={`text-xl font-bold ${
          isDanger ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-green-400'
        }`}>
          {percent.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isDanger
              ? 'bg-gradient-to-r from-red-500 to-red-400'
              : isWarning
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-slate-400 text-xs">Used</p>
          <p className="text-white font-semibold">{currency}{used.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Remaining</p>
          <p className="text-purple-300 font-semibold">{currency}{remaining.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Budget</p>
          <p className="text-white font-semibold">{currency}{budget}</p>
        </div>
      </div>
    </div>
  )
}
