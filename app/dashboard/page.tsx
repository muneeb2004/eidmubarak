'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Wish {
  hash: string
  recipientName: string
  message: string
  senderName: string
  createdAt: string
}

export default function DashboardPage() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  useEffect(() => {
    fetchWishes()
  }, [])

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes')
      if (!res.ok) {
        if (res.status === 401) window.location.href = '/login'
        throw new Error('Failed to fetch wishes')
      }
      const data = await res.json()
      setWishes(data)
    } catch (err) {
      setError('Failed to load magic links.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (hash: string) => {
    const url = `${window.location.origin}/wish/${hash}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedHash(hash)
      setTimeout(() => setCopiedHash(null), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  return (
    <main className="min-h-screen p-6 sm:p-12 bg-background-light">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-text-main mb-2">Creator Dashboard</h1>
            <p className="text-text-muted">Manage all generated links below.</p>
          </div>
          
          <Link href="/create">
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold shadow-glow hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Create New Link
            </button>
          </Link>
        </header>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>
        ) : loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : wishes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-100">
            <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4 text-primary opacity-50">
              <span className="material-symbols-outlined text-3xl">mail</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-text-main">No links generated yet</h3>
            <p className="text-text-muted mb-6">Create your first personalized Eid greeting to share.</p>
            <Link href="/create" className="text-primary font-semibold hover:underline">
              Get Started →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {wishes.map((wish) => (
                <li key={wish.hash} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-text-main truncate">To: {wish.recipientName}</h3>
                      <span className="text-xs text-text-muted bg-slate-100 px-2 py-0.5 rounded-md self-center">
                        {new Date(wish.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-text-muted text-sm truncate opacity-80">
                      "{wish.message}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => copyToClipboard(wish.hash)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-semibold ${
                        copiedHash === wish.hash 
                          ? 'border-green-500 text-green-600 bg-green-50' 
                          : 'border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {copiedHash === wish.hash ? 'check' : 'content_copy'}
                      </span>
                      {copiedHash === wish.hash ? 'Copied!' : 'Copy Link'}
                    </button>
                    <Link href={`/wish/${wish.hash}`} target="_blank" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-text-muted hover:text-primary hover:bg-slate-200 transition-colors" title="View Preview">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
