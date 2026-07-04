import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-md shadow-indigo-500/20">
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
              <span className="text-xl font-extrabold tracking-tight text-white">
                Shortify
              </span>
            </div>

            {/* Logout Button */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
                Logged in as: <span className="text-indigo-400">{user?.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Panel */}
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-slate-900/20 p-8 sm:p-12 shadow-2xl">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 -z-10 h-[250px] w-[350px] rounded-full bg-indigo-500/5 blur-[95px]" />
          <div className="absolute bottom-0 left-0 -z-10 h-[250px] w-[350px] rounded-full bg-violet-500/5 blur-[95px]" />

          {/* Heading */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Connected to Session
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-4">
              Welcome back, {user?.name || "User"}!
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              This is your project workspace placeholder. Authentication has been fully verified with the Shortify REST security layer.
            </p>
          </div>

          {/* Profile Card */}
          <div className="mt-10 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 space-y-4 max-w-md shadow-md">
            <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2">
              Authentication Context Profile
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <span className="text-slate-500 font-semibold uppercase">Name</span>
              <span className="col-span-2 text-white font-medium">{user?.name}</span>

              <span className="text-slate-500 font-semibold uppercase">Email</span>
              <span className="col-span-2 text-white font-medium break-all">{user?.email}</span>

              <span className="text-slate-500 font-semibold uppercase">Role</span>
              <span className="col-span-2 text-indigo-400 font-medium">Standard User</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
