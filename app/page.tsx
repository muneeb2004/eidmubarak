'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden h-screen max-h-screen">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen"></div>

      <div className="z-10 flex flex-col items-center max-w-[600px] w-full gap-12 sm:gap-16 transition-all duration-700">
        {/* Header */}
        <div className="text-content text-center flex flex-col gap-2">
          <p className="font-body text-muted dark:text-slate-400 font-medium tracking-widest uppercase text-sm mb-2">
            A Special Message For You
          </p>
          <h1 className="font-display text-[36px] sm:text-[48px] font-bold leading-tight text-text-main dark:text-slate-50 tracking-tight">
            Eid Mubarak
          </h1>
        </div>

        {/* Interactive Envelope Graphic */}
        <Link href="/create" className="relative group cursor-pointer">
          {/* Glow effect behind envelope */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-primary/40 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
          <div className="envelope-graphic relative w-[180px] h-[120px] sm:w-[240px] sm:h-[160px] transform transition-all duration-500 group-hover:-translate-y-2 animate-float shadow-glow group-hover:shadow-glow-hover rounded-xl bg-surface dark:bg-slate-800 border border-primary/10 overflow-hidden flex items-center justify-center">
            {/* Envelope Flap (Top) */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent border-b border-primary/5 z-10">
              <svg className="w-full h-full text-primary/20" viewBox="0 0 240 80" fill="none">
                <path d="M0 0L120 70L240 0" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            {/* Envelope Body Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FAD59B] to-[#e64cbf] opacity-10"></div>

            {/* Decorative Seal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-surface dark:bg-slate-800 rounded-full shadow-md z-20 flex items-center justify-center border border-primary/20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
              <span className="material-symbols-outlined text-primary text-xl sm:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
            </div>

            {/* Envelope Fold Lines */}
            <svg className="absolute inset-0 w-full h-full text-primary/10" viewBox="0 0 240 160" fill="none">
              <path d="M0 160L120 70L240 160" stroke="currentColor" strokeWidth="2" />
              <path d="M0 0L80 80" stroke="currentColor" strokeWidth="1" />
              <path d="M240 0L160 80" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        </Link>

        {/* CTA Area */}
        <div className="text-content flex justify-center w-full px-4">
          <Link href="/create">
            <button className="group relative flex items-center justify-center w-full sm:w-[200px] h-14 rounded-full bg-primary text-white font-display font-semibold text-[16px] tracking-wide shadow-glow hover:shadow-glow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Open Letter
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </span>
              {/* Button hover highlight */}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
