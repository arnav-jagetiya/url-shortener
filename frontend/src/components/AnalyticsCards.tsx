import React from "react";
import type { UrlResponse } from "../types/url";
import { parseBackendDate } from "../utils/date";

interface AnalyticsCardsProps {
  urls: UrlResponse[];
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ urls }) => {
  const totalUrls = urls.length;
  
  const activeUrls = urls.filter((url) => {
    const expires = parseBackendDate(url.expiresAt);
    if (!expires) return true;
    return expires > new Date();
  }).length;

  const expiredUrls = urls.filter((url) => {
    const expires = parseBackendDate(url.expiresAt);
    if (!expires) return false;
    return expires <= new Date();
  }).length;

  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);

  const cards = [
    {
      title: "Total URLs",
      value: totalUrls,
      color: "from-blue-500/10 to-indigo-500/10 border-indigo-500/20 text-indigo-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      ),
    },
    {
      title: "Active Links",
      value: activeUrls,
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      title: "Total Clicks",
      value: totalClicks,
      color: "from-cyan-500/10 to-blue-550/10 border-cyan-500/20 text-cyan-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
    },
    {
      title: "Expired Links",
      value: expiredUrls,
      color: "from-red-500/10 to-rose-500/10 border-red-500/20 text-red-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`relative overflow-hidden rounded-2xl border bg-gradient-to-tr p-6 shadow-md ${card.color}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {card.title}
            </span>
            <div className="shrink-0">{card.icon}</div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-white tracking-tight">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};
