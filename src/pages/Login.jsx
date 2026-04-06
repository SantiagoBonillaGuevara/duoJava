import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import api from "@/api/axios";
import Logo from "@/components/ui/Logo";
import GoogleIcon from "@/components/ui/GoogleIcon";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Auth directo a Supabase — esto sí es válido
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;

      // 2. Perfil lo pide a Spring Boot con el JWT de Supabase
      // axios ya manda el token automáticamente en el header
      const { data: profile } = await api.get("/users/me");

      // 3. Guarda sesión de Supabase + perfil de Spring Boot
      setAuth({ ...data.user, ...profile }, data.session);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row overflow-hidden bg-[#f6f6f8] dark:bg-[#161121]">
      {/* Left Side: Branding */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#0F172A] overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="size-8 text-[#6324eb]">
            <Logo />
          </div>
          <h2 className="text-2xl font-black tracking-tight">duoJava</h2>
        </div>

        {/* Hero */}
        <div className="relative z-10 flex flex-col gap-6 max-w-lg">
          <h1 className="text-white text-5xl font-black leading-tight tracking-tight">
            Learn Java.
            <br />
            Level up.
            <br />
            Every day.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Master Java programming through interactive lessons, real-time code
            execution, and daily challenges designed to make you a pro.
          </p>

          {/* Code card */}
          <div className="mt-8 rounded-xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 p-6 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="flex gap-1.5 mb-4">
              <div className="size-3 rounded-full bg-red-500" />
              <div className="size-3 rounded-full bg-yellow-500" />
              <div className="size-3 rounded-full bg-green-500" />
            </div>
            <code className="text-sm font-mono block text-slate-300">
              <span className="text-[#6324eb]">public class</span>{" "}
              <span className="text-yellow-400">Main</span> {"{"}
              <br />
              &nbsp;&nbsp;
              <span className="text-[#6324eb]">public static void</span>{" "}
              <span className="text-blue-400">main</span>(String[] args) {"{"}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;System.out.println(
              <span className="text-green-400">"Keep coding!"</span>);
              <br />
              &nbsp;&nbsp;{"}"}
              <br />
              {"}"}
            </code>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] flex flex-col gap-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="size-8 text-[#6324eb]">
              <Logo />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              duoJava
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Welcome back
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to continue your learning journey.
            </p>
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
                <button
                  type="button"
                  className="text-xs font-bold text-[#6324eb] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
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
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6324eb] hover:bg-[#6324eb]/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-[#6324eb]/20"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px grow bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              or
            </span>
            <div className="h-px grow bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Google */}
          <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-[#6324eb] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
