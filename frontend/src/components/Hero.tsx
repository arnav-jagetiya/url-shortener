import React, { useState } from "react";

export const Hero: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    // Simulate URL shortening locally
    const code = customAlias.trim()
      ? customAlias.trim().replace(/[^a-zA-Z0-9_-]/g, "")
      : Math.random().toString(36).substring(2, 9);
    
    setShortenedUrl(`http://shortify.local/${code}`);
    setCopied(false);
  };

  const handleCopy = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 bg-slate-950">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[150px]" />
      <div className="absolute top-20 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[130px]" />
      <div className="absolute top-40 right-1/4 -z-10 h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Tech Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-4 py-1.5 text-xs font-semibold text-indigo-300">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Supercharged by Redis Caching & JPA</span>
        </div>

        {/* Headline */}
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
          The ultimate link shortener
          <span className="block mt-3 bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            built for extreme throughput.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-3xl text-lg md:text-xl text-slate-400 leading-relaxed">
          Shorten long links with customized aliases, achieve sub-millisecond redirect lookups, and track clicks in real-time. Fast, secure, and developer-friendly.
        </p>

        {/* URL Shortener Form */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl shadow-indigo-950/10 hover:border-slate-700/50 transition-all duration-300">
          <form onSubmit={handleShorten} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <input
                  type="url"
                  placeholder="Paste your long link here..."
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-750 bg-slate-950/80 py-3.5 pl-4 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all sm:w-auto w-full shrink-0"
              >
                Shorten URL
              </button>
            </div>

            {/* Custom Alias Input */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left bg-slate-950/40 px-4 py-2.5 rounded-xl border border-slate-800/80">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Custom Alias (Optional):</span>
              <div className="flex items-center gap-1 text-xs text-slate-400 flex-grow">
                <span>shortify.local/</span>
                <input
                  type="text"
                  placeholder="e.g. summer-sale"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="flex-grow bg-transparent text-xs text-white focus:outline-none placeholder-slate-650"
                />
              </div>
            </div>
          </form>

          {/* Result Container */}
          {shortenedUrl && (
            <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 flex items-center justify-between gap-4 animate-fadeIn">
              <div className="text-left overflow-hidden">
                <span className="block text-xs font-semibold text-indigo-400">Shortened URL</span>
                <a
                  href={shortenedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-cyan-400 hover:underline break-all"
                >
                  {shortenedUrl}
                </a>
              </div>
              <button
                onClick={handleCopy}
                className="cursor-pointer flex items-center gap-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/30 transition-all shrink-0"
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-4 w-4 text-cyan-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Dashboard Preview / Stats Grid */}
        <div className="mx-auto mt-20 max-w-4xl border-t border-slate-900 pt-12">
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-1">
              <span className="block text-3xl md:text-4xl font-extrabold text-white">45M+</span>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">Links Created</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl md:text-4xl font-extrabold text-white">2.5B+</span>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">Clicks Routed</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl md:text-4xl font-extrabold text-white">99.99%</span>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-widest">Uptime SLA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
