import React from 'react';
import { Compass, CalendarDays } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  itineraryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, itineraryCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF8F3]/95 backdrop-blur-md border-b border-[#E8E2D8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#163828] text-white flex items-center justify-center shadow-sm">
            <Compass className="w-4 h-4 text-[#E2DDD5]" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-[#163828] group-hover:text-[#24523B] transition-colors">
            HiddenTrail AI
          </span>
        </button>

        {/* Zone 2: Navigation Links (Clean single-line text links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          <button
            onClick={() => setActiveTab('discover')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'discover'
                ? 'text-[#163828] font-semibold border-b-2 border-[#163828]'
                : 'hover:text-[#163828]'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'planner'
                ? 'text-[#163828] font-semibold border-b-2 border-[#163828]'
                : 'hover:text-[#163828]'
            }`}
          >
            AI Planner
          </button>
          <button
            onClick={() => setActiveTab('storyteller')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'storyteller'
                ? 'text-[#163828] font-semibold border-b-2 border-[#163828]'
                : 'hover:text-[#163828]'
            }`}
          >
            Storyteller
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'itinerary'
                ? 'text-[#163828] font-semibold border-b-2 border-[#163828]'
                : 'hover:text-[#163828]'
            }`}
          >
            <span>Itinerary</span>
            {itineraryCount > 0 && (
              <span className="text-xs font-semibold bg-[#C25E38] text-white w-4 h-4 rounded-full inline-flex items-center justify-center">
                {itineraryCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'about'
                ? 'text-[#163828] font-semibold border-b-2 border-[#163828]'
                : 'hover:text-[#163828]'
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('planner')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#163828] rounded-lg hover:bg-[#234D37] transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Plan My Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
