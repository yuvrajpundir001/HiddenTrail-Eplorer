import React from 'react';
import { Destination } from '../types/tourism';
import { X, Navigation, BookOpen, Clock, IndianRupee, MapPin, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getSingleDirectionsUrl } from '../utils/itinerary';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  onOpenStory: (id: string) => void;
  isInItinerary: boolean;
  onToggleItinerary: (id: string) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  onOpenStory,
  isInItinerary,
  onToggleItinerary,
}) => {
  if (!destination) return null;

  const directionsUrl = getSingleDirectionsUrl(destination.latitude, destination.longitude);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E2D8] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Hero Image */}
        <div className="relative aspect-[16/9] w-full bg-[#EAE4D9]">
          <img
            src={destination.image_url}
            alt={destination.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs text-[#E2DDD5] mb-1">
              <span className="capitalize">{destination.category}</span>
              <span aria-hidden="true">·</span>
              <span>{destination.location}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">{destination.name}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-800 text-sm">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FBF8F3] rounded-xl border border-[#E8E2D8]">
            <div>
              <div className="text-xs text-stone-500 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Visit Duration</span>
              </div>
              <div className="font-semibold text-stone-900">~{destination.estimated_duration_hours} Hours</div>
            </div>
            <div>
              <div className="text-xs text-stone-500 mb-1 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-stone-400" />
                <span>Est. Budget</span>
              </div>
              <div className="font-semibold text-stone-900">₹{destination.estimated_budget_inr} <span className="text-xs font-normal text-stone-500">(approx)</span></div>
            </div>
            <div>
              <div className="text-xs text-stone-500 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Timings</span>
              </div>
              <div className="font-semibold text-stone-900 truncate" title={destination.opening_hours}>
                {destination.opening_hours}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Distance</span>
              </div>
              <div className="font-semibold text-stone-900">~{destination.distance_from_gurugram_center_km} km from Center</div>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="font-serif text-base font-bold text-stone-900 mb-2">Overview</h4>
            <p className="text-stone-700 leading-relaxed">{destination.description}</p>
          </div>

          {/* Historical Significance */}
          <div>
            <h4 className="font-serif text-base font-bold text-stone-900 mb-2">Historical & Cultural Significance</h4>
            <p className="text-stone-700 leading-relaxed bg-[#F4EFEA] p-4 rounded-xl border border-[#E8E2D8]">
              {destination.historical_significance}
            </p>
          </div>

          {/* Key Highlights & What to Observe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <h4 className="font-serif text-base font-bold text-stone-900 mb-3">Key Highlights</h4>
              <ul className="space-y-2">
                {destination.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-[#163828] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-stone-900 mb-3">What to Observe Closely</h4>
              <ul className="space-y-2">
                {destination.what_to_observe.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C25E38] shrink-0 mt-2" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visitor Tips & Responsible Tourism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <h4 className="font-serif text-base font-bold text-stone-900 mb-2">Practical Visitor Tips</h4>
              <ul className="space-y-1.5 text-stone-600 text-xs sm:text-sm">
                {destination.visitor_tips.map((tip, i) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-stone-900 mb-2">Responsible Tourism Notice</h4>
              <ul className="space-y-1.5 text-stone-600 text-xs sm:text-sm">
                {destination.responsible_tourism_tips.map((tip, i) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sourcing links */}
          <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between flex-wrap gap-2 text-xs text-stone-500">
            <div className="flex items-center gap-3">
              <span className="font-medium text-stone-600">Verified Sources:</span>
              {destination.source_links.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#163828] underline flex items-center gap-1"
                >
                  <span>{src.title}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#FBF8F3] border-t border-[#E8E2D8] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#163828] hover:bg-[#234D37] rounded-lg transition-colors shadow-2xs"
            >
              <Navigation className="w-3.5 h-3.5 text-[#E2DDD5]" />
              <span>Get Directions</span>
            </a>
            <button
              onClick={() => {
                onClose();
                onOpenStory(destination.id);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 hover:text-[#163828] bg-white border border-[#E8E2D8] hover:bg-[#F4EFEA] rounded-lg transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#163828]" />
              <span>Read Full Heritage Guide</span>
            </button>
          </div>

          <button
            onClick={() => onToggleItinerary(destination.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              isInItinerary
                ? 'bg-[#E5ECE7] text-[#163828] hover:bg-[#D4E2D8]'
                : 'bg-[#C25E38] text-white hover:bg-[#A94F2E]'
            }`}
          >
            {isInItinerary ? '✓ Added to Itinerary' : '+ Add to Itinerary'}
          </button>
        </div>
      </div>
    </div>
  );
};
