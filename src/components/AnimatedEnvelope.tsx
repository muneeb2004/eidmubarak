'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import React from 'react'

interface AnimatedEnvelopeProps {
  onOpen?: () => void
}

export function AnimatedEnvelope({ onOpen }: AnimatedEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true)
      // Delay the callback to let the animation play
      setTimeout(() => {
        onOpen?.()
      }, 1200)
    }
  }

  // Flap rotation animation
  const flapVariants = {
    closed: {
      rotateX: 0,
      transition: { duration: 0, ease: 'easeInOut' as const },
    },
    open: {
      rotateX: -180,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  // Letter slide-up animation
  const letterVariants = {
    hidden: {
      y: 0,
      opacity: 0.5,
    },
    visible: {
      y: -80,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  // Seal button animation
  const sealVariants = {
    idle: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.05,
      rotate: 15,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <div className="relative z-10 w-full max-w-[600px] flex items-center justify-center p-4">
      {/* Radial Aura Background */}
      <div className="absolute inset-0 aura-bg pointer-events-none"></div>

      {/* Envelope Interactive Area */}
      <motion.div
        className="envelope-wrapper relative w-[90vw] max-w-[400px] h-[260px] cursor-pointer group"
        onClick={handleClick}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' as const }}
      >
        {/* Envelope Back */}
        <div className="absolute inset-0 bg-[#E8D5E3] rounded-lg shadow-glow overflow-hidden">
          {/* Inner Letter Peek */}
          <motion.div
            className="letter-peek absolute inset-x-4 top-4 bottom-0 bg-surface rounded-t-lg shadow-inner z-0 flex items-start justify-center pt-8"
            variants={letterVariants}
            initial="hidden"
            animate={isOpen ? 'visible' : 'hidden'}
          >
            <div className="w-3/4 h-2 bg-muted/20 rounded-full mb-4"></div>
          </motion.div>
        </div>

        {/* Envelope Front Fold (Left/Right/Bottom) */}
        <div className="absolute inset-0 z-10 overflow-hidden rounded-lg pointer-events-none">
          {/* Left Flap */}
          <div className="absolute inset-0 bg-primary/20" style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}></div>
          {/* Right Flap */}
          <div className="absolute inset-0 bg-primary/20" style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }}></div>
          {/* Bottom Flap */}
          <div className="absolute inset-0 bg-primary/40" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }}></div>
        </div>

        {/* Envelope Top Flap (Animated) */}
        <motion.div
          className="flap absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
          variants={flapVariants}
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'top center' }}
        >
          <div
            className="absolute top-0 left-0 w-full h-[60%] bg-[#D496C4] rounded-t-lg"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
          ></div>
        </motion.div>

        {/* Seal Button */}
        {!isOpen && (
          <motion.button
            aria-label="Open Envelope"
            className="seal-btn absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[80px] h-[80px] bg-surface rounded-full shadow-seal flex flex-col items-center justify-center text-primary border-2 border-primary/10"
            variants={sealVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            <span className="font-display font-semibold text-xs tracking-wide">Open Me</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
