'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background Effects - Same as landing page */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-purple-600/15"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-2xl"></div>

      <div className="relative flex items-center justify-center min-h-screen px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="relative w-24 h-24 mx-auto mb-4 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700"></div>
                <Image
                  src="/images/logo.png"
                  alt="GoRoFolio"
                  fill
                  className="object-contain drop-shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to GoRoFolio
            </h1>
            <p className="text-blue-200/80">
              {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm ${
                  message.includes('Check your email') 
                    ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-200 border border-red-500/30'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-400 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            {/* Toggle Sign Up/Sign In */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setMessage('')
                }}
                className="text-blue-300 hover:text-blue-200 transition-colors duration-300"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <Link 
                href="/"
                className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 