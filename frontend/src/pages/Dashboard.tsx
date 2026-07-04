import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { urlService } from "../services/urls";
import type { UrlResponse } from "../types/url";
import { useToast } from "../contexts/ToastContext";
import { AnalyticsCards } from "../components/AnalyticsCards";
import { CreateUrlForm } from "../components/CreateUrlForm";
import { UrlTable } from "../components/UrlTable";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { ConfirmationModal } from "../components/ConfirmationModal";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [urls, setUrls] = useState<UrlResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Modal & Deletion states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<UrlResponse | null>(null);

  // Declare fetchUrls with useCallback before useEffect
  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await urlService.getUserUrls();
      setUrls(data);
    } catch {
      setError("Failed to load your shortened URLs. Please reload.");
      showToast("Error loading URL list.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUrls();
  }, [fetchUrls]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Optimistic UI updates - creation
  const handleUrlCreated = (newUrl: UrlResponse) => {
    setUrls((prev) => [newUrl, ...prev]);
  };

  const handleDeleteRequest = (url: UrlResponse) => {
    setUrlToDelete(url);
    setDeleteModalOpen(true);
  };

  // Optimistic UI updates - deletion
  const handleDeleteConfirm = async () => {
    if (!urlToDelete) return;

    const originalUrls = [...urls];
    const targetId = urlToDelete.id;
    const targetShortCode = urlToDelete.shortCode;

    // Optimistically remove from state immediately
    setUrls((prev) => prev.filter((item) => item.id !== targetId));
    setDeleteModalOpen(false);
    setUrlToDelete(null);
    showToast("Deleting URL...", "info");

    try {
      await urlService.deleteUrl(targetId);
      showToast("URL successfully deleted.", "success");
    } catch {
      // Revert state if backend request fails
      setUrls(originalUrls);
      showToast(`Failed to delete link shortify.local/${targetShortCode}. Restored.`, "error");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUrlToDelete(null);
  };

  // Focus creator input on empty dashboard CTA trigger
  const focusCreatorInput = () => {
    document.getElementById("long-url")?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-955 text-white selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 focus:outline-none">
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
                <span className="text-xl font-extrabold tracking-tight text-white select-none">
                  Shortify
                </span>
              </Link>
            </div>

            {/* User Profile Dropdown Navigation Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1.5 hover:bg-slate-900/60 transition-colors cursor-pointer"
                aria-label="User dropdown menu"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {/* Avatar Initial Letters */}
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 select-none uppercase text-xs">
                  {user?.email ? user.email.slice(0, 2) : "US"}
                </div>
                <span className="hidden md:inline-block text-xs font-semibold text-slate-300">
                  {user?.email ? user.email.split("@")[0] : "User"}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop click away */}
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  
                  {/* Dropdown Options */}
                  <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-slate-900 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-slate-900/60 mb-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-white truncate" title={user?.email || ""}>{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-900/60 transition-colors focus:outline-none focus:bg-slate-900/60 focus-visible:ring-1 focus-visible:ring-indigo-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="cursor-pointer w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/5 transition-colors focus:outline-none focus:bg-red-500/5 text-left focus-visible:ring-1 focus-visible:ring-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                      </svg>
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        
        {/* Error State Banner */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <h4 className="text-sm font-bold text-red-400">Syncing Error</h4>
              <p className="text-xs text-red-300/80">{error}</p>
            </div>
            <button
              onClick={fetchUrls}
              className="cursor-pointer shrink-0 rounded-lg bg-red-650 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Retry Connection
            </button>
          </div>
        )}

        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Top Metrics Summary */}
            <AnalyticsCards urls={urls} />

            {/* Short URL Creator Form */}
            <CreateUrlForm onUrlCreated={handleUrlCreated} />

            {/* Table listing / Empty State */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-900 pb-2">
                Your Shortened Links
              </h3>
              
              {urls.length === 0 ? (
                /* Improved empty state card with CTA button */
                <div className="rounded-3xl border border-slate-900 bg-slate-950/20 px-8 py-16 text-center shadow-xl max-w-lg mx-auto border-dashed animate-in fade-in duration-300">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 mb-6 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Build your first short link</h3>
                  <p className="mx-auto max-w-sm text-xs text-slate-500 leading-relaxed mb-6">
                    Shortify links are sub-millisecond redirectors optimized for analytics tracking and custom alias branding. Paste a destination address to get started.
                  </p>
                  <button
                    onClick={focusCreatorInput}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-650 hover:bg-indigo-600 px-5 py-3 text-xs font-semibold text-white shadow-md active:scale-[0.99] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Shorten Your First Link
                  </button>
                </div>
              ) : (
                <UrlTable urls={urls} onDeleteRequest={handleDeleteRequest} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Shortened Link"
        message={`Are you sure you want to permanently delete shortify.local/${urlToDelete?.shortCode}? This will evict cache records and render the redirect inactive.`}
        confirmText="Delete Link"
        cancelText="Keep Link"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Dashboard;
