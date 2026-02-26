export default function TradingCard({ title, value, type }) {
  const isPnL = type === 'pnl'
  const isEquity = type === 'equity' || type === 'available'
  const isPositive = value > 0
  
  const formattedValue = typeof value === 'number' ? value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : value

  return (
    <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5 shadow-lg">
      <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        {(isPnL || isEquity) && <span className="text-slate-400 text-lg font-bold">$</span>}
        <p className={`text-2xl font-black tracking-tight ${
          isPnL
            ? isPositive ? 'text-green-400' : 'text-red-400'
            : 'text-white'
        }`}>
          {isPnL && isPositive ? '+' : ''}{formattedValue}
        </p>
      </div>
    </div>
  )
}
