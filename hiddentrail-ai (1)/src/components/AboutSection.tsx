import React from 'react';
import { ShieldCheck, Sparkles, BookOpen, MapPin, ExternalLink, Globe2, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#163828]">
          <BookOpen className="w-3.5 h-3.5 text-[#C25E38]" />
          <span>Curatorial Manifesto & Principles</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          About HiddenTrail AI
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          A Pan-India AI tourism discovery platform dedicated to uncovering profound heritage, ancient living ecology, and forgotten cultural gems across all 28 states & 8 Union Territories.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="bg-white border border-[#E8E2D8] rounded-2xl p-8 sm:p-10 shadow-xs space-y-6 text-sm text-stone-800 leading-relaxed">
        <h3 className="font-serif text-2xl font-bold text-stone-900">
          From Gurugram Origins to Pan-India Discovery
        </h3>
        <p>
          HiddenTrail AI began with a focused mission: to showcase the hidden Mughal palaces, Ramsar wetlands, and 1857 Uprising heritage of Gurugram and southern Haryana that were overlooked by tourists in India&apos;s cyber corridor.
        </p>
        <p>
          Today, that vision has expanded across the entire Indian subcontinent. Spanning <strong>all 28 Indian States and 8 Union Territories</strong> with over 125 meticulously verified destinations, HiddenTrail AI connects travelers with iconic UNESCO monuments, sacred river ghats, bio-engineered living root bridges in Meghalaya, spice valleys in Kerala, and desert fortresses in Rajasthan.
        </p>
        <p>
          <strong>HiddenTrail AI</strong> solves the genuine problem of information scattering: providing accessible historical explanations, authentic local food pairings, verified coordinates for Google Maps navigation, and multi-day itinerary sequences without AI hallucinations.
        </p>
      </div>

      {/* Reliability & Truth Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#F4EFEA] text-[#163828] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#163828]" />
          </div>
          <h4 className="font-serif text-lg font-bold text-stone-900">
            Strict Fact Invariants
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every site is documented through Archaeological Survey of India (ASI) reports, state tourism gazetteers, and Ramsar conservation records. We never fabricate opening hours, entrance fees, or architectural chronologies.
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#F4EFEA] text-[#C25E38] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#C25E38]" />
          </div>
          <h4 className="font-serif text-lg font-bold text-stone-900">
            Transparent AI Architecture
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Our recommendation engine calculates genuine fits based on your starting hub, trip duration (1-7 days), budget, and group profile. A local offline dataset guarantees full reliability even when cloud AI APIs are offline.
          </p>
        </div>
      </div>

      {/* Institutional Sources */}
      <div className="bg-[#FBF8F3] border border-[#E8E2D8] rounded-xl p-6 space-y-4">
        <h4 className="font-serif text-base font-bold text-stone-900">
          Institutional Archival Sources
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
          <div className="p-3 bg-white rounded-lg border border-[#E8E2D8]">
            <span className="font-semibold block text-stone-900 mb-0.5">Archaeological Survey of India (ASI)</span>
            <span className="text-stone-500">Monuments of National Importance & UNESCO World Heritage records</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#E8E2D8]">
            <span className="font-semibold block text-stone-900 mb-0.5">Haryana State Archaeology Department</span>
            <span className="text-stone-500">Conservation reports on Farrukhnagar Sheesh Mahal, Baolis & Sohna</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#E8E2D8]">
            <span className="font-semibold block text-stone-900 mb-0.5">Ramsar Convention on Wetlands</span>
            <span className="text-stone-500">Wetland conservation documentation for Sultanpur, Harike, and Chilika</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#E8E2D8]">
            <span className="font-semibold block text-stone-900 mb-0.5">State Tourism Corporations & Gazetteers</span>
            <span className="text-stone-500">Official visiting guidelines from Rajasthan, Kerala, Meghalaya, and UP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
