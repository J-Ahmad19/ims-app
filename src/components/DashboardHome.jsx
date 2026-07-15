import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, animate } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.96 },
  visible: (i) => ({
    y: 0, opacity: 1, scale: 1,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
}

const chartCardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i) => ({
    y: 0, opacity: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

function AnimatedStat({ value, format, isAlert }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const num = Number(value)
    const isFloat = num % 1 !== 0
    const controls = animate(0, num, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayed(v),
    })
    return () => controls.stop()
  }, [isInView, value])

  const formatted = format(displayed)

  return (
    <span ref={ref} className={`text-3xl font-bold ${isAlert ? 'text-amber-400' : 'text-white'}`}>
      {formatted}
    </span>
  )
}

function SkeletonRow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-4 w-56 rounded-lg bg-white/5 animate-pulse" />
        </div>
        <div className="h-10 w-28 rounded-xl bg-white/5 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-2xl p-5 space-y-3">
            <div className="h-4 w-20 rounded bg-white/5 animate-pulse" />
            <div className="h-8 w-32 rounded bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 min-h-[320px]">
          <div className="h-5 w-40 rounded bg-white/5 animate-pulse mb-6" />
          <div className="h-[250px] rounded-full bg-white/5 animate-pulse w-[200px] mx-auto" />
        </div>
        <div className="glass rounded-2xl p-6 lg:col-span-2 min-h-[320px]">
          <div className="h-5 w-52 rounded bg-white/5 animate-pulse mb-6" />
          <div className="h-[250px] rounded-lg bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardHome() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const headerRef = useRef(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5001/dashboard-stats')
        const result = await res.json()
        setData(result)
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) return <SkeletonRow />

  const doughnutData = {
    labels: data.distribution.map((d) => d.code),
    datasets: [{
      data: data.distribution.map((d) => d.total_items),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)', 'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)', 'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)',
      ],
      borderColor: 'rgba(15, 23, 42, 0.5)', borderWidth: 2, hoverOffset: 4,
    }],
  }

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 1400, easing: 'easeOutQuart', animateRotate: true },
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 20, font: { family: 'Inter' } } },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1', padding: 12, cornerRadius: 8 },
    },
    cutout: '70%',
  }

  const barData = {
    labels: data.warehouses.map((w) => w.code),
    datasets: [{
      label: 'Capacity Used (%)',
      data: data.warehouses.map((w) => w.capacity_percentage),
      backgroundColor: data.warehouses.map((w) =>
        w.capacity_percentage > 85 ? 'rgba(244, 63, 94, 0.8)' : 'rgba(99, 102, 241, 0.8)'
      ),
      borderRadius: 6,
    }],
  }

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 1600, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1', padding: 12, cornerRadius: 8 },
    },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    },
  }

  const stats = [
    {
      label: 'Total Value',
      raw: data.stats.totalValue,
      format: (v) => `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      label: 'Total SKUs',
      raw: data.stats.totalSKUs,
      format: (v) => Math.round(v).toLocaleString(),
    },
    {
      label: 'Active Orders',
      raw: data.stats.activeOrders,
      format: (v) => Math.round(v).toLocaleString(),
    },
    {
      label: 'Low Stock Alerts',
      raw: data.stats.lowStockCount,
      format: (v) => Math.round(v).toLocaleString(),
      isAlert: data.stats.lowStockCount > 0,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-sm text-ink-400 mt-1">Live data from your supply chain network.</p>
        </div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/dashboard/receiving"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create PO
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
            className="glass rounded-2xl p-5 space-y-2 cursor-default"
          >
            <div className="text-sm text-ink-400 font-medium">{stat.label}</div>
            <AnimatedStat
              value={stat.raw}
              format={stat.format}
              isAlert={stat.isAlert}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div
          custom={0}
          variants={chartCardVariants}
          whileHover={{ y: -3, boxShadow: '0 0 40px rgba(99,102,241,0.1)' }}
          className="glass rounded-2xl p-6 flex flex-col"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Inventory Distribution</h2>
          <div className="flex-1 relative min-h-[250px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3, ease: 'backOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center mt-[-20px]">
                <div className="text-xs text-ink-400 font-medium uppercase tracking-wider">Total Units</div>
                <div className="text-2xl font-bold text-white">
                  {data.distribution.reduce((sum, item) => sum + Number(item.total_items), 0).toLocaleString()}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          custom={1}
          variants={chartCardVariants}
          whileHover={{ y: -3, boxShadow: '0 0 40px rgba(99,102,241,0.1)' }}
          className="glass rounded-2xl p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Network Capacity Breakdown</h2>
            <Link to="/dashboard/warehouses" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
              Manage Locations &rarr;
            </Link>
          </div>
          <div className="relative min-h-[250px] w-full">
            <Bar data={barData} options={barOptions} />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={chartCardVariants}
        initial="hidden"
        animate="visible"
        custom={2}
        whileHover={{ y: -2 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">Real-Time Alerts</h2>
        <div className="space-y-4">
          {data.alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-emerald-400 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No critical alerts. All systems nominal.
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {data.alerts.map((alert, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardVariants}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                  className="flex gap-3 items-start p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default"
                >
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="mt-1 w-2 h-2 rounded-full flex-shrink-0 bg-amber-400"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">{alert.title}</div>
                    <div className="text-xs text-ink-500 mt-0.5">Requires attention</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
