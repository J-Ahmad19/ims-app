export default function DashboardHome() {
  const stats = [
    { label: 'Total Value', value: '$2.4M', change: '+14.2%', up: true },
    { label: 'Total SKUs', value: '18,342', change: '+12%', up: true },
    { label: 'Active Orders', value: '847', change: '+8.3%', up: true },
    { label: 'Low Stock Alerts', value: '14', change: '-22%', up: false },
  ];

  const warehouses = [
    { name: 'NYC - Manhattan', code: 'NYC', capacity: 84 },
    { name: 'LAX - Logistics', code: 'LAX', capacity: 62 },
    { name: 'ORD - Central', code: 'ORD', capacity: 45 },
    { name: 'DFW - Southern', code: 'DFW', capacity: 91 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-sm text-ink-400 mt-1">Here is what's happening in your supply chain today.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5 space-y-2">
            <div className="text-sm text-ink-400 font-medium">{stat.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className={`text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded-lg ${
                stat.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.up ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                </svg>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts / Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouse Capacity Card */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Warehouse Network Capacity</h2>
            <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300">View All Locations &rarr;</button>
          </div>
          <div className="space-y-6">
            {warehouses.map((wh) => (
              <div key={wh.code} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-sm font-medium text-white">{wh.name}</div>
                    <div className="text-xs text-ink-500">{wh.code}</div>
                  </div>
                  <div className={`text-sm font-mono ${wh.capacity > 85 ? 'text-amber-400' : 'text-ink-400'}`}>
                    {wh.capacity}%
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-ink-800/50 overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${
                      wh.capacity > 85 ? 'from-amber-500 to-rose-500' : 'from-indigo-500 to-violet-500'
                    }`}
                    style={{ width: `${wh.capacity}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts Card */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Priority Alerts</h2>
          <div className="space-y-4">
            {[
              { title: 'Low Stock: Wireless Earbuds', time: '10 mins ago', type: 'warning' },
              { title: 'Inbound Shipment Delayed', time: '2 hours ago', type: 'error' },
              { title: 'DFW Capacity over 90%', time: '5 hours ago', type: 'warning' },
              { title: 'New Vendor Onboarded', time: '1 day ago', type: 'success' },
            ].map((alert, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  alert.type === 'warning' ? 'bg-amber-400' : 
                  alert.type === 'error' ? 'bg-rose-400' : 'bg-emerald-400'
                }`} />
                <div>
                  <div className="text-sm font-medium text-white">{alert.title}</div>
                  <div className="text-xs text-ink-500 mt-0.5">{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 rounded-xl border border-white/10 text-xs font-medium text-ink-400 hover:text-white hover:bg-white/5 transition-all">
            Dismiss All
          </button>
        </div>
      </div>
    </div>
  )
}