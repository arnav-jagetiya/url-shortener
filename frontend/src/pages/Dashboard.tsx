import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
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
              <span className="text-xl font-extrabold tracking-tight text-white select-none">
                Shortify
              </span>
            </div>

            {/* Logout actions */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
                Logged in as: <span className="text-indigo-400 font-medium">{user?.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-350 hover:text-white hover:border-slate-700 transition-all"
              >
                Log Out
              </button>
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
              className="cursor-pointer shrink-0 rounded-lg bg-red-650 hover:bg-red-650 px-4 py-2 text-xs font-semibold text-white"
            >
              Retry Connection
            </button>
          </div>
        )}

        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
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
                <div className="rounded-3xl border border-slate-900 bg-slate-900/10 px-8 py-16 text-center shadow-xl">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-white">No links shortened yet</h3>
                  <p className="mx-auto mt-2 max-w-sm text-xs text-slate-500 leading-relaxed">
                    Paste your first long URL in the creator box above to generate sub-millisecond short links.
                  </p>
                </div>
              ) : (
                <UrlTable urls={urls} onDeleteRequest={handleDeleteRequest} />
              )}
            </div>
          </>
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
