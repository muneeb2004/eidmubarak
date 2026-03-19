'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Letter } from '@/src/components/Letter'
import { WishNotFound } from '@/src/components/WishNotFound'
import { AnimatedEnvelope } from '@/src/components/AnimatedEnvelope'

interface Wish {
  hash: string
  recipientName: string
  message: string
  senderName?: string
  createdAt: string
}

type ViewState = 'landing' | 'envelope' | 'letter'

export default function WishPage() {
  const params = useParams()
  const hash = params?.id as string
  const [wish, setWish] = useState<Wish | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewState, setViewState] = useState<ViewState>('landing')

  useEffect(() => {
    const fetchWish = async () => {
      try {
        setLoading(true)
        setError(null)

        // Validate hash format before API call
        if (!hash || !/^[a-f0-9]{16}$/.test(hash)) {
          setError('Invalid wish link')
          setLoading(false)
          return
        }

        const response = await fetch(`/api/wishes/${hash}`)

        if (!response.ok) {
          setError('Wish not found')
          setWish(null)
          setLoading(false)
          return
        }

        const data = await response.json()
        setWish(data)
        setError(null)
      } catch (err) {
        setError('Wish not found')
        setWish(null)
      } finally {
        setLoading(false)
      }
    }

    if (hash) {
      fetchWish()
    }
  }, [hash])

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-text-main font-body">Loading wish...</p>
        </div>
      </main>
    )
  }

  // Error state
  if (error || !wish) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <WishNotFound />
      </main>
    )
  }

  // Transition handlers
  const handleLandingClick = () => {
    setViewState('envelope')
  }

  const handleEnvelopeOpen = () => {
    setViewState('letter')
  }

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeIn' as const } },
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glow — shared across all states */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen"></div>

      <AnimatePresence mode="wait">
        {/* STATE 1: Landing */}
        {viewState === 'landing' && (
          <motion.div
            key="landing"
            className="z-10 flex flex-col items-center max-w-[600px] w-full gap-12 sm:gap-16"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Header */}
            <div className="text-content text-center flex flex-col gap-2 mb-4">
              <p className="font-body text-text-muted font-medium tracking-widest uppercase text-sm mb-2">
                A Special Message For You
              </p>
              <h1 className="font-display text-[36px] sm:text-[48px] font-bold leading-tight text-text-main tracking-tight">
                Eid Mubarak
              </h1>
            </div>

            {/* Interactive Animated Envelope replaces the static design */}
            <div className="w-full flex justify-center mt-4">
              <AnimatedEnvelope onOpen={handleEnvelopeOpen} />
            </div>
          </motion.div>
        )}

        {/* STATE 3: Letter */}
        {viewState === 'letter' && (
          <motion.div
            key="letter"
            className="z-10 flex flex-col items-center w-full"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Back Button / Minimal Header */}
            <div className="fixed top-0 left-0 w-full p-6 flex justify-start z-10">
              {/* Intentional navigation lockdown for recipient: No back button provided. */}
            </div>

            <div className="w-full flex justify-center pt-16">
              <Letter
                recipientName={wish.recipientName}
                message={wish.message}
                senderName={wish.senderName || 'Eid Mubarak'}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
