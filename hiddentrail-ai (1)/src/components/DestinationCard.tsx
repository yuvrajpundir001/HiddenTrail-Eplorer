import React from 'react';
import { Destination } from '../types/tourism';
import { MapPin, Navigation, BookOpen, Plus, Check, Clock, IndianRupee } from 'lucide-react';
import { getSingleDirectionsUrl } from '../utils/itinerary';

interface DestinationCardProps {
  destination: Destination;
  isInItinerary: boolean;
  onToggleItinerary: (id: string) => void;
  onOpenStory: (id: string) => void;
  onOpenModal: (destination: Destination) => void;
  whyRecommended?: string;
  recommendationScore?: number;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isInItinerary,
  onToggleItinerary,
  onOpenStory,
  onOpenModal,
  whyRecommended,
  recommendationScore,
}) => {
  const directionsUrl = getSingleDirectionsUrl(destination.latitude, destination.longitude);

  return (
    <article className="bg-white border border-[#E8E2D8] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Visual Media with fallback */}
      <div className="relative aspect-[16/10] bg-[#EAE4D9] overflow-hidden cursor-pointer" onClick={() => onOpenModal(destination)}>
        <img
          src={destination.image_url}
          alt={destination.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Styled graceful fallback container
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Subtle Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Location tag overlaid */}
        <div className="absolute bottom-2.5 left-3 text-xs text-white/95 font-medium flex items-center gap-1.5 drop-shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-[#E2DDD5]" />
          <span>{destination.location}</span>
        </div>

        {/* Score overlay if recommendation view */}
        {recommendationScore !== undefined && (
          <div className="absolute top-2.5 right-2.5 bg-[#163828]/90 backdrop-blur-xs text-white text-xs font-semibold px-2 py-1 rounded-md shadow-xs">
            {recommendationScore}% Fit
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 flex-wrap">
            <span className="capitalize font-medium text-[#163828]">{destination.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>~{destination.estimated_duration_hours}h visit</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5">
              <IndianRupee className="w-3 h-3 text-stone-400" />
              <span>Est. ₹{destination.estimated_budget_inr}</span>
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenModal(destination)}
            className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#163828] transition-colors cursor-pointer leading-snug mb-2"
          >
            {destination.name}
          </h3>

          {/* Why Recommended rationale if present */}
          {whyRecommended && (
            <div className="mb-3 text-xs text-[#2B573E] bg-[#F4EFEA] p-2.5 rounded-lg leading-relaxed">
              <span className="font-semibold text-[#163828]">Why recommended: </span>
              {whyRecommended}
            </div>
          )}

          {/* Brief Description */}
          <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {destination.description}
          </p>

          {/* Timing details */}
          <div className="text-xs text-stone-500 mb-4">
            <span className="text-stone-400">Hours: </span>
            <span>{destination.opening_hours}</span>
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-[#163828] hover:bg-[#F4EFEA] rounded-md transition-colors"
              title="Get Directions in Google Maps"
            >
              <Navigation className="w-3.5 h-3.5 text-[#C25E38]" />
              <span>Directions</span>
            </a>
            <button
              onClick={() => onOpenStory(destination.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-[#163828] hover:bg-[#F4EFEA] rounded-md transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#163828]" />
              <span>Story</span>
            </button>
          </div>

          <button
            onClick={() => onToggleItinerary(destination.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              isInItinerary
                ? 'bg-[#E5ECE7] text-[#163828] hover:bg-[#D4E2D8]'
                : 'bg-[#163828] text-white hover:bg-[#234D37] shadow-2xs'
            }`}
          >
            {isInItinerary ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#163828]" />
                <span>In Trip</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
