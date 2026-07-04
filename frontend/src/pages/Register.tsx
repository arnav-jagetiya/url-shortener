import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus name field on mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Live email format validation
  const isEmailValid = (() => {
    if (!email) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  })();

  // Live password checklist checks
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };

  // Live password strength assessor
  const strength = (() => {
    if (!password) return { label: "", score: 0, color: "bg-slate-800", text: "text-slate-400" };
    let score = 0;
    if (checks.length) score++;
    if (checks.uppercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    if (score <= 1 || password.length < 6) {
      return { label: "Weak", score: 1, color: "bg-red-500", text: "text-red-400" };
    }
    if (score <= 3) {
      return { label: "Medium", score: 2, color: "bg-amber-500", text: "text-amber-400" };
    }
    return { label: "Strong", score: 3, color: "bg-emerald-500", text: "text-emerald-400" };
  })();

  // Confirm password match check
  const passwordsMatch = confirmPassword ? password === confirmPassword : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register(name, email, password);
      setIsSuccess(true);
      // Brief success transition delay (approx 900ms) for high-end feel
      setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (err) {
      setIsSuccess(false);
      setSubmitting(false);
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data) {
          if (typeof data === "object" && !data.message) {
            setFieldErrors(data as Record<string, string>);
          } else if (data.message) {
            setError(data.message);
          } else {
            setError("Registration failed. Please check the form data.");
          }
        } else {
          setError("Failed to connect to the authentication service.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[130px]" />
      
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-900 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl relative min-h-[500px] flex flex-col justify-center transition-all duration-300">
        {isSuccess ? (
          /* Premium Success Buffer Screen */
          <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Account Created Successfully</h3>
            <p className="text-xs text-slate-400">Setting up your Shortify dashboard...</p>
          </div>
        ) : (
          <>
            {/* Brand/Logo */}
            <div className="text-center">
              <Link to="/" className="inline-flex items-center gap-2 group focus:outline-none">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-md shadow-indigo-500/20 group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                    />
                  </svg>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white select-none">
                  Shortify
                </span>
              </Link>
              <h2 className="mt-6 text-2xl font-extrabold text-white">Create a new account</h2>
              <p className="mt-2 text-sm text-slate-400">
                Or{" "}
                <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-350 transition-colors focus:outline-none focus:underline">
                  sign in to your existing account
                </Link>
              </p>
            </div>

            {/* Global Error Banner */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400 animate-fadeIn" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Name field */}
                <div>
                  <label htmlFor="user-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    id="user-name"
                    name="name"
                    type="text"
                    required
                    ref={nameInputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="relative block w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-white placeholder-slate-550 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  {fieldErrors.name && (
                    <span className="text-[11px] text-red-400 mt-1.5 block">{fieldErrors.name}</span>
                  )}
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="email-address" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`relative block w-full rounded-xl border bg-slate-950/80 pl-4 pr-10 py-3 text-xs text-white placeholder-slate-550 focus:z-10 focus:outline-none focus:ring-1 transition-all ${
                        isEmailValid
                          ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-550"
                          : email
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                            : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    {isEmailValid && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-400 animate-in fade-in zoom-in duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </span>
                    )}
                  </div>
                  {fieldErrors.email && (
                    <span className="text-[11px] text-red-400 mt-1.5 block">{fieldErrors.email}</span>
                  )}
                </div>

                {/* Password field */}
                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="relative block w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-4 pr-10 py-3 text-xs text-white placeholder-slate-550 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white cursor-pointer focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3.15 3.15m-3.15-3.15-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <span className="text-[11px] text-red-400 mt-1.5 block">{fieldErrors.password}</span>
                  )}

                  {/* Password Strength Meter & Live Requirements Checklist */}
                  {password && (
                    <div className="mt-3.5 space-y-3.5 animate-in slide-in-from-top-1.5 duration-200">
                      {/* Color-coded Strength Bar */}
                      <div>
                        <div className="flex justify-between items-center text-[10px] mb-1">
                          <span className="text-slate-500 uppercase font-semibold tracking-wider">Complexity Strength</span>
                          <span className={`${strength.text} font-bold`}>{strength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex gap-0.5">
                          <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 1 ? strength.color : "bg-slate-900"}`} />
                          <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 2 ? strength.color : "bg-slate-900"}`} />
                          <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 3 ? strength.color : "bg-slate-900"}`} />
                        </div>
                      </div>

                      {/* Criteria Checks list */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 border-t border-slate-900/60 pt-3">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className={`transition-colors ${checks.length ? "text-emerald-400" : "text-slate-500"}`}>
                            {checks.length ? "✓" : "○"}
                          </span>
                          <span className={checks.length ? "text-slate-300" : "text-slate-500"}>At least 8 chars</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className={`transition-colors ${checks.uppercase ? "text-emerald-400" : "text-slate-500"}`}>
                            {checks.uppercase ? "✓" : "○"}
                          </span>
                          <span className={checks.uppercase ? "text-slate-300" : "text-slate-500"}>1 Uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className={`transition-colors ${checks.number ? "text-emerald-400" : "text-slate-500"}`}>
                            {checks.number ? "✓" : "○"}
                          </span>
                          <span className={checks.number ? "text-slate-300" : "text-slate-500"}>1 Number</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className={`transition-colors ${checks.special ? "text-emerald-400" : "text-slate-500"}`}>
                            {checks.special ? "✓" : "○"}
                          </span>
                          <span className={checks.special ? "text-slate-300" : "text-slate-500"}>1 Special character</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password field */}
                <div>
                  <label htmlFor="confirm-password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`relative block w-full rounded-xl border bg-slate-950/80 px-4 py-3 text-xs text-white placeholder-slate-550 focus:z-10 focus:outline-none focus:ring-1 transition-all ${
                        passwordsMatch === true
                          ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-550"
                          : passwordsMatch === false
                            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                            : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white cursor-pointer focus:outline-none"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3.15 3.15m-3.15-3.15-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPassword && (
                    <span className={`text-[11px] mt-1.5 block ${passwordsMatch ? "text-emerald-400" : "text-red-400"}`}>
                      {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer group relative flex w-full justify-center rounded-xl bg-indigo-650 px-4 py-3.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-600 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
