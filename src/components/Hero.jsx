import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const badgeRef = useRef(null)
  const headingRef = useRef(null)
  const descRef = useRef(null)
  const buttonsRef = useRef(null)
  const socialRef = useRef(null)
  const statValues = useRef([])
  const barRef = useRef(null)
  const whBars = useRef([])

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(badgeRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
      .fromTo(headingRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.2')
      .fromTo(descRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .fromTo(buttonsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo(socialRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2')

    gsap.fromTo(rightRef.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 })

    statValues.current.forEach((el) => {
      if (!el) return
      const finalVal = parseFloat(el.dataset.value)
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: finalVal, duration: 1.5, ease: 'power2.out', snap: { textContent: finalVal < 100 ? 1 : 10 },
      })
    })

    if (barRef.current) {
      gsap.fromTo(barRef.current, { width: '0%' }, { width: '71.4%', duration: 1.2, ease: 'power3.inOut', delay: 0.8 })
    }
    whBars.current.forEach((bar) => {
      if (!bar) return
      gsap.fromTo(bar, { width: '0%' }, { width: bar.dataset.width, duration: 1, ease: 'power3.inOut', delay: 1 })
    })
  }, [])

  return (
    <section ref={sectionRef} className="relative z-10 pt-12 pb-20 lg:pt-20 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div ref={leftRef} className="space-y-8">
            <div ref={badgeRef} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Now in public beta
            </div>
            <h1 ref={headingRef} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Inventory intelligence{' '}
              <span className="text-gradient">that moves as fast as your business</span>
            </h1>
            <p ref={descRef} className="text-lg text-ink-400 leading-relaxed max-w-lg">
              Real-time stock tracking, predictive restocking, and multi-warehouse logistics
              — unified in a single dashboard. Stop guessing. Start flowing.
            </p>
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3">
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40">
                Start free trial
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass text-ink-200 hover:text-white font-semibold text-sm transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch demo
              </button>
            </div>
            <div ref={socialRef} className="flex items-center gap-5 pt-2">
              <div className="flex -space-x-2">
                {['bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400'].map((c, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-ink-950 ring-2 ring-ink-950`} />
                ))}
              </div>
              <div className="text-sm text-ink-500">
                <span className="text-ink-300 font-semibold">2,400+</span> teams onboarded
              </div>
            </div>
          </div>

          <div ref={rightRef} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-transparent rounded-3xl blur-3xl" />
            <div className="relative glass rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-ink-300">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Live Dashboard
                </div>
                <span className="text-xs text-ink-500 font-mono">Updated 2s ago</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total SKUs', value: '18,342', change: '+12%', up: true },
                  { label: 'Orders', value: '847', change: '+8.3%', up: true },
                  { label: 'Alerts', value: '3', change: '-62%', up: false },
                ].map((stat, idx) => (
                  <div key={stat.label} className="glass rounded-xl p-3 sm:p-4 space-y-1">
                    <div className="text-xs text-ink-500">{stat.label}</div>
                    <div ref={(el) => { statValues.current[idx] = el }} data-value={stat.value.replace(/,/g, '')} className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
                    <div className={`text-xs font-medium flex items-center gap-0.5 ${stat.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={stat.up ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                      </svg>
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-400 font-medium">Warehouse Capacity</span>
                  <span className="text-ink-500 font-mono">71.4%</span>
                </div>
                <div className="h-2 rounded-full bg-ink-800 overflow-hidden">
                  <div ref={barRef} className="h-full w-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {['NYC', 'LAX', 'ORD', 'DFW'].map((wh, i) => (
                    <div key={wh} className="space-y-1">
                      <div className="text-[10px] text-ink-500 font-mono">{wh}</div>
                      <div className="h-1 rounded-full bg-ink-800 overflow-hidden">
                        <div
                          ref={(el) => { whBars.current[i] = el }}
                          data-width={`${60 + Math.random() * 35}%`}
                          className="h-full w-0 rounded-full bg-gradient-to-r from-indigo-500/80 to-violet-500/80"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-ink-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>All systems normal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>3 low-stock items</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
