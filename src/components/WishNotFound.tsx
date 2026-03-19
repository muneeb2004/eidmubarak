'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function WishNotFound() {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center max-w-md w-full text-center space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Illustration / Icon */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-4">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl"></div>
        <span className="material-symbols-outlined text-muted relative z-10" style={{ fontVariationSettings: "'FILL' 1", fontSize: '4.5rem' }}>
          heart_broken
        </span>
      </div>

      {/* Text Content */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main">
          Oops, link expired.
        </h1>
        <p className="text-base md:text-lg text-text-muted max-w-sm mx-auto leading-relaxed">
          Looks like this greeting got lost in the mail.
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <Link href="/create">
          <button className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-primary text-primary bg-transparent hover:bg-primary/5 active:bg-primary/10 rounded-full font-semibold text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light">
            Make Your Own
          </button>
        </Link>
      </div>
    </motion.div>
  )
}
