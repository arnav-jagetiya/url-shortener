import React from "react";
import { Link } from "react-router-dom";

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 px-8 py-16 text-center sm:px-16 shadow-2xl">
          {/* Glowing element */}
          <div className="absolute top-1/2 left-1/2 -z-10 h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[90px]" />

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to optimize your link infrastructure?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-slate-400 leading-relaxed">
            Create an account to start creating custom links, analyzing redirection performance, and integrating via our secure developer API.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="cursor-pointer rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-500 hover:shadow-indigo-600/30 transition-all w-full sm:w-auto"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login"
              className="cursor-pointer rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-950/40 px-6 py-3.5 text-sm font-semibold text-slate-350 hover:text-white transition-all w-full sm:w-auto"
            >
              Log In to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
