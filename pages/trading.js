import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

export default function TradingPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/trading')
        setData(await res.json())
      } catch (err) {
        console.error('Error fetching trading data:', err)
      }
    }
    fetchData()
  }, [])

  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Trading Status</h1>
          <p className="text-purple-300">Positions and performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm mb-2">Mode</h3>
            <p className="text-3xl font-bold text-purple-300">{data?.mode || 'Paper'}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm mb-2">Capital</h3>
            <p className="text-3xl font-bold text-purple-300">${data?.capital || 10000}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-slate-400 text-sm mb-2">Open Positions</h3>
            <p className="text-3xl font-bold text-purple-300">{data?.positions?.length || 0}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Position History</h2>
            <p className="text-slate-400">No trades yet</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
