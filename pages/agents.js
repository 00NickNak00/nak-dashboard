import Layout from '../components/Layout'
import AgentCard from '../components/AgentCard'

const agents = [
  { name: 'Trader', description: 'Execution, position management, risk control', status: 'idle' },
  { name: 'Researcher', description: 'Deep analysis, narrative detection, news scanning', status: 'offline' },
  { name: 'Monitor', description: 'Price alerts, funding scans, 24/7 health checks', status: 'offline' },
  { name: 'Analyst', description: 'Technical analysis, pattern recognition, backtesting', status: 'offline' },
]

export default function AgentsPage() {
  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Agent Team</h1>
          <p className="text-purple-300">Monitor your trading agents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div key={agent.name} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  agent.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  agent.status === 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm">{agent.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
