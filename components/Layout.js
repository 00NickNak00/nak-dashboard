import { useState } from 'react'
import Link from 'next/link'

const menuItems = [
  { icon: '🏠', label: 'Dashboard', href: '/' },
  { icon: '💰', label: 'Billing', href: '/billing' },
  { icon: '🤖', label: 'Agents', href: '/agents' },
  { icon: '📈', label: 'Trading', href: '/trading' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
  { icon: '📊', label: 'Analytics', href: '/analytics' },
]

export default function Layout({ children }) {
  const [activeMenu, setActiveMenu] = useState(0)

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-20 bg-gradient-to-b from-slate-900 to-purple-900 border-r border-purple-500/30 flex flex-col items-center py-6 space-y-6">
        {menuItems.map((item, idx) => (
          <Link 
            key={idx} 
            href={item.href}
            className={`p-3 rounded-lg transition-all duration-200 ${
              activeMenu === idx
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                : 'text-slate-400 hover:text-purple-300 hover:bg-purple-500/10'
            }`}
            onClick={() => setActiveMenu(idx)}
            title={item.label}
          >
            {item.icon}
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
