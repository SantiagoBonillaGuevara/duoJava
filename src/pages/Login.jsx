import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'

const DuoJavaLogo = () => (
  <svg className="size-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor" />
  </svg>
)

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
            })
            if (error) throw error
            setAuth(data.user, data.session)
            navigate('/')
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.')
        } finally {
            setLoading(false)
        }
   }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row overflow-hidden bg-[#f6f6f8] dark:bg-[#161121]">

      {/* Left Side: Branding */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#0F172A] overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="size-8 text-[#6324eb]">
            <DuoJavaLogo />
          </div>
          <h2 className="text-2xl font-black tracking-tight">duoJava</h2>
        </div>

        {/* Hero */}
        <div className="relative z-10 flex flex-col gap-6 max-w-lg">
          <h1 className="text-white text-5xl font-black leading-tight tracking-tight">
            Learn Java.<br />Level up.<br />Every day.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Master Java programming through interactive lessons, real-time code execution, and daily challenges designed to make you a pro.
          </p>

          {/* Code card */}
          <div className="mt-8 rounded-xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 p-6 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="flex gap-1.5 mb-4">
              <div className="size-3 rounded-full bg-red-500" />
              <div className="size-3 rounded-full bg-yellow-500" />
              <div className="size-3 rounded-full bg-green-500" />
            </div>
            <code className="text-sm font-mono block text-slate-300">
              <span className="text-[#6324eb]">public class</span>{' '}
              <span className="text-yellow-400">Main</span> {'{'}<br />
              &nbsp;&nbsp;<span className="text-[#6324eb]">public static void</span>{' '}
              <span className="text-blue-400">main</span>(String[] args) {'{'}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;System.out.println(<span className="text-green-400">"Keep coding!"</span>);<br />
              &nbsp;&nbsp;{'}'}<br />
              {'}'}
            </code>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] flex flex-col gap-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="size-8 text-[#6324eb]"><DuoJavaLogo /></div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">duoJava</span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Welcome back</h2>
            <p className="text-slate-600 dark:text-slate-400">Sign in to continue your learning journey.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-[#6324eb] focus:ring-1 focus:ring-[#6324eb] outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button type="button" className="text-xs font-bold text-[#6324eb] hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-4 py-3 pr-11 text-slate-900 dark:text-slate-100 focus:border-[#6324eb] focus:ring-1 focus:ring-[#6324eb] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6324eb] hover:bg-[#6324eb]/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-[#6324eb]/20"
            >
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px grow bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">or</span>
            <div className="h-px grow bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Google */}
          <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#6324eb] hover:underline">
              Sign up
            </Link>
          </p>
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