import React, { useState, useEffect } from "react";
import type { UrlResponse } from "../types/url";
import { parseBackendDate } from "../utils/date";

interface AnalyticsCardsProps {
  urls: UrlResponse[];
}

// Lightweight dynamic counter component for count-up visual micro-interactions
const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayValue(0);
      return;
    }

    const duration = 400; // 400ms duration
    const stepTime = 16;  // ~60 FPS
    const totalSteps = duration / stepTime;
    const increment = Math.max(Math.ceil(end / totalSteps), 1);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

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
      name: "Total URLs",
      value: totalUrls,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      ),
      bgGlow: "bg-indigo-500/5",
      borderColor: "border-indigo-500/10",
    },
    {
      name: "Active Links",
      value: activeUrls,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      bgGlow: "bg-emerald-500/5",
      borderColor: "border-emerald-500/10",
    },
    {
      name: "Expired Links",
      value: expiredUrls,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      bgGlow: "bg-red-500/5",
      borderColor: "border-red-500/10",
    },
    {
      name: "Total Click Traffic",
      value: totalClicks,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-cyan-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      ),
      bgGlow: "bg-cyan-500/5",
      borderColor: "border-cyan-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.name}
          className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-slate-900/20 p-6 shadow-sm flex items-center justify-between group hover:border-slate-800 transition-all`}
        >
          {/* Subtle interior glow */}
          <div className={`absolute -right-4 -bottom-4 -z-10 h-16 w-16 rounded-full ${card.bgGlow} blur-xl group-hover:scale-150 transition-all`} />

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
              {card.name}
            </span>
            <div className="text-xl font-extrabold text-white">
              <AnimatedCounter value={card.value} />
            </div>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-slate-900 shadow-inner group-hover:scale-105 transition-transform">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
