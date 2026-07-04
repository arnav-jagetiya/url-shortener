import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="group relative rounded-2xl border border-slate-900 bg-slate-950 p-8 hover:border-slate-800 hover:bg-slate-900/40 transition-all duration-300">
      {/* Glow Effect */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-cyan-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-md">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
};

export const FeatureSection: React.FC = () => {
  const features = [
    {
      title: "Sub-Millisecond Redirection",
      description: "Optimized with a Spring Boot and Redis cache-aside lookup strategy. Instantly redirects visitors under high concurrent loads.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      ),
    },
    {
      title: "Real-Time Log Tracking",
      description: "Access instant click logs, routing latency stats, and access records for all active shortened URLs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>
      ),
    },
    {
      title: "Custom Domain Slugs",
      description: "Customize redirect paths using our secure validator. Build trust with readable aliases like shortify.local/summer-sale.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      ),
    },
    {
      title: "Developer REST API & JWT",
      description: "Automate shortening tasks in your workflow via REST endpoints, secured by stateless JWT Bearer authorization.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-950 relative scroll-mt-16">
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            SaaS Infrastructure,
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"> optimized for scale.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            Shortify provides the tools to manage your links with reliable redirection performance and full analytics.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
