
"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  ArrowRight,
} from "lucide-react";

type AuthMode = "login" | "signin";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (mode === "signin") {
      if (password !== confirmPassword) {
        setError("Konfirmasi password tidak cocok.");
        return;
      }

      setError(
        "Registrasi belum terhubung ke backend NEXUS."
      );
      return;
    }

    setError("Login belum terhubung ke backend NEXUS.");
  }

  return (
    
        <main className="nexus-login-background relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-6 font-sans text-slate-800">
          <section className="relative z-10 w-full max-w-[360px] rounded-xl border border-white/70 bg-white/80 px-5 py-6 shadow-xl shadow-sky-900/10 backdrop-blur- sm:px-7">
        {/* Logo NEXUS */}
        <div className="mb-8 flex justify-center">
          <img
            src="/nexus.png"
            alt="NEXUS PLN Icon Plus"
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Heading */}
        <div className="mb-7 text-center">
         
          <h1 className="text-1.xl font-bold tracking-tight text-slate-900">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="mt-0 text-xs text-slate-500">
            {mode === "login"
              ? "Sign in to your NEXUS account"
              : "Create your employee account"}
          </p>
        </div>

        {/* Tab Login / Sign In */}
        <div className="mb-6 grid grid-cols-2 rounded-full bg-[#DEDEDE] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              mode === "login"
                 ? "bg-white text-slate-900 shadow-sm"
                 : "text-slate-700 hover:bg-white/40"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError("");
            }}
            className={`flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              mode === "signin"
                 ? "bg-white text-slate-900 shadow-sm"
                 : "text-slate-700 hover:bg-white/40"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama hanya muncul saat Sign In */}
          {mode === "signin" && (
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0095DA] focus:ring-4 focus:ring-[#0095DA]/10"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0095DA] focus:ring-4 focus:ring-[#0095DA]/10"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-white pl-12 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0095DA] focus:ring-4 focus:ring-[#0095DA]/10"
              />

              <button
                type="button"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Konfirmasi password hanya saat Sign In */}
          {mode === "signin" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  minLength={8}
                  required
                  className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0095DA] focus:ring-4 focus:ring-[#0095DA]/10"
                />
              </div>
            </div>
          )}

          {/* Forgot Password */}
          {mode === "login" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setError("Fitur Forgot Password belum tersedia.")
                }
                className="text-xs font-semibold text-slate-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Pesan validasi */}
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          {/* Tombol utama */}
          <button
            type="submit"
            className="flex min-h-8 w-full items-center justify-center gap-2 rounded-md bg-[#0095DA] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#007AB8] active:scale-[0.99]"
          >
            {mode === "login" ? "Login" : "Create Account"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-[11px] leading-5 text-black-1000">
          NEXUS · Employees Operations Portal
          <br />
          PLN Icon Plus
        </p>
      </section>
    </main>
  );
}
