const badges = [
  { name: 'SOC 2 Type II', desc: 'Security & availability' },
  { name: 'GDPR Compliant', desc: 'Data protection' },
  { name: 'ISO 27001', desc: 'Info security mgmt' },
  { name: '99.99% Uptime', desc: 'SLA guaranteed' },
  { name: 'AWS Partner', desc: 'Cloud infrastructure' },
]

const logos = [
  'Shopify', 'Warehouse Co', 'LogiTrans', 'OmniShip', 'QuickStock',
  'RetailPlus', 'CargoHub', 'ShipFast', 'StockPile', 'DistribuPro',
]

export default function TrustBadges() {
  return (
    <section className="relative z-10 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Trusted by industry leaders
          </h2>
          <p className="text-ink-400 text-lg max-w-xl mx-auto">
            Enterprise-grade security, compliance, and reliability built into every layer.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className="glass rounded-xl p-4 sm:p-5 text-center space-y-2 hover:bg-white/[0.10] transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-white">{badge.name}</div>
              <div className="text-[11px] text-ink-500">{badge.desc}</div>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 text-xs font-medium text-ink-600 bg-ink-950">POWERING 10,000+ WAREHOUSES GLOBALLY</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6 sm:gap-8 items-center justify-items-center opacity-40">
          {logos.map((logo) => (
            <div key={logo} className="text-sm font-bold text-ink-400 tracking-widest whitespace-nowrap">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
