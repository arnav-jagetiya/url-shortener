import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const LinkNotFound: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[130px]" />

      <div className="w-full max-w-md text-center space-y-8 rounded-2xl border border-slate-900 bg-slate-900/30 p-8 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-500">
        {/* Shortify Logo */}
        <div className="flex justify-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white select-none">Shortify</span>
          </Link>
        </div>

        {/* Warning Icon (Exclamation Triangle) */}
        <div className="flex justify-center my-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
        </div>

        {/* Page Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Link Not Found</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The short link{" "}
            {code ? (
              <span className="font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 break-all select-all inline-block mx-1">
                {code}
              </span>
            ) : (
              "you requested"
            )}{" "}
            doesn't exist or may have been removed.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Link
            to="/"
            className="block w-full text-center rounded-xl bg-indigo-650 hover:bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.99]"
          >
            Create a New Short Link
          </Link>
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="block w-full text-center rounded-xl border border-slate-800 hover:border-slate-705 bg-slate-950/40 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-white transition-all"
          >
            {isAuthenticated ? "Back to Dashboard" : "Log In to Dashboard"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LinkNotFound;
