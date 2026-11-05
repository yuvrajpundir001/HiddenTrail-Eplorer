import React, { useState } from 'react';
import { Destination } from '../types/tourism';
import { MapPin, Compass, ArrowRight, Sparkles } from 'lucide-react';

interface InteractiveIndiaMapProps {
  destinations: Destination[];
  selectedState: string | null;
  onSelectState: (state: string | null) => void;
}

interface StateNode {
  name: string;
  code: string;
  region: 'North' | 'West' | 'South' | 'East' | 'North-East' | 'Central' | 'Islands';
  x: number; // percentage in SVG viewport
  y: number;
}

const INDIAN_STATES_NODES: StateNode[] = [
  // North
  { name: 'Jammu and Kashmir', code: 'JK', region: 'North', x: 26, y: 12 },
  { name: 'Ladakh', code: 'LA', region: 'North', x: 34, y: 8 },
  { name: 'Himachal Pradesh', code: 'HP', region: 'North', x: 32, y: 18 },
  { name: 'Punjab', code: 'PB', region: 'North', x: 25, y: 22 },
  { name: 'Chandigarh', code: 'CH', region: 'North', x: 29, y: 23 },
  { name: 'Haryana', code: 'HR', region: 'North', x: 29, y: 27 },
  { name: 'Delhi', code: 'DL', region: 'North', x: 32, y: 29 },
  { name: 'Uttarakhand', code: 'UK', region: 'North', x: 36, y: 23 },
  { name: 'Uttar Pradesh', code: 'UP', region: 'North', x: 42, y: 35 },
  // West
  { name: 'Rajasthan', code: 'RJ', region: 'West', x: 22, y: 35 },
  { name: 'Gujarat', code: 'GJ', region: 'West', x: 16, y: 46 },
  { name: 'Daman and Diu', code: 'DD', region: 'West', x: 19, y: 52 },
  { name: 'Maharashtra', code: 'MH', region: 'West', x: 27, y: 56 },
  { name: 'Goa', code: 'GA', region: 'West', x: 25, y: 69 },
  // Central
  { name: 'Madhya Pradesh', code: 'MP', region: 'Central', x: 36, y: 47 },
  { name: 'Chhattisgarh', code: 'CG', region: 'Central', x: 49, y: 53 },
  // East
  { name: 'Bihar', code: 'BR', region: 'East', x: 58, y: 38 },
  { name: 'Jharkhand', code: 'JH', region: 'East', x: 57, y: 46 },
  { name: 'West Bengal', code: 'WB', region: 'East', x: 65, y: 48 },
  { name: 'Odisha', code: 'OD', region: 'East', x: 56, y: 58 },
  // South
  { name: 'Telangana', code: 'TS', region: 'South', x: 38, y: 64 },
  { name: 'Andhra Pradesh', code: 'AP', region: 'South', x: 42, y: 73 },
  { name: 'Karnataka', code: 'KA', region: 'South', x: 29, y: 72 },
  { name: 'Puducherry', code: 'PY', region: 'South', x: 42, y: 82 },
  { name: 'Tamil Nadu', code: 'TN', region: 'South', x: 36, y: 85 },
  { name: 'Kerala', code: 'KL', region: 'South', x: 30, y: 88 },
  // North-East
  { name: 'Sikkim', code: 'SK', region: 'North-East', x: 67, y: 32 },
  { name: 'Assam', code: 'AS', region: 'North-East', x: 79, y: 36 },
  { name: 'Arunachal Pradesh', code: 'AR', region: 'North-East', x: 86, y: 28 },
  { name: 'Meghalaya', code: 'ML', region: 'North-East', x: 76, y: 41 },
  { name: 'Nagaland', code: 'NL', region: 'North-East', x: 88, y: 38 },
  { name: 'Manipur', code: 'MN', region: 'North-East', x: 87, y: 45 },
  { name: 'Mizoram', code: 'MZ', region: 'North-East', x: 84, y: 52 },
  { name: 'Tripura', code: 'TR', region: 'North-East', x: 78, y: 48 },
  // Islands
  { name: 'Andaman and Nicobar Islands', code: 'AN', region: 'Islands', x: 85, y: 79 },
  { name: 'Lakshadweep', code: 'LD', region: 'Islands', x: 20, y: 85 },
];

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
  destinations,
  selectedState,
  onSelectState,
}) => {
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Group destinations count per state
  const stateCounts: Record<string, number> = {};
  destinations.forEach((d) => {
    stateCounts[d.state] = (stateCounts[d.state] || 0) + 1;
  });

  const regions = ['All', 'North', 'West', 'South', 'East', 'North-East', 'Central', 'Islands'];

  const filteredNodes = INDIAN_STATES_NODES.filter(
    (node) => activeRegion === 'All' || node.region === activeRegion
  );

  return (
    <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F2ECE3]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#163828] mb-1">
            <Compass className="w-3.5 h-3.5 text-[#C25E38]" />
            <span>Pan-India Interactive Cartography</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Interactive India Tourism Map
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Click on any State or Union Territory marker to instantly discover its curated heritage, nature, and hidden gems.
          </p>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#FBF8F3] border border-[#E8E2D8] rounded-lg overflow-x-auto">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setActiveRegion(reg)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeRegion === reg
                  ? 'bg-[#163828] text-white shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive Map Visual (7 cols) */}
        <div className="lg:col-span-7 bg-[#FBF8F3] rounded-2xl p-4 sm:p-6 border border-[#E8E2D8] relative min-h-[460px] flex items-center justify-center overflow-hidden">
          {/* Subtle Background Geographic Contour Motif */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 500 560" className="w-full h-full max-h-[500px]">
              <path
                d="M170,25 Q230,15 280,45 Q320,60 330,95 Q380,120 440,150 Q460,190 410,230 Q390,260 380,310 Q340,360 310,420 Q280,480 250,530 Q220,490 200,430 Q170,360 140,290 Q90,240 100,180 Q130,100 170,25 Z"
                fill="#E8E2D8"
                stroke="#D6CEBE"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Interactive State Markers Layer */}
          <div className="relative w-full h-[440px]">
            {filteredNodes.map((node) => {
              const count = stateCounts[node.name] || 0;
              const isSelected = selectedState === node.name;
              const isHovered = hoveredState === node.name;

              return (
                <div
                  key={node.code}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-200"
                  onMouseEnter={() => setHoveredState(node.name)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <button
                    onClick={() => {
                      if (selectedState === node.name) {
                        onSelectState(null);
                      } else {
                        onSelectState(node.name);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] font-semibold transition-all shadow-xs ${
                      isSelected
                        ? 'bg-[#C25E38] text-white border-[#C25E38] scale-110 z-20 ring-2 ring-[#C25E38]/30'
                        : isHovered
                        ? 'bg-[#163828] text-white border-[#163828] scale-105 z-20'
                        : count > 0
                        ? 'bg-white text-stone-800 border-[#D6CEBE] hover:border-[#163828]'
                        : 'bg-white/70 text-stone-400 border-dashed border-stone-200'
                    }`}
                    title={`${node.name} (${count} destinations)`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                    <span className="truncate max-w-[85px] sm:max-w-[110px]">{node.code}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-1 rounded-full ${isSelected ? 'bg-white/20' : 'bg-stone-100 text-stone-600'}`}>
                        {count}
                      </span>
                    )}
                  </button>

                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-stone-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none z-30">
                      <div className="font-bold">{node.name}</div>
                      <div className="text-[10px] text-stone-300">{count} verified destinations</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Clear Filter if state selected */}
          {selectedState && (
            <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs border border-[#E8E2D8] px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-2">
              <span className="text-xs text-stone-600">
                Filtered: <strong className="text-[#163828]">{selectedState}</strong>
              </span>
              <button
                onClick={() => onSelectState(null)}
                className="text-[11px] text-[#C25E38] hover:underline font-semibold"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Right Info & State Quick Browser (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-[#FBF8F3] rounded-xl border border-[#E8E2D8]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-700">Explore by State / UT</span>
              {selectedState && (
                <button
                  onClick={() => onSelectState(null)}
                  className="text-xs text-[#C25E38] hover:underline font-medium"
                >
                  View All India
                </button>
              )}
            </div>
            <p className="text-xs text-stone-500 leading-relaxed mb-3">
              Select a state to filter our 125+ Pan-India destination database.
            </p>

            {/* Quick State Grid Buttons */}
            <div className="max-h-64 overflow-y-auto pr-1 space-y-1.5">
              {INDIAN_STATES_NODES.map((node) => {
                const count = stateCounts[node.name] || 0;
                const isSelected = selectedState === node.name;
                return (
                  <button
                    key={node.code}
                    onClick={() => onSelectState(isSelected ? null : node.name)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors border ${
                      isSelected
                        ? 'bg-[#163828] text-white border-[#163828] font-semibold'
                        : 'bg-white hover:bg-[#F4EFEA] text-stone-800 border-[#E8E2D8]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E2DDD5]' : 'text-[#C25E38]'}`} />
                      <span>{node.name}</span>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-stone-100 text-stone-600'}`}>
                      {count} places
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
