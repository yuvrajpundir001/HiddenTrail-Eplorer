import React from 'react';
import { Compass, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-white border-t border-[#E8E2D8] mt-24 py-12 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#F2ECE3]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#163828] text-white flex items-center justify-center">
              <Compass className="w-4 h-4 text-[#E2DDD5]" />
            </div>
            <span className="font-serif text-lg font-bold text-[#163828]">HiddenTrail AI</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-600 flex-wrap justify-center">
            <button onClick={() => setActiveTab('discover')} className="hover:text-[#163828] transition-colors">
              Discover
            </button>
            <button onClick={() => setActiveTab('planner')} className="hover:text-[#163828] transition-colors">
              AI Planner
            </button>
            <button onClick={() => setActiveTab('storyteller')} className="hover:text-[#163828] transition-colors">
              Heritage Storyteller
            </button>
            <button onClick={() => setActiveTab('itinerary')} className="hover:text-[#163828] transition-colors">
              My Itinerary
            </button>
            <button onClick={() => setActiveTab('about')} className="hover:text-[#163828] transition-colors">
              About
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400">
          <div>
            © {new Date().getFullYear()} HiddenTrail AI. Preserving & celebrating local Gurugram & Haryana heritage.
          </div>
          <div className="text-[11px] text-stone-500">
            Grounded in Haryana State Archaeology archives · No AI hallucinations
          </div>
        </div>
      </div>
    </footer>
  );
};
