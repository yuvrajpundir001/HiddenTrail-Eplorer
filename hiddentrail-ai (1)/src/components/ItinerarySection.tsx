import React, { useState } from 'react';
import { Destination } from '../types/tourism';
import { buildItineraryPlan, getMultiStopDirectionsUrl, getStartingCoordinates } from '../utils/itinerary';
import {
  Navigation,
  Clock,
  IndianRupee,
  MapPin,
  Trash2,
  ArrowRight,
  Share2,
  Check,
  AlertCircle,
  Calendar,
  Utensils,
  Hotel,
  Compass,
} from 'lucide-react';

interface ItinerarySectionProps {
  destinations: Destination[];
  itineraryIds: string[];
  onRemoveFromItinerary: (id: string) => void;
  onClearItinerary: () => void;
  onExploreMore: () => void;
  onOpenStory: (id: string) => void;
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  destinations,
  itineraryIds,
  onRemoveFromItinerary,
  onClearItinerary,
  onExploreMore,
  onOpenStory,
}) => {
  const [startHub, setStartHub] = useState<string>('Gurugram');
  const [startTime, setStartTime] = useState<string>('08:30');
  const [totalDays, setTotalDays] = useState<number>(3);
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all');
  const [copied, setCopied] = useState<boolean>(false);

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
    'Agra',
    'Varanasi',
    'Shillong',
  ];

  const selectedDestinations = itineraryIds
    .map((id) => destinations.find((d) => d.id === id))
    .filter((d): d is Destination => Boolean(d));

  // Determine starting coordinates
  const originCoords = getStartingCoordinates
    ? getStartingCoordinates(startHub)
    : { lat: 28.4595, lng: 77.0266 };

  const plan = buildItineraryPlan(
    selectedDestinations,
    startTime,
    startHub,
    originCoords.lat,
    originCoords.lng,
    totalDays
  );

  const mapsUrl = getMultiStopDirectionsUrl(startHub, plan.destinations);

  const handleCopySummary = () => {
    if (plan.stops.length === 0) return;
    const summaryText =
      `HiddenTrail AI — Multi-Day Pan-India Itinerary\n` +
      `Origin: ${startHub} | Duration: ${totalDays} Days | Total Stops: ${plan.stops.length}\n` +
      `Est. Budget: ₹${plan.total_budget_inr.toLocaleString('en-IN')} (incl. lodging & transit estimates)\n\n` +
      plan.stops
        .map(
          (s) =>
            `[Day ${s.day_number || 1}] Stop ${s.stop_number}: ${s.destination.name} (${s.destination.city}, ${s.destination.state})\n` +
            `  Schedule: ${s.arrival_time} - ${s.departure_time} (~${s.visit_duration_hours}h)\n` +
            `  Transit: ${s.transit_minutes} mins (~${s.distance_from_prev_km} km)\n` +
            `  Food: ${s.food_recommendation}\n` +
            `  Lodging: ${s.accommodation_suggestion}`
        )
        .join('\n\n') +
      `\n\nGoogle Maps Multi-Stop Navigation Route:\n${mapsUrl}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Filter stops by day if a specific day is selected
  const displayedStops =
    activeDayFilter === 'all'
      ? plan.stops
      : plan.stops.filter((s) => s.day_number === activeDayFilter);

  // Group stops by day for rendering
  const daysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  if (selectedDestinations.length === 0) {
    return (
      <div className="bg-white border border-[#E8E2D8] rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#F4EFEA] text-[#163828] flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6 text-[#163828]" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-stone-900">Your Pan-India Itinerary is Empty</h3>
        <p className="text-stone-600 text-sm leading-relaxed">
          Select destinations from our Pan-India catalog across 28 states & 8 UTs, or run the AI Trip Recommender to build a multi-city circuit.
        </p>
        <button
          onClick={onExploreMore}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-[#163828] hover:bg-[#234D37] rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <span>Explore 125+ Destinations</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#163828] mb-1">
            <Clock className="w-3.5 h-3.5 text-[#C25E38]" />
            <span>Pan-India Multi-City Sequential Route Engine</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900">Multi-Day Smart Itinerary</h2>
          <p className="text-stone-600 text-sm mt-1">
            Geographically optimized sequences with verified transit estimates, lodging recommendations, and Google Maps routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-[#E8E2D8] hover:bg-[#F4EFEA] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copied ? 'Copied Summary' : 'Share Itinerary'}</span>
          </button>
          <button
            onClick={onClearItinerary}
            className="px-3 py-2 text-xs font-medium text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Origin & Trip Horizon Ribbon */}
      <div className="bg-white border border-[#E8E2D8] rounded-xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Starting Hub City
          </label>
          <select
            value={startHub}
            onChange={(e) => setStartHub(e.target.value)}
            className="w-full text-xs sm:text-sm bg-[#FBF8F3] border border-[#E8E2D8] rounded-lg px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#163828]"
          >
            {startCityOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Total Trip Days
          </label>
          <select
            value={totalDays}
            onChange={(e) => setTotalDays(parseInt(e.target.value))}
            className="w-full text-xs sm:text-sm bg-[#FBF8F3] border border-[#E8E2D8] rounded-lg px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#163828]"
          >
            <option value={1}>1 Day Excursion</option>
            <option value={2}>2 Days (Weekend Trip)</option>
            <option value={3}>3 Days (Golden Circuit)</option>
            <option value={5}>5 Days (Extended Expedition)</option>
            <option value={7}>7 Days (Full Grand Tour)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Morning Departure
          </label>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full text-xs sm:text-sm bg-[#FBF8F3] border border-[#E8E2D8] rounded-lg px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#163828]"
          >
            <option value="07:30">07:30 AM (Sunrise & Cool Temp)</option>
            <option value="08:30">08:30 AM (Standard Start)</option>
            <option value="09:30">09:30 AM (Mid-Morning Start)</option>
          </select>
        </div>

        <div className="flex items-end">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#163828] hover:bg-[#234D37] rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2"
          >
            <Navigation className="w-3.5 h-3.5 text-[#E2DDD5]" />
            <span>Google Maps Route</span>
          </a>
        </div>
      </div>

      {/* Key Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Destinations</div>
          <div className="font-serif text-2xl font-bold text-stone-900">{plan.stops.length} Stops</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Greedy TSP Optimized</div>
        </div>
        <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Trip Duration</div>
          <div className="font-serif text-2xl font-bold text-stone-900">{totalDays} Days</div>
          <div className="text-[11px] text-stone-400 mt-0.5">~{plan.total_duration_hours}h total active span</div>
        </div>
        <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Total Road Transit</div>
          <div className="font-serif text-2xl font-bold text-stone-900">~{plan.total_transit_km} km</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Includes highway buffer</div>
        </div>
        <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Est. Total Expenses</div>
          <div className="font-serif text-2xl font-bold text-stone-900">₹{plan.total_budget_inr.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Entry + Transit + Lodging</div>
        </div>
      </div>

      {/* Multi-Day Navigation Tabs */}
      {totalDays > 1 && (
        <div className="flex items-center gap-2 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveDayFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeDayFilter === 'all'
                ? 'bg-[#163828] text-white shadow-2xs'
                : 'bg-white hover:bg-[#F4EFEA] text-stone-700 border border-[#E8E2D8]'
            }`}
          >
            All {totalDays} Days Overview ({plan.stops.length} stops)
          </button>
          {daysList.map((d) => {
            const dayStopsCount = plan.stops.filter((s) => s.day_number === d).length;
            return (
              <button
                key={d}
                onClick={() => setActiveDayFilter(d)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeDayFilter === d
                    ? 'bg-[#C25E38] text-white shadow-2xs'
                    : 'bg-white hover:bg-[#F4EFEA] text-stone-700 border border-[#E8E2D8]'
                }`}
              >
                Day {d} ({dayStopsCount} stops)
              </button>
            );
          })}
        </div>
      )}

      {/* Timeline Stops by Day */}
      <div className="space-y-6">
        {daysList.map((dayNum) => {
          const stopsInThisDay = displayedStops.filter((s) => (s.day_number || 1) === dayNum);
          if (stopsInThisDay.length === 0) return null;

          return (
            <div key={dayNum} className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#E8E2D8]">
                <div className="w-7 h-7 rounded-lg bg-[#163828] text-white flex items-center justify-center font-bold text-xs">
                  D{dayNum}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Day {dayNum} Itinerary Schedule
                  </h3>
                  <span className="text-xs text-stone-500">
                    {stopsInThisDay.length} destination visits scheduled
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {stopsInThisDay.map((stop) => {
                  const d = stop.destination;
                  return (
                    <div
                      key={d.id}
                      className="bg-white border border-[#E8E2D8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-5"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-8 h-8 rounded-full bg-[#F4EFEA] border border-[#E8E2D8] text-[#163828] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {stop.stop_number}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                            <span className="font-semibold text-[#163828] bg-[#FBF8F3] px-2 py-0.5 rounded border border-[#E8E2D8]">
                              {stop.arrival_time} – {stop.departure_time}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>~{stop.visit_duration_hours}h visit</span>
                            <span aria-hidden="true">·</span>
                            <span>Transit: ~{stop.distance_from_prev_km} km ({stop.transit_minutes} mins)</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-stone-700">{d.city}, {d.state}</span>
                          </div>

                          <h4 className="font-serif text-lg font-bold text-stone-900">{d.name}</h4>
                          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{d.description}</p>

                          {/* Food and Lodging Badges */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                            <div className="flex items-center gap-1.5 p-2 bg-[#FBF8F3] rounded-lg border border-[#E8E2D8]">
                              <Utensils className="w-3.5 h-3.5 text-[#C25E38] shrink-0" />
                              <span className="text-stone-700 truncate">
                                <strong>Food: </strong>{stop.food_recommendation}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 p-2 bg-[#FBF8F3] rounded-lg border border-[#E8E2D8]">
                              <Hotel className="w-3.5 h-3.5 text-[#163828] shrink-0" />
                              <span className="text-stone-700 truncate">
                                <strong>Stay: </strong>{stop.accommodation_suggestion}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                        <button
                          onClick={() => onOpenStory(d.id)}
                          className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-[#163828] bg-[#FBF8F3] hover:bg-[#F4EFEA] rounded-md transition-colors"
                        >
                          View Story
                        </button>
                        <button
                          onClick={() => onRemoveFromItinerary(d.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-md transition-colors"
                          title="Remove from Itinerary"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Practical Travel Advice */}
      <div className="bg-[#FBF8F3] border border-[#E8E2D8] rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2 font-serif text-base font-bold text-stone-900">
          <AlertCircle className="w-4 h-4 text-[#C25E38]" />
          <span>Practical Advice for this Pan-India Circuit</span>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
          {plan.advice.map((adv, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#163828] shrink-0 mt-2" />
              <span>{adv}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
