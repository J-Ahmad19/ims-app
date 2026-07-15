import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const testimonials = [
  {
    quote: 'StockFlow cut our stockout incidents by 78% in the first quarter. The predictive restocking alone saved us over $200K in lost sales.',
    name: 'Sarah Chen',
    role: 'VP of Supply Chain, OmniShip Logistics',
    initials: 'SC', color: 'bg-indigo-500',
  },
  {
    quote: 'We consolidated five spreadsheets and three legacy tools into one dashboard. Our team finally has a single source of truth for inventory.',
    name: 'Marcus Rivera',
    role: 'COO, RetailPlus Inc.',
    initials: 'MR', color: 'bg-violet-500',
  },
  {
    quote: 'The multi-warehouse routing optimization paid for itself in six weeks. Our delivery times dropped 34% across the network.',
    name: 'Aisha Patel',
    role: 'Director of Ops, CargoHub',
    initials: 'AP', color: 'bg-fuchsia-500',
  },
  {
    quote: 'Onboarding our suppliers through the portal was seamless. They love the transparency, and we love not chasing POs via email.',
    name: 'James Okonkwo',
    role: 'Procurement Lead, DistribuPro',
    initials: 'JO', color: 'bg-emerald-500',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: (i) => ({
    y: 0, opacity: 1, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
}

export default function Testimonials() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

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
            Trusted by <span className="text-gradient">operations leaders</span>
          </h2>
          <p className="text-ink-400 text-lg">
            See how supply chain teams are transforming their workflows with StockFlow.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 gap-5"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
              className="group glass rounded-2xl p-6 sm:p-7 space-y-4 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${t.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <svg className="w-6 h-6 text-indigo-500/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.647-2.917-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.647-2.917-1.179z" />
              </svg>
              <p className="text-sm sm:text-base text-ink-300 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-1">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                  className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-bold text-white`}
                >
                  {t.initials}
                </motion.div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-ink-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
