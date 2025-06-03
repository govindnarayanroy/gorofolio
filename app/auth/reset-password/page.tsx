"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const accessToken = searchParams.get('access_token')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    if (!password || !confirm) {
      setMessage('Please enter and confirm your new password.')
      return
    }
    if (password !== confirm) {
      setMessage('Passwords do not match.')
      return
    }
    if (!accessToken) {
      setMessage('Invalid or missing reset token.')
      return
    }
    setLoading(true)
    try {
      // Set the access token for this session
      await supabase.auth.setSession({ access_token: accessToken, refresh_token: accessToken })
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMessage('Password updated! You can now log in.')
    } catch (err: any) {
      setMessage(err.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-6 text-2xl font-bold text-white text-center">Reset Your Password</h1>
        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">New Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-2 block text-sm font-medium text-white">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
          </div>
          {message && (
            <div className={`rounded-xl p-4 text-sm ${message.includes('updated') ? 'border border-green-500/30 bg-green-500/20 text-green-200' : 'border border-red-500/30 bg-red-500/20 text-red-200'}`}>{message}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-6 py-4 font-bold text-white"
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/login" className="text-blue-300 hover:text-blue-200">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}

// NOTE: Make sure your Supabase dashboard has the redirect URL for password reset set to /auth/reset-password
// Example: http://localhost:3000/auth/reset-password for dev, https://yourdomain.com/auth/reset-password for prod 