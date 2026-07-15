import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  PointElement, LineElement, BarElement,
  Title, Filler,
} from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Filler)

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.96 },
  visible: (i) => ({
    y: 0, opacity: 1, scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const lineData = {
  labels: months,
  datasets: [{
    label: 'Stock Levels',
    data: [12400, 13900, 15200, 14800, 16500, 18342],
    borderColor: 'rgba(99, 102, 241, 0.9)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    fill: true, tension: 0.4,
    pointBackgroundColor: 'rgba(99, 102, 241, 1)',
    pointBorderColor: '#0f172a', pointBorderWidth: 2,
    pointRadius: 4, pointHoverRadius: 6,
  }],
}

const lineOptions = {
  responsive: true, maintainAspectRatio: false,
  animation: { duration: 1800, easing: 'easeOutQuart' },
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1', padding: 12, cornerRadius: 8 },
  },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
  },
}

const doughnutData = {
  labels: ['Electronics', 'Apparel', 'Food & Bev', 'Healthcare', 'Industrial'],
  datasets: [{
    data: [42, 28, 18, 8, 4],
    backgroundColor: [
      'rgba(99, 102, 241, 0.8)', 'rgba(168, 85, 247, 0.8)',
      'rgba(236, 72, 153, 0.8)', 'rgba(245, 158, 11, 0.8)',
      'rgba(16, 185, 129, 0.8)',
    ],
    borderColor: 'rgba(15, 23, 42, 0.5)', borderWidth: 2,
  }],
}

const doughnutOptions = {
  responsive: true, maintainAspectRatio: false,
  animation: { duration: 1400, easing: 'easeOutQuart', animateRotate: true },
  plugins: {
    legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16, font: { family: 'Inter' } } },
    tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1', padding: 12, cornerRadius: 8 },
  },
  cutout: '72%',
}

const barData = {
  labels: months,
  datasets: [{
    label: 'Orders Fulfilled',
    data: [320, 415, 480, 510, 590, 847],
    backgroundColor: [
      'rgba(99, 102, 241, 0.5)', 'rgba(99, 102, 241, 0.5)',
      'rgba(99, 102, 241, 0.5)', 'rgba(99, 102, 241, 0.5)',
      'rgba(99, 102, 241, 0.5)', 'rgba(99, 102, 241, 0.9)',
    ],
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
    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
  },
}

const statCards = [
  { label: 'Revenue Growth', value: 164, suffix: '%', desc: 'YoY inventory value increase', color: 'text-emerald-400', prefix: '+' },
  { label: 'Order Accuracy', value: 99.2, suffix: '%', desc: 'Across all warehouses', color: 'text-indigo-400' },
  { label: 'Avg. Fulfillment', value: 2.4, suffix: 'h', desc: 'From order to dispatch', color: 'text-violet-400' },
]

function AnimatedValue({ value, suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayed(Number(v.toFixed(value % 1 === 0 ? 0 : 1))),
    })
    return () => controls.stop()
  }, [isInView, value])

  return <span ref={ref}>{prefix}{displayed}{suffix}</span>
}

export default function ChartsSection() {
  const sectionRef = useRef(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRendered(true); obs.disconnect() } },
      { rootMargin: '-80px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative z-10 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Performance <span className="text-gradient">at a glance</span>
          </h2>
          <p className="text-ink-400 text-lg">
            Live metrics that matter. Track trends, spot anomalies, and make data-driven decisions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-4 mb-10"
        >
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-5 sm:p-6 cursor-default"
            >
              <div className="text-xs text-ink-500 font-medium uppercase tracking-wider mb-1">{s.label}</div>
              <div className={`text-2xl sm:text-3xl font-extrabold ${s.color} mb-1 font-mono`}>
                <AnimatedValue value={s.value} suffix={s.suffix} prefix={s.prefix} />
              </div>
              <div className="text-sm text-ink-500">{s.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 gap-6"
        >
          <motion.div
            custom={0}
            variants={cardVariants}
            whileHover={{ y: -3, boxShadow: '0 0 40px rgba(99,102,241,0.1)' }}
            className="glass rounded-2xl p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Inventory Trend (6 Months)</h3>
              <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full">&uarr; +48%</span>
            </div>
            <div className="relative min-h-[260px]">
              {rendered && <Line data={lineData} options={lineOptions} />}
            </div>
          </motion.div>

          <motion.div
            custom={1}
            variants={cardVariants}
            whileHover={{ y: -3, boxShadow: '0 0 40px rgba(99,102,241,0.1)' }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-base font-semibold text-white mb-5">Categories</h3>
            <div className="relative min-h-[260px] flex items-center justify-center">
              {rendered && <Doughnut data={doughnutData} options={doughnutOptions} />}
            </div>
          </motion.div>

          <motion.div
            custom={2}
            variants={cardVariants}
            whileHover={{ y: -3, boxShadow: '0 0 40px rgba(99,102,241,0.1)' }}
            className="glass rounded-2xl p-6 lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Orders Fulfilled</h3>
              <span className="text-[11px] text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-full">6-month trend</span>
            </div>
            <div className="relative min-h-[220px]">
              {rendered && <Bar data={barData} options={barOptions} />}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
