import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function SetupUsername() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Verificar disponibilidad con debounce
  useEffect(() => {
    if (username.length < 3) { setAvailable(null); return }
    const timer = setTimeout(async () => {
      setChecking(true)
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle()
      setAvailable(!data)
      setChecking(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [username])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!available) return
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id)
      if (error) throw error
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#161121] p-6">
      <div className="w-full max-w-md bg-[#1E293B] rounded-2xl p-8 border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-2">Choose your username</h2>
        <p className="text-slate-400 mb-8">This is how other learners will find you.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-900/20 border border-red-800 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Username</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-500 select-none">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value.toLowerCase()); setAvailable(null) }}
                placeholder="username"
                required
                minLength={3}
                className="w-full pl-9 pr-10 py-3 rounded-lg border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-[#6324eb] focus:border-transparent outline-none transition-all"
              />
              {/* Indicador de disponibilidad */}
              <span className="absolute right-3 material-symbols-outlined text-xl">
                {checking ? (
                  <span className="text-slate-400 text-sm animate-pulse">...</span>
                ) : available === true ? (
                  <span className="text-emerald-500">check_circle</span>
                ) : available === false ? (
                  <span className="text-red-500">cancel</span>
                ) : null}
              </span>
            </div>
            {available === false && (
              <p className="text-xs text-red-400">Username already taken</p>
            )}
            {available === true && (
              <p className="text-xs text-emerald-400">Username available!</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!available || loading}
            className="w-full bg-[#6324eb] hover:bg-[#6324eb]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-all"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}