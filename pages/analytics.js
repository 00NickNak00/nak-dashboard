import Layout from '../components/Layout'

export default function AnalyticsPage() {
  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-purple-300">Performance insights and trends</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Win Rate</h3>
            <p className="text-4xl font-bold text-green-400">--</p>
            <p className="text-slate-400 text-sm mt-2">No trades yet</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Total P&L</h3>
            <p className="text-4xl font-bold text-purple-300">$0.00</p>
            <p className="text-slate-400 text-sm mt-2">This month</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Avg Trade Duration</h3>
            <p className="text-4xl font-bold text-purple-300">--</p>
            <p className="text-slate-400 text-sm mt-2">No data</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Max Drawdown</h3>
            <p className="text-4xl font-bold text-purple-300">0%</p>
            <p className="text-slate-400 text-sm mt-2">All time</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
