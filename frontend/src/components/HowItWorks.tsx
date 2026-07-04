import React from "react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Paste your long URL",
      description: "Paste your destination link. Shortify checks formatting, parameters, and verifies safety protocols.",
    },
    {
      num: "02",
      title: "Add a custom slug",
      description: "Specify a custom path alias or let Shortify auto-generate a unique base-62 encoded identifier.",
    },
    {
      num: "03",
      title: "Route & analyze clicks",
      description: "Distribute your new link. Access analytics logs directly from the user dashboard in real-time.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-950/40 border-t border-slate-900/60 relative scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Simplicity at scale.
            <span className="block mt-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Three easy steps.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            From creation to click redirection, we automate the path between your content and your audience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-transparent -translate-y-1/2 -z-10" />

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left group relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-2xl font-black text-indigo-400 shadow-xl group-hover:border-indigo-500 group-hover:text-white transition-all duration-300">
                {step.num}
              </div>
              <h3 className="mt-6 text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
