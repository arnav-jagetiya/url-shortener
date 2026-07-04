import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-md shadow-indigo-500/20 group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                  />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Shortify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick("features")}
              className="cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick("how-it-works")}
              className="cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick("testimonials")}
              className="cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Testimonials
            </button>
            <a
              href="/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              API Docs
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="cursor-pointer inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-900 hover:text-white focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-900 bg-slate-950" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            <button
              onClick={() => handleNavClick("features")}
              className="cursor-pointer block w-full text-left rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick("how-it-works")}
              className="cursor-pointer block w-full text-left rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick("testimonials")}
              className="cursor-pointer block w-full text-left rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Testimonials
            </button>
            <a
              href="/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              API Docs
            </a>
            <div className="border-t border-slate-900 mt-4 pt-4 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer block text-center rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer block text-center rounded-md bg-indigo-600 px-3 py-2.5 text-base font-medium text-white hover:bg-indigo-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
