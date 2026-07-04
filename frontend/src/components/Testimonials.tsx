import React from "react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role, company, avatarUrl }) => {
  return (
    <div className="relative rounded-2xl border border-slate-900 bg-slate-950 p-8 shadow-md">
      <div className="flex items-center gap-1 mb-4 text-cyan-400">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
          </svg>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-slate-300 italic mb-6">
        "{quote}"
      </p>
      <div className="flex items-center gap-3 border-t border-slate-900/60 pt-4">
        <img
          src={avatarUrl}
          alt={author}
          className="h-10 w-10 rounded-full object-cover border border-slate-800"
        />
        <div>
          <h4 className="text-sm font-bold text-white">{author}</h4>
          <p className="text-xs text-slate-500 font-medium">
            {role} at <span className="text-indigo-400">{company}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "Shortify handles our promotional redirect traffic during peak campaign hours with ease. The Redis cache layer is incredibly fast.",
      author: "Sarah Jenkins",
      role: "VP of Growth",
      company: "StripePress",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      quote: "Integrating the Shortify REST API into our publishing system was straightforward. JWT authorization keeps our endpoints secure.",
      author: "Marcus Chen",
      role: "Lead Developer",
      company: "DataSync",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      quote: "Having complete access to redirect logs in real-time gives us the analytics we need to adjust campaigns dynamically.",
      author: "Elena Rostova",
      role: "Marketing Manager",
      company: "Webflow",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-slate-950 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Trusted by developers and
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"> growth teams worldwide.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            See how teams use Shortify to manage their external redirect operations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <TestimonialCard
              key={idx}
              quote={t.quote}
              author={t.author}
              role={t.role}
              company={t.company}
              avatarUrl={t.avatarUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
