export default function AgentCard({ name, status }) {
  const statusColor = {
    active: 'text-green-400 bg-green-500/10',
    idle: 'text-yellow-400 bg-yellow-500/10',
    offline: 'text-slate-400 bg-slate-500/10',
  }[status] || 'text-slate-400 bg-slate-500/10'

  const statusDot = {
    active: 'bg-green-500',
    idle: 'bg-yellow-500',
    offline: 'bg-slate-500',
  }[status] || 'bg-slate-500'

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/60 transition-all">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-semibold">{name}</h4>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${statusDot}`} />
          <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  )
}
