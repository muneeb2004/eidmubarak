'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#FDE8EF] relative overflow-hidden">
      {/* Soft radial glow in center */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(236,26,148,0.08) 0%, transparent 70%)'
      }} />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-6">

        {/* Label */}
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8F4A6B]">
          Greeting Generator
        </p>

        {/* Title */}
        <h1 className="font-display text-[2.6rem] sm:text-[3rem] font-bold text-[#2D1B2E] leading-tight -mt-4">
          Eid Mubarak
        </h1>

        {/* Envelope Graphic */}
        <Link href="/dashboard" className="group relative" aria-label="Open Dashboard">
          {/* ... envelope internal layers remain same ... */}
          {/* Glow behind envelope */}
          <div className="absolute inset-0 rounded-2xl blur-2xl scale-110" style={{
            background: 'radial-gradient(ellipse at center, rgba(236,26,148,0.18) 0%, rgba(229,128,178,0.10) 60%, transparent 100%)'
          }} />

          {/* Envelope body */}
          <div className="relative w-[220px] h-[148px] sm:w-[260px] sm:h-[175px] group-hover:-translate-y-2 transition-transform duration-500">

            {/* Back of envelope (white card slightly visible) */}
            <div className="absolute inset-0 bg-white rounded-xl shadow-[0_8px_40px_rgba(236,26,148,0.15)]" />

            {/* Pink envelope body overlay */}
            <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(160deg,#F9D5E5 0%,#F0B8D2 100%)' }}>
              {/* Bottom flap triangle */}
              <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 260 175" fill="none" preserveAspectRatio="none">
                <path d="M0 175 L130 90 L260 175Z" fill="rgba(236,26,148,0.12)" />
              </svg>
              {/* Left fold */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 175" fill="none" preserveAspectRatio="none">
                <path d="M0 0 L130 90 L0 175Z" fill="rgba(236,26,148,0.08)" />
              </svg>
              {/* Right fold */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 175" fill="none" preserveAspectRatio="none">
                <path d="M260 0 L130 90 L260 175Z" fill="rgba(236,26,148,0.08)" />
              </svg>
            </div>

            {/* Top flap (closes over the top) */}
            <div className="absolute top-0 left-0 w-full overflow-hidden rounded-t-xl" style={{ height: '55%' }}>
              <svg className="w-full h-full" viewBox="0 0 260 96" fill="none" preserveAspectRatio="none">
                <path d="M0 0 L260 0 L130 96Z" fill="#EDA8C8" />
              </svg>
            </div>

            {/* Heart seal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[#EC1A94] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
            </div>
          </div>
        </Link>

        {/* CTA Button */}
        <Link href="/dashboard">
          <button className="flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-display font-semibold text-sm tracking-wide shadow-[0_4px_20px_rgba(236,26,148,0.4)] hover:shadow-[0_6px_28px_rgba(236,26,148,0.55)] hover:-translate-y-0.5 transition-all duration-300"
            style={{ background: 'linear-gradient(135deg,#EC1A94 0%,#D4189E 100%)' }}>
            Admin Login
            <span className="text-base">→</span>
          </button>
        </Link>

      </div>
    </main>
  )
}
