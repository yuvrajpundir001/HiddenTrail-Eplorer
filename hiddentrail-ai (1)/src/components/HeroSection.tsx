import React from 'react';
import { Destination } from '../types/tourism';
import { Compass, Sparkles, MapPin, ArrowRight, ShieldCheck, Route, Cpu, Map, Globe2, Award } from 'lucide-react';

export type AcceptanceTestType =
  | 'test_1_jaipur'
  | 'test_2_amritsar'
  | 'test_3_agra'
  | 'test_4_munnar'
  | 'test_5_gurugram_3day'
  | 'test_6_map_selection'
  | 'test_7_taj_storyteller'
  | 'test_8_meghalaya_gems'
  | 'scenario_a'
  | 'scenario_b'
  | 'scenario_c'
  | 'scenario_d'
  | 'scenario_e';

interface HeroSectionProps {
  onExploreClick: () => void;
  onPlanTripClick: () => void;
  onOpenMapClick?: () => void;
  featuredDestinations: Destination[];
  onOpenStory: (id: string) => void;
  onOpenModal: (dest: Destination) => void;
  onRunAcceptanceTest: (test: AcceptanceTestType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onPlanTripClick,
  onOpenMapClick,
  featuredDestinations,
  onOpenStory,
  onOpenModal,
  onRunAcceptanceTest,
}) => {
  return (
    <section className="space-y-16">
      {/* Editorial Marquee Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-[#163828] text-white shadow-xl">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_hidden_trail_1793859774079.jpg"
            alt="Incredible India heritage and landscapes"
            className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#163828] via-[#163828]/90 to-transparent" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#E2DDD5] text-xs font-medium mb-6 border border-white/10">
            <Compass className="w-3.5 h-3.5 text-[#C25E38]" />
            <span>Pan-India AI Tourism Discovery Platform · All 28 States & 8 UTs</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FBF8F3] leading-[1.15] text-balance mb-6">
            Explore India Beyond the Ordinary.
          </h1>

          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Discover India&apos;s hidden gems, timeless heritage, breathtaking landscapes, and unforgettable local experiences — powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-[#163828] bg-[#FBF8F3] hover:bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Explore 125+ Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onPlanTripClick}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-[#C25E38] hover:bg-[#A94F2E] rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Trip Recommender</span>
            </button>
            {onOpenMapClick && (
              <button
                onClick={onOpenMapClick}
                className="w-full sm:w-auto px-5 py-3.5 text-sm font-semibold text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Map className="w-4 h-4 text-[#E2DDD5]" />
                <span>Interactive India Map</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 8 Pan-India Acceptance Test Suite Quick Bar */}
      <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#F2ECE3]">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#163828] uppercase tracking-wider mb-0.5">
              <Award className="w-4 h-4 text-[#C25E38]" />
              <span>Verified Pan-India Acceptance Test Suite</span>
            </div>
            <p className="text-xs text-stone-500">
              Execute test scenarios covering all 28 Indian States, 8 UTs, multi-day routes, and heritage guides with 1 click.
            </p>
          </div>
          <span className="text-xs text-[#2B573E] font-semibold bg-[#F4EFEA] px-3 py-1 rounded-md border border-[#E8E2D8]">
            8 Pan-India Tests Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onRunAcceptanceTest('test_1_jaipur')}
            className="p-3 text-left border border-[#E8E2D8] hover:border-[#163828] hover:bg-[#FBF8F3] rounded-xl transition-all group shadow-2xs"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C25E38]">Test 1 · Rajasthan</div>
            <div className="text-xs font-bold text-stone-900 group-hover:text-[#163828] mt-0.5">Jaipur Heritage</div>
            <div className="text-[11px] text-stone-500 truncate mt-1">Amer Fort · Hawa Mahal</div>
          </button>

          <button
            onClick={() => onRunAcceptanceTest('test_2_amritsar')}
            className="p-3 text-left border border-[#E8E2D8] hover:border-[#163828] hover:bg-[#FBF8F3] rounded-xl transition-all group shadow-2xs"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C25E38]">Test 2 · Punjab</div>
            <div className="text-xs font-bold text-stone-900 group-hover:text-[#163828] mt-0.5">Amritsar Spiritual</div>
            <div className="text-[11px] text-stone-500 truncate mt-1">Golden Temple · Wagah</div>
          </button>

          <button
            onClick={() => onRunAcceptanceTest('test_3_agra')}
            className="p-3 text-left border border-[#E8E2D8] hover:border-[#163828] hover:bg-[#FBF8F3] rounded-xl transition-all group shadow-2xs"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C25E38]">Test 3 · Uttar Pradesh</div>
            <div className="text-xs font-bold text-stone-900 group-hover:text-[#163828] mt-0.5">Agra Mughal Trail</div>
            <div className="text-[11px] text-stone-500 truncate mt-1">Taj Mahal · Fatehpur Sikri</div>
          </button>

          <button
            onClick={() => onRunAcceptanceTest('test_4_munnar')}
            className="p-3 text-left border border-[#E8E2D8] hover:border-[#163828] hover:bg-[#FBF8F3] rounded-xl transition-all group shadow-2xs"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C25E38]">Test 4 · Kerala</div>
            <div className="text-xs font-bold text-stone-900 group-hover:text-[#163828] mt-0.5">Munnar & Backwaters</div>
            <div className="text-[11px] text-stone-500 truncate mt-1">Tea Gardens · Alleppey</div>
          </button>

          <button
            onClick={() => onRunAcceptanceTest('test_5_gurugram_3day')}
            className="p-3 text-left border border-[#E8E2D8] hover:border-[#163828] hover:bg-[#FBF8F3] rounded-xl transition-all group shadow-2xs"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#163828]">Test 5 · Multi-Day AI</div>
            <div className="text-xs font-bold text-stone-900 group-hover:text-[#163828] mt-0.5">3-Day from Gurugram</div>
            <div className="text-[11px] text-stone-500 truncate mt-1">Nearby States · ₹5,000</div>
          </button>

          <button
            onClick={() => onRunAcceptanceTest('test_6_map_selection')}
            className="p-3 text-left border border-[#E8E2D8] hover:border-[#163828] hover:bg-[#FBF8F3] rounded-xl transition-all group shadow-2xs"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#163828]">Test 6 · Map Navigation</div>
            <div className="text-xs font-bold text-stone-900 group-hover:text-[#163828] mt-0.5">Interactive India Map</div>
            <div className="text-[11px] text-stone-500 truncate mt-1">State Marker Filtering</div>
          </button>

          <button
            onClick={() => onRunAcceptanceTest('test_7_taj_storyteller')}
            className="p-3 text-left border border-[#E8E2D8] hover:border-[#163828] hover:bg-[#FBF8F3] rounded-xl transition-all group shadow-2xs"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#163828]">Test 7 · Storyteller</div>
            <div className="text-xs font-bold text-stone-900 group-hover:text-[#163828] mt-0.5">Taj Mahal Oral Guide</div>
            <div className="text-[11px] text-stone-500 truncate mt-1">History · Architecture · Audio</div>
          </button>

          <button
            onClick={() => onRunAcceptanceTest('test_8_meghalaya_gems')}
            className="p-3 text-left border border-[#E8E2D8] hover:border-[#163828] hover:bg-[#FBF8F3] rounded-xl transition-all group shadow-2xs"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#163828]">Test 8 · North-East</div>
            <div className="text-xs font-bold text-stone-900 group-hover:text-[#163828] mt-0.5">Meghalaya Hidden Gems</div>
            <div className="text-[11px] text-stone-500 truncate mt-1">Living Root Bridge · Dawki</div>
          </button>
        </div>
      </div>

      {/* How the Platform Works */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
            How HiddenTrail AI Works Across India
          </h2>
          <p className="text-stone-600 text-sm">
            Solving the real problem: tourists miss remarkable heritage and authentic landscapes because information is fragmented and hard to plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#F4EFEA] text-[#163828] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-[#163828]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">1. Archival & Geographic Reliability</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Every site is verified through Archaeological Survey of India (ASI) records, state gazetteers, and Ramsar wetland conservation listings. Timings and budgets are grounded in reality.
            </p>
          </div>

          <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#F4EFEA] text-[#163828] flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5 text-[#C25E38]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">2. Location-Aware AI Engine</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Calculates genuine recommendation fits based on your starting hub (Gurugram, Delhi, Mumbai, Bengaluru, Kochi), multi-day horizon, budget, and travel group. Explains why each place is recommended.
            </p>
          </div>

          <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#F4EFEA] text-[#163828] flex items-center justify-center mb-4">
              <Route className="w-5 h-5 text-[#163828]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">3. Smart Multi-Day Itineraries</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Constructs geographically sequenced routes with realistic transit buffers, verified Google Maps directions, regional lodging suggestions, and authentic food pairings.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Destinations Preview */}
      <div>
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Featured Highlights Across India
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Curated wonders spanning iconic UNESCO monuments, hidden living root bridges, and bird sanctuaries.
            </p>
          </div>
          <button
            onClick={onExploreClick}
            className="text-sm font-semibold text-[#163828] hover:text-[#24523B] flex items-center gap-1.5"
          >
            <span>View All 125+ Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDestinations.slice(0, 6).map((dest) => (
            <div
              key={dest.id}
              className="bg-white border border-[#E8E2D8] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => onOpenModal(dest)}
            >
              <div className="relative aspect-[16/10] bg-[#EAE4D9] overflow-hidden">
                <img
                  src={dest.image_url}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none" />
                <div className="absolute top-3 left-3 bg-[#163828]/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs">
                  {dest.state}
                </div>
                <div className="absolute bottom-3 left-3 text-xs text-white font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E2DDD5]" />
                  <span>{dest.city}, {dest.state}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-stone-500 mb-1.5 flex items-center gap-2 flex-wrap">
                    <span className="capitalize text-[#163828] font-medium">{dest.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>~{dest.estimated_duration_hours}h visit</span>
                    <span aria-hidden="true">·</span>
                    <span>Est. ₹{dest.estimated_budget_inr}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#163828] transition-colors mb-2">
                    {dest.name}
                  </h3>
                  <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed mb-4">
                    {dest.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between">
                  <span className="text-xs text-stone-500 truncate max-w-[180px]">
                    Best time: {dest.best_time_to_visit || dest.opening_hours.split('(')[0]}
                  </span>
                  <span className="text-xs font-semibold text-[#163828] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
                    Details ➔
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
