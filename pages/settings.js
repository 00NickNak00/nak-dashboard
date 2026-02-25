import Layout from '../components/Layout'

export default function SettingsPage() {
  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-purple-300">Configure your dashboard</p>
        </div>

        <div className="max-w-2xl">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-2">API Keys</h3>
              <p className="text-slate-400 text-sm">Manage your API integrations</p>
            </div>

            <hr className="border-purple-500/20" />

            <div>
              <h3 className="text-white font-semibold mb-2">Notifications</h3>
              <p className="text-slate-400 text-sm">Configure alerts and updates</p>
            </div>

            <hr className="border-purple-500/20" />

            <div>
              <h3 className="text-white font-semibold mb-2">Theme</h3>
              <p className="text-slate-400 text-sm">Dark mode (always on)</p>
            </div>

            <hr className="border-purple-500/20" />

            <div>
              <h3 className="text-white font-semibold mb-2">About</h3>
              <p className="text-slate-400 text-sm">NAK Trading Dashboard v1.0</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
