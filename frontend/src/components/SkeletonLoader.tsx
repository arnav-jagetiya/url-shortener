import React from "react";

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Analytics Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-900 bg-slate-900/30 p-6 h-28 flex flex-col justify-between" />
        ))}
      </div>

      {/* Form Skeleton */}
      <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-6 h-40" />

      {/* Search & Table Header Skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-full sm:w-72 rounded-xl bg-slate-900/40 border border-slate-900" />
        {/* Table rows skeleton */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/20 overflow-hidden">
          <div className="bg-slate-900/40 h-12 border-b border-slate-900" />
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-16 border-b border-slate-900/50 flex items-center px-6 gap-6">
              <div className="h-4 w-1/4 bg-slate-900/60 rounded" />
              <div className="h-4 w-1/3 bg-slate-900/60 rounded" />
              <div className="h-4 w-12 bg-slate-900/60 rounded" />
              <div className="h-4 w-24 bg-slate-900/60 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
