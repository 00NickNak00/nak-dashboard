export default function TradingCard({ title, value, type }) {
  const isPnL = type === 'pnl'
  const isPositive = value > 0

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-all">
      <p className="text-slate-400 text-sm mb-2">{title}</p>
      <p className={`text-3xl font-bold ${
        isPnL
          ? isPositive ? 'text-green-400' : 'text-red-400'
          : 'text-purple-300'
      }`}>
        {isPnL ? (isPositive ? '+' : '') : ''}{value}
      </p>
    </div>
  )
}
