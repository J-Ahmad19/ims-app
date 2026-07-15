import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

export default function Navbar() {
  const navRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
  }, [])

  return (
    <nav ref={navRef} className="relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">StockFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-ink-300 hover:text-white transition-colors">Product</a>
            <a href="#" className="text-sm text-ink-300 hover:text-white transition-colors">Solutions</a>
            <a href="#" className="text-sm text-ink-300 hover:text-white transition-colors">Pricing</a>
            <a href="#" className="text-sm text-ink-300 hover:text-white transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex text-sm text-ink-300 hover:text-white transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link to="/signup" className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/25">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
