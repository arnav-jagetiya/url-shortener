import React, { useState, useMemo } from "react";
import type { UrlResponse } from "../types/url";
import { useToast } from "../contexts/ToastContext";
import { parseBackendDate, formatDisplayDate } from "../utils/date";

interface UrlTableProps {
  urls: UrlResponse[];
  onDeleteRequest: (url: UrlResponse) => void;
}

export const UrlTable: React.FC<UrlTableProps> = ({ urls, onDeleteRequest }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { showToast } = useToast();

  const filteredUrls = useMemo(() => {
    if (!searchTerm.trim()) return urls;
    const term = searchTerm.toLowerCase();
    return urls.filter(
      (url) =>
        url.shortCode.toLowerCase().includes(term) ||
        url.shortUrl.toLowerCase().includes(term) ||
        url.originalUrl.toLowerCase().includes(term)
    );
  }, [urls, searchTerm]);

  const handleCopy = (shortUrl: string, id: number) => {
    navigator.clipboard.writeText(shortUrl);
    showToast("Link copied to clipboard!", "success");
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getStatusBadge = (expiresAt: string | null) => {
    if (!expiresAt) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Active
        </span>
      );
    }

    const expires = parseBackendDate(expiresAt);
    if (!expires) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Active
        </span>
      );
    }

    const isExpired = expires <= new Date();
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-400 border border-red-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          Expired
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Active
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Input Box */}
      <div className="relative w-full max-w-sm">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Filter URLs by original link or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-550 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
        />
      </div>

      {/* URLs Container */}
      {filteredUrls.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-12 text-center text-slate-400">
          <p className="text-sm">No matching URLs found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-900 bg-slate-950/45">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-900/20 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="p-4">Short URL</th>
                  <th className="p-4">Original URL</th>
                  <th className="p-4">Clicks</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4">Expires At</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {filteredUrls.map((url) => (
                  <tr key={url.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="p-4 font-bold text-cyan-400 break-all select-all">
                      {url.shortUrl}
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-300" title={url.originalUrl}>
                      {url.originalUrl}
                    </td>
                    <td className="p-4 font-bold text-slate-200">
                      {url.clickCount}
                    </td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {formatDisplayDate(url.createdAt)}
                    </td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {formatDisplayDate(url.expiresAt)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(url.expiresAt)}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        {/* Copy Link Button */}
                        <button
                          onClick={() => handleCopy(url.shortUrl, url.id)}
                          className={`cursor-pointer rounded-lg bg-slate-900 border p-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                            copiedId === url.id
                              ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5"
                              : "border-slate-800 text-slate-450 hover:text-white hover:border-slate-700"
                          }`}
                          title="Copy Link"
                          aria-label="Copy short link"
                        >
                          {copiedId === url.id ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-emerald-400 animate-in zoom-in duration-200">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                            </svg>
                          )}
                        </button>
                        {/* Open Link Button */}
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="cursor-pointer rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-450 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          title="Open Link"
                          aria-label="Open short link in new tab"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                        {/* Delete Link Button */}
                        <button
                          onClick={() => onDeleteRequest(url)}
                          className="cursor-pointer rounded-lg bg-slate-900 border border-slate-800 p-2 text-red-400 hover:bg-red-550/10 hover:border-red-500/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                          title="Delete Link"
                          aria-label="Delete short link"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Deck View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredUrls.map((url) => (
              <div key={url.id} className="rounded-2xl border border-slate-900 bg-slate-950/65 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Short URL
                  </span>
                  {getStatusBadge(url.expiresAt)}
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Shortened Address
                    </span>
                    <span className="text-cyan-400 font-bold break-all select-all block">
                      {url.shortUrl}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Original URL
                    </span>
                    {/* Truncated original URL on mobile with hover tooltip */}
                    <span className="text-slate-300 truncate block leading-relaxed max-w-xs" title={url.originalUrl}>
                      {url.originalUrl}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-t border-slate-900/60 pt-3">
                    <div>
                      <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                        Clicks
                      </span>
                      <span className="text-white font-bold">{url.clickCount}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                        Created
                      </span>
                      <span className="text-slate-400 text-[10px] whitespace-nowrap">{formatDisplayDate(url.createdAt)}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                        Expires
                      </span>
                      <span className="text-slate-400 text-[10px] whitespace-nowrap">
                        {formatDisplayDate(url.expiresAt)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2 border-t border-slate-900/60 pt-3">
                  {/* Mobile Copy Button */}
                  <button
                    onClick={() => handleCopy(url.shortUrl, url.id)}
                    className={`cursor-pointer flex-grow flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      copiedId === url.id
                        ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5"
                        : "border-slate-800 bg-slate-900/50 text-slate-300 hover:text-white"
                    }`}
                  >
                    {copiedId === url.id ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-emerald-400 animate-in zoom-in duration-200">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer flex-grow flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/50 py-2.5 text-xs text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    Open
                  </a>
                  <button
                    onClick={() => onDeleteRequest(url)}
                    className="cursor-pointer flex-grow flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-slate-900/50 py-2.5 text-xs text-red-400 hover:bg-red-550/10 hover:border-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UrlTable;
