'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Loading progress simulation for long network delays
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLoading) {
      setLoadingProgress(0)
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev // Stop at 90% until actual completion
          return prev + Math.random() * 15
        })
      }, 500)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLoading])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setLoadingProgress(10)

    try {
      if (isSignUp) {
        setLoadingText('Creating your account...')
        setLoadingProgress(20)
        // Try to sign up, catch error if email exists
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) {
          // Harden duplicate email error check
          const msg = error.message?.toLowerCase() || ''
          if (
            (msg.includes('already') && msg.includes('email')) ||
            msg.includes('already registered') ||
            msg.includes('already exists') ||
            msg.includes('email already in use') ||
            msg.includes('duplicate')
          ) {
            setMessage('Email already registered. Please log in or use "Forgot Password".')
            setIsLoading(false)
            return
          }
          setMessage(error.message || 'An error occurred. Please try again.')
          setIsLoading(false)
          return
        }
        setLoadingProgress(100)
        setMessage('Check your email for the confirmation link!')
      } else {
        setLoadingText('Connecting to server...')
        setLoadingProgress(15)
        // Add a small delay to show initial loading state
        await new Promise(resolve => setTimeout(resolve, 300))
        
        setLoadingText('Authenticating credentials...')
        setLoadingProgress(40)
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        setLoadingText('Loading your dashboard...')
        setLoadingProgress(80)
        // Add a small delay before redirect to show success state
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setLoadingProgress(100)
        setLoadingText('Redirecting...')
        await new Promise(resolve => setTimeout(resolve, 200))
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      let msg = error?.message || error?.error_description || error?.error || ''
      if (!msg || typeof msg !== 'string') {
        msg = 'An unknown error occurred. Please try again or use "Forgot Password".'
      }
      setMessage(msg)
    } finally {
      setIsLoading(false)
      setLoadingText('')
      setLoadingProgress(0)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetMessage('')
    if (!resetEmail) {
      setResetMessage('Please enter your email.')
      return
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail)
      if (error) throw error
      setResetMessage('If this email is registered, a password reset link has been sent.')
    } catch (error: any) {
      setResetMessage(error.message)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Enhanced Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="relative flex flex-col items-center space-y-8 rounded-3xl border border-white/30 bg-white/10 p-10 backdrop-blur-xl">
            {/* Multi-layer Loading Animation */}
            <div className="relative">
              {/* Outer rotating ring with gradient */}
              <div className="h-20 w-20 animate-spin rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 p-1">
                <div className="h-full w-full rounded-full bg-white/10 backdrop-blur-sm"></div>
              </div>
              
              {/* Middle pulsing ring */}
              <div className="absolute inset-2 animate-pulse rounded-full border-2 border-white/40"></div>
              
              {/* Inner spinning dots */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '1.5s' }}>
                <div className="absolute top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-400 shadow-lg"></div>
                <div className="absolute bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-purple-400 shadow-lg"></div>
                <div className="absolute left-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-blue-400 shadow-lg"></div>
                <div className="absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-pink-400 shadow-lg"></div>
              </div>
              
              {/* Center pulsing core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-xl"></div>
              </div>
            </div>
            
            {/* Enhanced Loading Text */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                {loadingText || (isSignUp ? 'Creating Account...' : 'Signing In...')}
              </h3>
              <p className="text-sm text-blue-200/80 mb-4">
                {loadingProgress < 50 
                  ? "Establishing secure connection..." 
                  : loadingProgress < 80 
                  ? "Processing your request..." 
                  : "Almost ready..."
                }
              </p>
              
              {/* Progress Bar */}
              <div className="w-64 bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              
              {/* Network Status Indicator */}
              <div className="flex items-center justify-center space-x-2 text-xs text-blue-200/60">
                <div className="flex space-x-1">
                  <div className="h-1 w-1 animate-ping rounded-full bg-green-400"></div>
                  <div className="h-1 w-1 animate-ping rounded-full bg-green-400" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-1 w-1 animate-ping rounded-full bg-green-400" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span>Secure connection active</span>
              </div>
              
              {/* Animated Progress Dots */}
              <div className="mt-6 flex justify-center space-x-2">
                <div className="h-3 w-3 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '0ms' }}></div>
                <div className="h-3 w-3 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '150ms' }}></div>
                <div className="h-3 w-3 animate-bounce rounded-full bg-purple-400" style={{ animationDelay: '300ms' }}></div>
                <div className="h-3 w-3 animate-bounce rounded-full bg-pink-400" style={{ animationDelay: '450ms' }}></div>
              </div>
            </div>
            
            {/* Helpful message for slow connections */}
            {loadingProgress > 30 && loadingProgress < 90 && (
              <div className="text-center text-xs text-blue-200/50 max-w-xs">
                <p>This may take a moment due to network conditions. Please don't refresh the page.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Background Effects - Same as landing page */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-purple-600/15"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
      <div className="absolute left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-blue-500/25 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 h-[600px] w-[600px] rounded-full bg-purple-500/15 blur-3xl"></div>
      <div className="absolute left-1/3 top-1/3 h-80 w-80 rounded-full bg-indigo-400/10 blur-2xl"></div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <div className="group relative mx-auto mb-4 h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl transition-all duration-700 group-hover:blur-2xl"></div>
                <Image
                  src="/images/logo.png"
                  alt="GoRoFolio"
                  fill
                  className="relative z-10 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            <h1 className="mb-2 text-3xl font-bold text-white">Welcome to GoRoFolio</h1>
            <p className="text-blue-200/80">
              {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
            </p>
          </div>

          {/* Auth Form */}
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
            {showReset ? (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <label htmlFor="reset-email" className="mb-2 block text-sm font-medium text-white">
                    Enter your email to reset password
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                {resetMessage && (
                  <div className={`rounded-xl p-4 text-sm ${resetMessage.includes('reset link') ? 'border border-green-500/30 bg-green-500/20 text-green-200' : 'border border-red-500/30 bg-red-500/20 text-red-200'}`}>{resetMessage}</div>
                )}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-6 py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Send Reset Link
                </button>
                <div className="mt-4 text-center">
                  <button type="button" onClick={() => { setShowReset(false); setResetMessage(''); }} className="text-blue-300 hover:text-blue-200">Back to Login</button>
                </div>
              </form>
            ) : (
              <>
                <form onSubmit={handleAuth} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 transition-all duration-300 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 transition-all duration-300 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      placeholder="Enter your password"
                    />
                  </div>
                  {message && (
                    <div className={`rounded-xl p-4 text-sm ${message.includes('Check your email') ? 'border border-green-500/30 bg-green-500/20 text-green-200' : 'border border-red-500/30 bg-red-500/20 text-red-200'}`}>{message}</div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-6 py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:scale-100"
                  >
                    {/* Button Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    
                    {/* Loading shimmer effect */}
                    {isLoading && (
                      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    )}
                    
                    {/* Button Content */}
                    <div className="relative flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                          <span className="animate-pulse">{loadingText || (isSignUp ? 'Creating Account...' : 'Signing In...')}</span>
                        </>
                      ) : (
                        <>
                          <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                          <svg 
                            className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </div>
                  </button>
                </form>
                {/* Forgot Password link (only on login) */}
                {!isSignUp && (
                  <div className="mt-4 text-center">
                    <button 
                      type="button" 
                      onClick={() => setShowReset(true)} 
                      disabled={isLoading}
                      className="text-blue-300 hover:text-blue-200 disabled:opacity-50"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
                {/* Toggle Sign Up/Sign In */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setMessage('')
                    }}
                    disabled={isLoading}
                    className="text-blue-300 hover:text-blue-200 disabled:opacity-50"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </button>
                </div>
                {/* Back to Home */}
                <div className="mt-4 text-center">
                  <Link href="/" className="text-sm text-white/60 hover:text-white">← Back to Home</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
