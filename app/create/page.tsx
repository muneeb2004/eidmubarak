'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    recipientName: '',
    message: '',
    senderName: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientName: formData.recipientName,
          message: formData.message,
          senderName: formData.senderName || 'Eid Mubarak',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(
          data.details?.[0] || data.error || 'Failed to create wish'
        )
      }

      const data = await response.json()
      router.push(`/wish/${data.hash}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center p-4 sm:p-8 pt-24 relative z-0 min-h-screen bg-background-light overflow-x-hidden">
      {/* Background decorative elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full flex justify-between items-center p-6 max-w-5xl mx-auto absolute top-0 left-0 right-0 z-10">
        <Link href="/dashboard">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md transition-shadow text-text-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" title="Back to Dashboard">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
        </Link>
        <div className="flex items-center gap-2 opacity-50">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
          </svg>
          <span className="font-bold text-sm tracking-tight">Modern Joy</span>
        </div>
      </header>

      <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-glow p-8 sm:p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
            Create Magic Link
          </h1>
          <p className="text-text-muted">
            Generate a personalized Eid greeting to share.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg text-sm">{error}</div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 ml-1" htmlFor="recipientName">To</label>
            <div className="soft-input bg-surface-light rounded-2xl flex items-center px-4 h-14">
              <span className="material-symbols-outlined text-text-muted mr-3">person</span>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Recipient's name"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 ml-1" htmlFor="message">Message</label>
            <div className="soft-input bg-surface-light rounded-[20px] p-4 flex items-start h-auto">
              <span className="material-symbols-outlined text-text-muted mr-3 mt-0.5">edit_note</span>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your heartfelt Eid wishes..."
                required
                disabled={isLoading}
                rows={4}
                className="resize-y min-h-[100px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 ml-1" htmlFor="senderName">From</label>
            <div className="soft-input bg-surface-light rounded-2xl flex items-center px-4 h-14">
              <span className="material-symbols-outlined text-text-muted mr-3">favorite</span>
              <input
                type="text"
                id="senderName"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                placeholder="Your name"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.recipientName || !formData.message}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full shadow-glow mt-8 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? 'Creating...' : 'Generate Link'}</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </form>
      </div>
    </main>
  )
}
