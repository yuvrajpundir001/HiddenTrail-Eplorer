import React, { useState } from 'react';
import destinationsData from './data/destinations.json';
import { Destination, UserPreferences, CategoryType, SeasonType } from './types/tourism';
import { Navbar } from './components/Navbar';
import { HeroSection, AcceptanceTestType } from './components/HeroSection';
import { DestinationCard } from './components/DestinationCard';
import { DestinationModal } from './components/DestinationModal';
import { TripPlannerSection } from './components/TripPlannerSection';
import { HeritageStorytellerSection } from './components/HeritageStorytellerSection';
import { ItinerarySection } from './components/ItinerarySection';
import { AboutSection } from './components/AboutSection';
import { InteractiveIndiaMap } from './components/InteractiveIndiaMap';
import { Footer } from './components/Footer';
import { Search, SlidersHorizontal, MapPin, Sparkles, Map, Gem, Check, Filter } from 'lucide-react';

const destinations: Destination[] = destinationsData as Destination[];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [itineraryIds, setItineraryIds] = useState<string[]>([
    'taj-mahal-agra',
    'amer-fort',
    'sultanpur-national-park',
  ]);
  const [selectedStoryId, setSelectedStoryId] = useState<string>('taj-mahal-agra');
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);

  // Discovery Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hiddenGemsOnly, setHiddenGemsOnly] = useState<boolean>(false);
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [maxBudgetFilter, setMaxBudgetFilter] = useState<number>(5000);
  const [showMapExplorer, setShowMapExplorer] = useState<boolean>(false);

  // Planner Preferences State
  const [preferences, setPreferences] = useState<UserPreferences>({
    starting_city: 'Gurugram',
    interests: ['heritage', 'nature'],
    budget: 5000,
    duration_days: 3,
    available_hours: 24.0,
    travel_group: 'solo',
    preferred_season: 'All Year',
  });

  const handleToggleItinerary = (id: string) => {
    setItineraryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenStory = (id: string) => {
    setSelectedStoryId(id);
    setActiveTab('storyteller');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModal = (dest: Destination) => {
    setActiveModalDest(dest);
  };

  // Pan-India Acceptance Test Suite & Legacy Scenarios
  const handleRunAcceptanceTest = (test: AcceptanceTestType) => {
    if (test === 'test_1_jaipur') {
      // Test 1: Jaipur / Rajasthan (Amer Fort, Hawa Mahal, City Palace)
      setSelectedState('Rajasthan');
      setSearchQuery('Jaipur');
      setActiveTab('discover');
    } else if (test === 'test_2_amritsar') {
      // Test 2: Amritsar / Punjab (Golden Temple, Jallianwala Bagh, Wagah Border)
      setSelectedState('Punjab');
      setSearchQuery('Amritsar');
      setActiveTab('discover');
    } else if (test === 'test_3_agra') {
      // Test 3: Agra / Uttar Pradesh (Taj Mahal, Agra Fort, Fatehpur Sikri)
      setSelectedState('Uttar Pradesh');
      setSearchQuery('Agra');
      setActiveTab('discover');
    } else if (test === 'test_4_munnar') {
      // Test 4: Munnar / Kerala (Munnar, Alleppey Backwaters, Fort Kochi)
      setSelectedState('Kerala');
      setSearchQuery('Munnar');
      setActiveTab('discover');
    } else if (test === 'test_5_gurugram_3day') {
      // Test 5: 3-day itinerary from Gurugram (nearby states: Haryana, Rajasthan, UP, Delhi)
      setPreferences({
        starting_city: 'Gurugram',
        interests: ['heritage', 'nature'],
        budget: 5000,
        duration_days: 3,
        available_hours: 24.0,
        travel_group: 'solo',
        preferred_season: 'All Year',
      });
      setActiveTab('planner');
    } else if (test === 'test_6_map_selection') {
      // Test 6: India Map State Selection
      setActiveTab('discover');
      setShowMapExplorer(true);
    } else if (test === 'test_7_taj_storyteller') {
      // Test 7: Taj Mahal Storyteller
      setSelectedStoryId('taj-mahal-agra');
      setActiveTab('storyteller');
    } else if (test === 'test_8_meghalaya_gems') {
      // Test 8: Meghalaya Hidden Gems (Double Decker Living Root Bridge, Dawki, Mawlynnong)
      setSelectedState('Meghalaya');
      setHiddenGemsOnly(true);
      setSearchQuery('');
      setActiveTab('discover');
    } else if (test === 'scenario_a') {
      setPreferences({
        starting_city: 'Cyber Hub, Gurugram',
        interests: ['heritage'],
        budget: 500,
        available_hours: 4.0,
        duration_days: 1,
        travel_group: 'solo',
      });
      setActiveTab('planner');
    } else if (test === 'scenario_b') {
      setPreferences({
        starting_city: 'Cyber Hub, Gurugram',
        interests: ['nature'],
        budget: 1000,
        available_hours: 8.0,
        duration_days: 1,
        travel_group: 'friends',
      });
      setActiveTab('planner');
    } else if (test === 'scenario_c') {
      setPreferences({
        starting_city: 'Cyber Hub, Gurugram',
        interests: ['heritage', 'nature', 'culture'],
        budget: 1200,
        available_hours: 6.0,
        duration_days: 1,
        travel_group: 'family',
      });
      setActiveTab('planner');
    } else if (test === 'scenario_d') {
      setSelectedStoryId('farrukhnagar-sheesh-mahal');
      setActiveTab('storyteller');
    } else if (test === 'scenario_e') {
      setItineraryIds([
        'farrukhnagar-sheesh-mahal',
        'sultanpur-national-park',
        'damdama-lake',
      ]);
      setActiveTab('itinerary');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Distinct states list
  const allStates = Array.from(new Set(destinations.map((d) => d.state))).sort();

  // Filtered destinations for Discovery tab
  const filteredDestinations = destinations.filter((dest) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      dest.name.toLowerCase().includes(q) ||
      dest.description.toLowerCase().includes(q) ||
      dest.location.toLowerCase().includes(q) ||
      dest.city.toLowerCase().includes(q) ||
      dest.state.toLowerCase().includes(q);

    const matchesCategory =
      categoryFilter === 'all' ||
      dest.categories.some((c) => c.toLowerCase() === categoryFilter.toLowerCase());

    const matchesState = !selectedState || dest.state.toLowerCase() === selectedState.toLowerCase();

    const matchesHiddenGem = !hiddenGemsOnly || dest.is_hidden_gem;

    const matchesSeason =
      seasonFilter === 'all' ||
      dest.season === 'All Year' ||
      dest.season.toLowerCase() === seasonFilter.toLowerCase();

    const matchesBudget = dest.estimated_budget_inr <= maxBudgetFilter;

    return matchesSearch && matchesCategory && matchesState && matchesHiddenGem && matchesSeason && matchesBudget;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F3] text-stone-900 font-sans selection:bg-[#E8DCCB] selection:text-stone-900">
      {/* Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        itineraryCount={itineraryIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'home' && (
          <HeroSection
            onExploreClick={() => {
              setActiveTab('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPlanTripClick={() => {
              setActiveTab('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenMapClick={() => {
              setActiveTab('discover');
              setShowMapExplorer(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            featuredDestinations={destinations}
            onOpenStory={handleOpenStory}
            onOpenModal={handleOpenModal}
            onRunAcceptanceTest={handleRunAcceptanceTest}
          />
        )}

        {activeTab === 'discover' && (
          <section className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E8E2D8]">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#163828] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C25E38]" />
                  <span>Pan-India Curated Tourism Catalog · All 28 States & 8 UTs</span>
                </div>
                <h2 className="font-serif text-3xl font-bold text-stone-900">
                  Discover India&apos;s Heritage & Hidden Gems
                </h2>
                <p className="text-stone-600 text-sm mt-1 max-w-2xl">
                  Explore 125+ verified destinations spanning Mughal palaces, living root bridges, Himalayan valleys, Kerala backwaters, and quiet spiritual retreats.
                </p>
              </div>

              {/* Map Toggle Button */}
              <button
                onClick={() => setShowMapExplorer(!showMapExplorer)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
                  showMapExplorer
                    ? 'bg-[#163828] text-white'
                    : 'bg-white hover:bg-[#F4EFEA] text-stone-800 border border-[#E8E2D8]'
                }`}
              >
                <Map className="w-4 h-4 text-[#C25E38]" />
                <span>{showMapExplorer ? 'Hide Interactive Map' : 'Show Interactive India Map'}</span>
              </button>
            </div>

            {/* Interactive India Map if toggled */}
            {showMapExplorer && (
              <InteractiveIndiaMap
                destinations={destinations}
                selectedState={selectedState}
                onSelectState={(state) => setSelectedState(state)}
              />
            )}

            {/* Filter Controls (Search, Categories, State, Hidden Gem, Budget) */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search input (5 cols) */}
                <div className="md:col-span-5 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search monument, city, temple, beach, or state..."
                    className="w-full text-xs sm:text-sm bg-[#FBF8F3] border border-[#E8E2D8] rounded-lg pl-9 pr-4 py-2.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#163828]"
                  />
                </div>

                {/* State selector (4 cols) */}
                <div className="md:col-span-4">
                  <select
                    value={selectedState || 'All'}
                    onChange={(e) => setSelectedState(e.target.value === 'All' ? null : e.target.value)}
                    className="w-full text-xs sm:text-sm bg-[#FBF8F3] border border-[#E8E2D8] rounded-lg px-3 py-2.5 text-stone-800 font-medium focus:outline-none focus:border-[#163828]"
                  >
                    <option value="All">All 28 States & 8 UTs ({destinations.length})</option>
                    {allStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hidden Gem Toggle (3 cols) */}
                <div className="md:col-span-3">
                  <button
                    onClick={() => setHiddenGemsOnly(!hiddenGemsOnly)}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                      hiddenGemsOnly
                        ? 'bg-[#C25E38] text-white border-[#C25E38] shadow-2xs'
                        : 'bg-[#FBF8F3] hover:bg-[#F4EFEA] text-stone-700 border-[#E8E2D8]'
                    }`}
                  >
                    <Gem className="w-3.5 h-3.5" />
                    <span>{hiddenGemsOnly ? 'Hidden Gems Only' : 'Include All Gems'}</span>
                  </button>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
                {[
                  'all',
                  'heritage',
                  'nature',
                  'culture',
                  'adventure',
                  'religious',
                  'beach',
                  'hill_station',
                  'wildlife',
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors shrink-0 ${
                      categoryFilter === cat
                        ? 'bg-[#163828] text-white shadow-2xs font-semibold'
                        : 'bg-[#FBF8F3] text-stone-600 hover:text-stone-900 border border-[#E8E2D8]'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Secondary Slider & Season Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#F2ECE3] text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
                  <span>Max Budget Filter: <strong className="text-stone-900">₹{maxBudgetFilter.toLocaleString('en-IN')}</strong></span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-64">
                  <input
                    type="range"
                    min="200"
                    max="10000"
                    step="200"
                    value={maxBudgetFilter}
                    onChange={(e) => setMaxBudgetFilter(parseInt(e.target.value))}
                    className="w-full accent-[#163828] cursor-pointer"
                  />
                  <span className="text-[11px] text-stone-400 shrink-0">₹10,000</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="text-xs text-stone-500">
                  Showing <strong>{filteredDestinations.length}</strong> of {destinations.length} verified Indian destinations
                  {selectedState && <span> in <strong className="text-[#163828]">{selectedState}</strong></span>}
                </span>
                {(searchQuery || categoryFilter !== 'all' || selectedState || hiddenGemsOnly || maxBudgetFilter < 10000) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setSelectedState(null);
                      setHiddenGemsOnly(false);
                      setMaxBudgetFilter(10000);
                    }}
                    className="text-xs text-[#163828] font-semibold hover:underline"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>

              {filteredDestinations.length === 0 ? (
                <div className="bg-white border border-[#E8E2D8] rounded-2xl p-12 text-center text-stone-600 text-sm">
                  No destinations match the selected criteria in {selectedState || 'India'}. Try adjusting your search or resetting filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDestinations.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      isInItinerary={itineraryIds.includes(dest.id)}
                      onToggleItinerary={handleToggleItinerary}
                      onOpenStory={handleOpenStory}
                      onOpenModal={handleOpenModal}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'planner' && (
          <TripPlannerSection
            destinations={destinations}
            preferences={preferences}
            onUpdatePreferences={setPreferences}
            itineraryIds={itineraryIds}
            onToggleItinerary={handleToggleItinerary}
            onOpenStory={handleOpenStory}
            onOpenModal={handleOpenModal}
          />
        )}

        {activeTab === 'storyteller' && (
          <HeritageStorytellerSection
            destinations={destinations}
            selectedId={selectedStoryId}
            onSelectDestination={setSelectedStoryId}
            onOpenModal={handleOpenModal}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItinerarySection
            destinations={destinations}
            itineraryIds={itineraryIds}
            onRemoveFromItinerary={handleToggleItinerary}
            onClearItinerary={() => setItineraryIds([])}
            onExploreMore={() => {
              setActiveTab('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenStory={handleOpenStory}
          />
        )}

        {activeTab === 'about' && <AboutSection />}
      </main>

      {/* Modal View for In-Depth Destination Exploration */}
      <DestinationModal
        destination={activeModalDest}
        onClose={() => setActiveModalDest(null)}
        onOpenStory={handleOpenStory}
        isInItinerary={Boolean(activeModalDest && itineraryIds.includes(activeModalDest.id))}
        onToggleItinerary={handleToggleItinerary}
      />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
