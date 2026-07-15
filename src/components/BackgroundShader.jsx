import { motion } from 'framer-motion'

const orbs = [
  { size: 'w-[55%] h-[55%]', color: 'bg-indigo-500/8', x: 'left-[-10%]', y: 'top-[-15%]', dur: 22, xDelta: 50, yDelta: -40, sMin: 0.92, sMax: 1.08 },
  { size: 'w-[40%] h-[40%]', color: 'bg-violet-500/6', x: 'right-[-10%]', y: 'bottom-[-15%]', dur: 26, xDelta: -50, yDelta: 30, sMin: 0.88, sMax: 1.12 },
  { size: 'w-[30%] h-[30%]', color: 'bg-fuchsia-500/5', x: 'left-[40%]', y: 'top-[35%]', dur: 20, xDelta: 30, yDelta: -30, sMin: 0.9, sMax: 1.1 },
  { size: 'w-[20%] h-[20%]', color: 'bg-emerald-500/4', x: 'right-[25%]', y: 'top-[15%]', dur: 24, xDelta: -35, yDelta: 25, sMin: 0.85, sMax: 1.15 },
]

const particles = [
  { top: '15%', left: '20%', size: 'w-1 h-1', color: 'bg-indigo-400/25', dur: 3.5, delay: 0 },
  { top: '40%', right: '15%', size: 'w-1.5 h-1.5', color: 'bg-violet-400/20', dur: 4.5, delay: 0.8 },
  { top: '70%', left: '35%', size: 'w-2 h-2', color: 'bg-fuchsia-400/15', dur: 5, delay: 1.5 },
  { top: '25%', right: '40%', size: 'w-1 h-1', color: 'bg-emerald-400/15', dur: 3.8, delay: 2.2 },
  { top: '80%', left: '70%', size: 'w-1.5 h-1.5', color: 'bg-indigo-400/15', dur: 4.2, delay: 0.5 },
]

export default function BackgroundShader() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className={`absolute ${o.x} ${o.y} ${o.size} ${o.color} rounded-full blur-[140px]`}
          animate={{
            x: [0, o.xDelta, -o.xDelta * 0.6, 0],
            y: [0, o.yDelta, -o.yDelta * 0.5, 0],
            scale: [1, o.sMax, o.sMin, 1],
          }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {particles.map((p, i) => (
        <motion.div
          key={`p${i}`}
          className={`absolute ${p.top} ${p.left || ''} ${p.right || ''} ${p.size} ${p.color} rounded-full`}
          animate={{
            opacity: [0.1, 0.7, 0.1],
            scale: [1, 2.5, 1],
          }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}
    </div>
  )
}
