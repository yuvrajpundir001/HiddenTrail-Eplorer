import React, { useState } from 'react';
import { Destination, UserPreferences, CategoryType, TravelGroupType, SeasonType } from '../types/tourism';
import { rankDestinations, CITY_COORDINATES } from '../utils/recommender';
import { DestinationCard } from './DestinationCard';
import { SlidersHorizontal, RotateCcw, Sparkles, MapPin, Calendar, Clock, IndianRupee, Compass, Layers } from 'lucide-react';

interface TripPlannerSectionProps {
  destinations: Destination[];
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  itineraryIds: string[];
  onToggleItinerary: (id: string) => void;
  onOpenStory: (id: string) => void;
  onOpenModal: (dest: Destination) => void;
}

export const TripPlannerSection: React.FC<TripPlannerSectionProps> = ({
  destinations,
  preferences,
  onUpdatePreferences,
  itineraryIds,
  onToggleItinerary,
  onOpenStory,
  onOpenModal,
}) => {
  const [selectedInterests, setSelectedInterests] = useState<CategoryType[]>(preferences.interests || ['heritage', 'nature']);
  const [budget, setBudget] = useState<number>(preferences.budget || 5000);
  const [days, setDays] = useState<number>(preferences.duration_days || 3);
  const [hours, setHours] = useState<number>(preferences.available_hours || 24);
  const [group, setGroup] = useState<TravelGroupType>(preferences.travel_group || 'solo');
  const [startCity, setStartCity] = useState<string>(preferences.starting_city || 'Gurugram');
  const [targetState, setTargetState] = useState<string>(preferences.target_state || 'All');
  const [preferredSeason, setPreferredSeason] = useState<SeasonType>(preferences.preferred_season || 'All Year');

  const startCityOptions = [
    'Gurugram',
    'Delhi',
    'Jaipur',
    'Mumbai',
    'Bengaluru',
    'Kolkata',
    'Chandigarh',
    'Amritsar',
    'Kochi',
    'Chennai',
    'Hyderabad',
    'Guwahati',
    'Varanasi',
    'Agra',
    'Shillong',
    'Shimla',
    'Srinagar',
    'Panaji (Goa)',
  ];

  // Distinct states list for filter dropdown
  const allStates = Array.from(new Set(destinations.map((d) => d.state))).sort();

  const toggleInterest = (cat: CategoryType) => {
    const updated = selectedInterests.includes(cat)
      ? selectedInterests.filter((c) => c !== cat)
      : [...selectedInterests, cat];
    setSelectedInterests(updated);
    onUpdatePreferences({
      ...preferences,
      interests: updated,
    });
  };

  const handleBudgetChange = (val: number) => {
    setBudget(val);
    onUpdatePreferences({ ...preferences, budget: val });
  };

  const handleDaysChange = (d: number) => {
    setDays(d);
    const approxHours = d * 8.0;
    setHours(approxHours);
    onUpdatePreferences({
      ...preferences,
      duration_days: d,
      available_hours: approxHours,
    });
  };

  const handleGroupChange = (grp: TravelGroupType) => {
    setGroup(grp);
    onUpdatePreferences({ ...preferences, travel_group: grp });
  };

  const handleCityChange = (city: string) => {
    setStartCity(city);
    onUpdatePreferences({ ...preferences, starting_city: city });
  };

  const handleStateChange = (st: string) => {
    setTargetState(st);
    onUpdatePreferences({ ...preferences, target_state: st === 'All' ? undefined : st });
  };

  const handleSeasonChange = (s: SeasonType) => {
    setPreferredSeason(s);
    onUpdatePreferences({ ...preferences, preferred_season: s });
  };

  const handleReset = () => {
    const defaultPrefs: UserPreferences = {
      starting_city: 'Gurugram',
      interests: ['heritage', 'nature'],
      budget: 5000,
      duration_days: 3,
      available_hours: 24.0,
      travel_group: 'solo',
      preferred_season: 'All Year',
    };
    setSelectedInterests(defaultPrefs.interests);
    setBudget(defaultPrefs.budget);
    setDays(3);
    setHours(24.0);
    setGroup('solo');
    setStartCity('Gurugram');
    setTargetState('All');
    setPreferredSeason('All Year');
    onUpdatePreferences(defaultPrefs);
  };

  // Run transparent ranking
  const rankedResults = rankDestinations(destinations, {
    starting_city: startCity,
    interests: selectedInterests,
    budget,
    available_hours: hours,
    duration_days: days,
    travel_group: group,
    preferred_season: preferredSeason,
    target_state: targetState === 'All' ? undefined : targetState,
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#163828] mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#C25E38]" />
          <span>Location-Aware Pan-India Recommendation Engine</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900">AI Trip Recommender</h2>
        <p className="text-stone-600 text-sm mt-1 max-w-2xl">
          Set your starting hub, trip duration, budget, and travel interests. Our transparent algorithm evaluates geographic feasibility, regional proximity, and interest alignment without random fabrication.
        </p>
      </div>

      {/* Interactive Preference Card */}
      <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE3]">
          <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
            <SlidersHorizontal className="w-4 h-4 text-[#163828]" />
            <span>Trip Parameters & Preferences</span>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#163828] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Starting Hub */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C25E38]" />
              <span>Starting Location / City</span>
            </label>
            <div className="space-y-2">
              <select
                value={startCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full text-xs sm:text-sm bg-[#FBF8F3] border border-[#E8E2D8] rounded-lg px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#163828]"
              >
                {startCityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c} {c === 'Gurugram' ? '(NCR Origin)' : ''}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or enter any custom city..."
                value={startCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full text-xs bg-white border border-[#E8E2D8] rounded-md px-2.5 py-1.5 text-stone-700 placeholder-stone-400 focus:outline-none focus:border-[#163828]"
              />
            </div>
          </div>

          {/* Trip Duration */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#163828]" />
                <span>Trip Duration</span>
              </span>
              <span className="text-[#163828] font-bold">
                {days === 1 ? '1 Day Excursion' : `${days} Days (${days * 8}h Active)`}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 p-1 bg-[#FBF8F3] border border-[#E8E2D8] rounded-lg mb-2">
              {[1, 2, 3, 5, 7].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDaysChange(d)}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    days === d
                      ? 'bg-[#163828] text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {d === 1 ? '1 Day' : `${d}D`}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-stone-500">
              {days === 1
                ? 'Ideal for same-day local exploration within ~150 km'
                : days <= 3
                ? `Ideal for weekend multi-city trips from ${startCity} into neighboring states`
                : 'Grand multi-region circuit across India'}
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
              <span className="flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-[#C25E38]" />
                <span>Total Budget Target</span>
              </span>
              <span className="text-[#163828] font-bold">₹{budget.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="500"
              max="25000"
              step="500"
              value={budget}
              onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
              className="w-full accent-[#163828] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>₹500 (Budget Day)</span>
              <span>₹5,000 (3-Day Trip)</span>
              <span>₹25,000+ (Premium)</span>
            </div>
          </div>

          {/* Target State Filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#163828]" />
              <span>Target State Filter (Optional)</span>
            </label>
            <select
              value={targetState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full text-xs sm:text-sm bg-[#FBF8F3] border border-[#E8E2D8] rounded-lg px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#163828]"
            >
              <option value="All">All 28 States & 8 UTs (Auto-Proximity)</option>
              {allStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Group */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Travel Group Profile
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#FBF8F3] border border-[#E8E2D8] rounded-lg">
              {(['solo', 'friends', 'family', 'couple'] as TravelGroupType[]).map((grp) => (
                <button
                  key={grp}
                  type="button"
                  onClick={() => handleGroupChange(grp)}
                  className={`py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                    group === grp
                      ? 'bg-[#163828] text-white shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          {/* Season Preference */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Preferred Travel Season
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#FBF8F3] border border-[#E8E2D8] rounded-lg">
              {(['All Year', 'Winter', 'Monsoon', 'Summer'] as SeasonType[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSeasonChange(s)}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                    preferredSeason === s
                      ? 'bg-[#163828] text-white shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Category Interests */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Primary Interests (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  'heritage',
                  'nature',
                  'culture',
                  'adventure',
                  'religious',
                  'beach',
                  'hill_station',
                  'wildlife',
                  'food',
                ] as CategoryType[]
              ).map((cat) => {
                const active = selectedInterests.includes(cat);
                const label = cat.replace('_', ' ');
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleInterest(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize border transition-all ${
                      active
                        ? 'bg-[#163828] text-white border-[#163828] shadow-2xs'
                        : 'bg-white text-stone-700 border-[#E8E2D8] hover:border-[#163828]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Ranked Results Header */}
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Ranked Recommendations for Your {days}-Day Trip from {startCity}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Dynamically sorted by preference alignment, travel feasibility from {startCity}, budget fit (₹{budget.toLocaleString('en-IN')}), and seasonal comfort.
            </p>
          </div>
          <span className="text-xs font-medium text-stone-600 bg-white border border-[#E8E2D8] px-3 py-1 rounded-md">
            Showing top {Math.min(rankedResults.length, 12)} scored candidates
          </span>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedResults.slice(0, 15).map((item) => (
            <DestinationCard
              key={item.id}
              destination={item}
              isInItinerary={itineraryIds.includes(item.id)}
              onToggleItinerary={onToggleItinerary}
              onOpenStory={onOpenStory}
              onOpenModal={onOpenModal}
              whyRecommended={item.why_recommended}
              recommendationScore={item.recommendation_score}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
