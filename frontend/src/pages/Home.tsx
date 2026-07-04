import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { FeatureSection } from "../components/FeatureSection";
import { HowItWorks } from "../components/HowItWorks";
import { Testimonials } from "../components/Testimonials";
import { CTASection } from "../components/CTASection";
import { Footer } from "../components/Footer";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top sticky responsive Navbar */}
      <Navbar />

      <main>
        {/* Hero Banner with local URL Shortening Simulation */}
        <Hero />

        {/* Core Features Grid */}
        <FeatureSection />

        {/* Three Step Workflow */}
        <HowItWorks />

        {/* Social Proof Testimonials */}
        <Testimonials />

        {/* Final Registration Call To Action */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
