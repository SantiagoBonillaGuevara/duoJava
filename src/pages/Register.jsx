import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const DuoJavaLogo = () => (
  <svg className="size-full" fill="none" viewBox="0 0 48 48">
    <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor" />
  </svg>
)

const passwordStrength = (password) => {
  if (!password) return { label: '', color: '', width: '0%' }
  if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '25%' }
  if (password.length < 10) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' }
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Good', color: 'bg-blue-500', width: '75%' }
  return { label: 'Strong', color: 'bg-emerald-500', width: '100%' }
}

const strengthColors = {
  Weak: 'text-red-500',
  Fair: 'text-yellow-500',
  Good: 'text-blue-500',
  Strong: 'text-emerald-500',
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ displayName: '', username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = passwordStrength(form.password)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
        const { _, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                display_name: form.displayName,
                username: form.username,
                }
            }
        })
        if (error) throw error
        navigate('/login')
    } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.')
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">

      {/* Left Panel: Branding */}
      <div className="relative flex w-full lg:w-1/2 flex-col justify-center bg-[#0F172A] p-8 lg:p-24 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6324eb]/20 blur-[120px] rounded-full" />

        <div className="relative z-10 flex flex-col gap-8 max-w-md mx-auto lg:mx-0">
          {/* Logo */}
          <div className="flex items-center gap-3 text-white">
            <div className="size-10 text-[#6324eb]"><DuoJavaLogo /></div>
            <h2 className="text-2xl font-bold tracking-tight">duoJava</h2>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-white mb-4">
              Start your streak today 🔥
            </h1>
            <p className="text-slate-400 text-lg">
              Join the gamified Java learning platform built for modern developers.
            </p>
          </div>

          {/* Benefits */}
          <div className="flex flex-col gap-6">
            {[
              { icon: 'code', text: 'Interactive coding exercises' },
              { icon: 'emoji_events', text: 'Earn XP and unlock achievements' },
              { icon: 'show_chart', text: 'Track your progress visually' },
            ].map(({ icon, text }) => (
              <div key={icon} className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#6324eb]/10 text-[#6324eb]">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <p className="text-slate-200 font-medium">{text}</p>
              </div>
            ))}
          </div>

          {/* Code card */}
          <div className="p-6 rounded-xl bg-[#1E293B] border border-slate-700/50 shadow-2xl hover:rotate-1 transition-transform duration-300">
            <div className="flex gap-1.5 mb-4">
              <div className="size-3 rounded-full bg-red-500/50" />
              <div className="size-3 rounded-full bg-amber-500/50" />
              <div className="size-3 rounded-full bg-emerald-500/50" />
            </div>
            <pre className="font-mono text-sm">
              <span className="text-purple-400">public class</span>{' '}
              <span className="text-amber-300">DuoJava</span> {'{\n'}
              {'  '}<span className="text-purple-400">public static void</span>{' '}
              <span className="text-blue-400">main</span>(String[] args) {'{\n'}
              {'    '}System.out.println(<span className="text-emerald-400">"Hello Coder!"</span>);{'\n'}
              {'    '}<span className="text-slate-500">{'// Your journey begins...'}</span>{'\n'}
              {'  }'}{'\n'}
              {'}'}
            </pre>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 lg:p-12">
        <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-2xl p-8 lg:p-10 shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Create your account</h2>
            <p className="text-slate-500 dark:text-slate-400">Free forever. No credit card needed.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Display Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Display name</label>
              <input
                name="displayName"
                type="text"
                placeholder="Enter your full name"
                value={form.displayName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6324eb] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500 select-none">@</span>
                <input
                  name="username"
                  type="text"
                  placeholder="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-10 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6324eb] focus:border-transparent outline-none transition-all"
                />
                {form.username.length > 2 && (
                  <span className="material-symbols-outlined absolute right-3 text-emerald-500 text-xl">check_circle</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6324eb] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6324eb] focus:border-transparent outline-none transition-all"
              />
              {form.password && (
                <div className="flex flex-col gap-1">
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold text-right ${strengthColors[strength.label]}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6324eb] hover:bg-[#6324eb]/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg shadow-lg shadow-[#6324eb]/20 transition-all active:scale-[0.98]"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-widest font-medium">or</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-all"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#6324eb] font-semibold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)