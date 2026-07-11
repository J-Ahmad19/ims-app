import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5001/dashboard-stats');
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-ink-400 text-center py-20">Loading live metrics...</div>;
  }

  // --- Chart.js Configurations ---

  // 1. Doughnut Chart (Inventory Distribution)
  const doughnutData = {
    labels: data.distribution.map(d => d.code),
    datasets: [
      {
        data: data.distribution.map(d => d.total_items),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',   // Indigo
          'rgba(168, 85, 247, 0.8)',   // Purple
          'rgba(236, 72, 153, 0.8)',   // Pink
          'rgba(245, 158, 11, 0.8)',   // Amber
          'rgba(16, 185, 129, 0.8)',   // Emerald
        ],
        borderColor: 'rgba(15, 23, 42, 0.5)',
        borderWidth: 2,
        hoverOffset: 4
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 20, font: { family: 'Inter' } } },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1', padding: 12, cornerRadius: 8 }
    },
    cutout: '70%', // Makes it a sleek ring
  };

  // 2. Bar Chart (Warehouse Capacity)
  const barData = {
    labels: data.warehouses.map(w => w.code),
    datasets: [
      {
        label: 'Capacity Used (%)',
        data: data.warehouses.map(w => w.capacity_percentage),
        backgroundColor: data.warehouses.map(w => 
          w.capacity_percentage > 85 ? 'rgba(244, 63, 94, 0.8)' : 'rgba(99, 102, 241, 0.8)'
        ),
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1', padding: 12, cornerRadius: 8 }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-sm text-ink-400 mt-1">Live data from your supply chain network.</p>
        </div>
        <Link to="/dashboard/receiving" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create PO
        </Link>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Value', value: `$${Number(data.stats.totalValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` },
          { label: 'Total SKUs', value: data.stats.totalSKUs.toLocaleString() },
          { label: 'Active Orders', value: data.stats.activeOrders.toLocaleString() },
          { label: 'Low Stock Alerts', value: data.stats.lowStockCount.toLocaleString(), isAlert: data.stats.lowStockCount > 0 },
        ].map((stat, idx) => (
          <div key={idx} className="glass rounded-2xl p-5 space-y-2">
            <div className="text-sm text-ink-400 font-medium">{stat.label}</div>
            <div className={`text-3xl font-bold ${stat.isAlert ? 'text-amber-400' : 'text-white'}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Doughnut Chart: Inventory Distribution */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6">Inventory Distribution</h2>
          <div className="flex-1 relative min-h-[250px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center mt-[-20px]">
                <div className="text-xs text-ink-400 font-medium uppercase tracking-wider">Total Units</div>
                <div className="text-2xl font-bold text-white">
                  {data.distribution.reduce((sum, item) => sum + Number(item.total_items), 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart: Capacity */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Network Capacity Breakdown</h2>
            <Link to="/dashboard/warehouses" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">Manage Locations &rarr;</Link>
          </div>
          <div className="relative min-h-[250px] w-full">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Real-Time Alerts Row */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Real-Time Alerts</h2>
        <div className="space-y-4">
          {data.alerts.length === 0 ? (
            <div className="text-sm text-emerald-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              No critical alerts. All systems nominal.
            </div>
          ) : (
            data.alerts.map((alert, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0 bg-amber-400 animate-pulse" />
                <div>
                  <div className="text-sm font-medium text-white">{alert.title}</div>
                  <div className="text-xs text-ink-500 mt-0.5">Requires attention</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}