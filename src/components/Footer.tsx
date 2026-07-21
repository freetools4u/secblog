import React, { useState } from 'react';
import { ArrowUp, Sparkles, Mail, Globe, Heart } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
}

export default function Footer({ onSelectCategory }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#121211] text-gray-400 pt-8 pb-10 border-t border-gray-900/40 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-12 border-b border-gray-800/60">
          
          {/* Column 1: Brand Pitch & Newsletter */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-[#2563eb] text-white rounded-xl flex items-center justify-center font-display font-black text-sm tracking-tight shadow-lg shadow-blue-950/20">
                  Z
                </div>
                <span className="text-lg font-display font-black text-white tracking-tight">
                  Zenire <span className="text-gray-400 font-light">Knowledge</span>
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                Publishing curated engineering concepts, career blueprints, and educational insights for high performance and elite readability.
              </p>
            </div>

            {/* Premium Interactive Newsletter Presentation */}
            <div className="max-w-md pt-2">
              <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Join the elite list</span>
              </h4>
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your expert email..."
                    className="w-full bg-[#1b1b1a] border border-gray-800/80 rounded-xl py-2.5 pl-10 pr-28 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563eb]/60 focus:ring-1 focus:ring-[#2563eb]/20 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 text-white font-mono font-bold text-[10px] px-3.5 rounded-lg transition-all duration-150 cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
              {subscribed && (
                <p className="text-[11px] font-mono text-[#2563eb] mt-2 animate-pulse">
                  ✓ Connection established. Welcome to the loop.
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest">
              Publications
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]/40" />
                  <span>All Archives</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('AI Productivity');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]/40" />
                  <span>AI Productivity & Tools</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Career & Hiring');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]/40" />
                  <span>Career & Growth</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Education');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]/40" />
                  <span>Education Blueprints</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Meta & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 sm:gap-1.5 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-[11px] font-mono text-gray-500 text-center sm:text-left">
              <span>© 2026 Zenire Blog. Designed with minimal, elegant layout aesthetics.</span>
              <span className="hidden sm:inline text-gray-800">|</span>
              <a 
                href="/sitemap.xml" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors underline decoration-gray-800 hover:decoration-[#2563eb]"
              >
                Sitemap (XML)
              </a>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-[10px] text-gray-500 font-mono">
              <span>Optimized with</span>
              <Heart className="w-3 h-3 text-[#2563eb] fill-current" />
              <span>for maximum performance</span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-3 py-1.5 bg-[#1b1b1a] border border-gray-800 hover:border-gray-700 rounded-xl text-xs text-gray-300 hover:text-white transition-all duration-200 cursor-pointer"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}

