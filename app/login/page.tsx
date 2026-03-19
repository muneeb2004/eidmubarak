'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirect') || '/dashboard'
  
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        router.push(redirectTo)
        router.refresh() // Ensure middleware catches the new cookie
      } else {
        const data = await response.json()
        setError(data.error || 'Invalid password')
      }
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm transition-all">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="soft-input bg-surface-light rounded-xl flex items-center px-4 h-14">
          <span className="material-symbols-outlined text-text-muted mr-3">key</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            required
            disabled={loading}
            className="w-full bg-transparent border-none focus:ring-0 p-0 text-text-main placeholder:text-text-muted/80"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full shadow-glow transition-transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Access Generator'}
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </form>
    </>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background-light">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-glow p-8 text-center relative">
        <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        
        <h1 className="text-2xl font-display font-bold text-text-main mb-2">Admin Access</h1>
        <p className="text-text-muted mb-8 text-sm">Enter the password to access the generator.</p>

        <Suspense fallback={<div className="h-14 flex justify-center items-center">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-8">
          <Link href="/" className="text-sm text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-xs">arrow_back</span>
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
