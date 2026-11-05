import { Destination, ItineraryPlan, TimelineStop } from '../types/tourism';

export const CITY_COORDINATES: Record<string, { lat: number; lng: number; state: string }> = {
  'Gurugram': { lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  'Delhi': { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  'Jaipur': { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  'Mumbai': { lat: 18.9220, lng: 72.8347, state: 'Maharashtra' },
  'Bengaluru': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  'Chandigarh': { lat: 30.7333, lng: 76.7794, state: 'Chandigarh' },
  'Amritsar': { lat: 31.6340, lng: 74.8723, state: 'Punjab' },
  'Kochi': { lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  'Chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  'Guwahati': { lat: 26.1445, lng: 91.7362, state: 'Assam' },
  'Varanasi': { lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh' },
  'Agra': { lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh' },
  'Shillong': { lat: 25.5788, lng: 91.8933, state: 'Meghalaya' },
  'Shimla': { lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh' },
  'Srinagar': { lat: 34.0837, lng: 74.7973, state: 'Jammu and Kashmir' },
  'Panaji (Goa)': { lat: 15.4909, lng: 73.8278, state: 'Goa' },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  'Bhubaneswar': { lat: 20.2961, lng: 85.8245, state: 'Odisha' },
};

export function getStartingCoordinates(cityName: string): { lat: number; lng: number } {
  for (const [key, val] of Object.entries(CITY_COORDINATES)) {
    if (cityName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cityName.toLowerCase())) {
      return { lat: val.lat, lng: val.lng };
    }
  }
  return { lat: 28.4595, lng: 77.0266 };
}

export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function estimateTransitMinutes(distanceKm: number): number {
  if (distanceKm <= 2.0) return 15;
  if (distanceKm <= 50.0) {
    // City and suburban traffic (avg 35 km/h + 15 min buffer)
    return Math.max(20, Math.ceil((distanceKm / 35.0) * 60) + 15);
  } else if (distanceKm <= 350.0) {
    // Inter-city National Highways / Expressways (avg 60 km/h + 25 min buffer)
    return Math.max(60, Math.ceil((distanceKm / 60.0) * 60) + 25);
  } else {
    // Long-distance inter-state travel (avg 75 km/h high-speed rail / express highway)
    return Math.max(120, Math.ceil((distanceKm / 75.0) * 60) + 40);
  }
}

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 8) * 60 + (m || 30);
}

function formatMinutesToTime(totalMinutes: number): string {
  const norm = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours24 = Math.floor(norm / 60);
  const mins = Math.floor(norm % 60);
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const paddedMins = mins < 10 ? `0${mins}` : mins;
  return `${hours12}:${paddedMins} ${period}`;
}

export function getAccommodationSuggestion(dest: Destination): string {
  const state = dest.state.toLowerCase();
  if (state.includes('rajasthan')) {
    return 'Heritage Haveli / Palace Hotel with traditional Marwari courtyard';
  } else if (state.includes('kerala')) {
    return 'Ayurvedic Eco-Resort or Traditional Backwater Waterfront Homestay';
  } else if (state.includes('himachal') || state.includes('uttarakhand')) {
    return 'Mountain Cedar Chalet / Riverside Alpine Cottage with Himalayan views';
  } else if (state.includes('goa')) {
    return 'Portuguese Coastal Villa / Beachfront Eco-Cottage';
  } else if (state.includes('meghalaya') || state.includes('arunachal') || state.includes('sikkim')) {
    return 'Traditional Bamboo Homestay with organic Khasi/Himalayan meals';
  } else if (state.includes('haryana') || state.includes('delhi')) {
    return 'Modern Boutique Hotel / Heritage Aravalli Farmstay';
  }
  return 'Centrally located boutique hotel near historic city center';
}

export function buildItineraryPlan(
  selectedDestinations: Destination[],
  startTimeStr: string = '08:30',
  originName: string = 'Gurugram',
  originLat: number = 28.4595,
  originLng: number = 77.0266,
  totalDays: number = 1
): ItineraryPlan {
  if (selectedDestinations.length === 0) {
    return {
      stops: [],
      total_duration_hours: 0,
      total_days: totalDays,
      total_budget_inr: 0,
      total_transit_km: 0,
      advice: ['Add destinations to generate your day-by-day Pan-India travel itinerary.'],
      destinations: [],
    };
  }

  // Sequence optimization: Nearest Neighbor Greedy TSP
  const unvisited = [...selectedDestinations];
  const ordered: Destination[] = [];
  let curLat = originLat;
  let curLng = originLng;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const d = haversineDistanceKm(curLat, curLng, unvisited[i].latitude, unvisited[i].longitude);
      if (d < minDistance) {
        minDistance = d;
        nearestIdx = i;
      }
    }

    const nextDest = unvisited.splice(nearestIdx, 1)[0];
    ordered.push(nextDest);
    curLat = nextDest.latitude;
    curLng = nextDest.longitude;
  }

  // Calculate day-by-day distribution
  // Typically 2 to 3 major destination visits per day for realistic travel pace
  const stopsPerDay = Math.max(1, Math.ceil(ordered.length / Math.max(1, totalDays)));
  let currentDay = 1;
  let currentClockMinutes = parseTimeToMinutes(startTimeStr);
  const startMinutes = currentClockMinutes;
  let prevLat = originLat;
  let prevLng = originLng;
  let totalTransitKm = 0;
  let totalBudget = 0;

  const stops: TimelineStop[] = [];

  ordered.forEach((dest, idx) => {
    // Check if new day starts
    const stopDay = Math.min(totalDays, Math.floor(idx / stopsPerDay) + 1);
    if (stopDay > currentDay) {
      currentDay = stopDay;
      currentClockMinutes = parseTimeToMinutes('08:30'); // Reset morning clock for new day
    }

    const directKm = haversineDistanceKm(prevLat, prevLng, dest.latitude, dest.longitude);
    const estRoadKm = directKm > 1.0 ? Math.round(directKm * 1.25 * 10) / 10 : directKm;
    totalTransitKm += estRoadKm;

    const transitMins = estimateTransitMinutes(estRoadKm);
    const transitStartTime = formatMinutesToTime(currentClockMinutes);
    currentClockMinutes += transitMins;
    const arrivalTime = formatMinutesToTime(currentClockMinutes);

    const visitDurationHours = dest.estimated_duration_hours || 2.5;
    const visitMins = Math.round(visitDurationHours * 60);
    const departureTime = formatMinutesToTime(currentClockMinutes + visitMins);

    const destBudget = dest.estimated_budget_inr || 300;
    totalBudget += destBudget;

    const foodRec = dest.famous_food && dest.famous_food.length > 0
      ? dest.famous_food.slice(0, 2).join(' & ')
      : 'Local authentic regional specialties';

    stops.push({
      stop_number: idx + 1,
      day_number: currentDay,
      destination: dest,
      distance_from_prev_km: estRoadKm,
      transit_minutes: transitMins,
      transit_window: `${transitStartTime} – ${arrivalTime}`,
      arrival_time: arrivalTime,
      departure_time: departureTime,
      visit_duration_hours: visitDurationHours,
      estimated_budget_inr: destBudget,
      accommodation_suggestion: getAccommodationSuggestion(dest),
      food_recommendation: foodRec,
    });

    currentClockMinutes += visitMins;
    prevLat = dest.latitude;
    prevLng = dest.longitude;
  });

  const totalDurationHours = Math.round(((currentClockMinutes - startMinutes) / 60 + (currentDay - 1) * 12) * 10) / 10;

  // Add realistic accommodation & daily buffer estimates to total budget for multi-day trips
  const lodgingBudgetEst = (totalDays > 1) ? (totalDays - 1) * 1800 : 0;
  const grandTotalBudget = totalBudget + lodgingBudgetEst;

  const advice: string[] = [
    `Trip commences from ${originName} across ${ordered.length} hand-picked destinations over ${totalDays} day(s).`,
    `Total estimated transit of ~${Math.round(totalTransitKm)} km. For inter-state connections (e.g. Delhi-Jaipur, Mumbai-Goa), book Vande Bharat Express trains or highway cabs in advance.`,
    `Combined approximate budget of ₹${grandTotalBudget} includes monument entry, verified local activities, meals, and estimated lodging for multi-day stops.`,
    'Always carry valid government photo identification (Aadhaar or Passport) for state checkpoint permits and monument tickets.',
  ];

  return {
    stops,
    total_duration_hours: totalDurationHours,
    total_days: totalDays,
    total_budget_inr: grandTotalBudget,
    total_transit_km: Math.round(totalTransitKm * 10) / 10,
    advice,
    destinations: ordered,
  };
}

export function getSingleDirectionsUrl(lat: number, lng: number, origin?: string): string {
  const base = 'https://www.google.com/maps/dir/?api=1';
  const params = new URLSearchParams({
    destination: `${lat},${lng}`,
    travelmode: 'driving',
  });
  if (origin && origin.trim()) {
    params.set('origin', origin.trim());
  }
  return `${base}&${params.toString()}`;
}

export function getMultiStopDirectionsUrl(
  origin: string,
  destinations: Destination[]
): string {
  if (destinations.length === 0) return 'https://www.google.com/maps';
  if (destinations.length === 1) {
    return getSingleDirectionsUrl(destinations[0].latitude, destinations[0].longitude, origin);
  }

  // Google Maps supports up to 9 waypoints in the standard URL
  const waypointDests = destinations.slice(0, 9);
  const finalDest = `${waypointDests[waypointDests.length - 1].latitude},${waypointDests[waypointDests.length - 1].longitude}`;
  const waypoints = waypointDests
    .slice(0, waypointDests.length - 1)
    .map((d) => `${d.latitude},${d.longitude}`)
    .join('|');

  const params = new URLSearchParams({
    origin: origin.trim() || 'Delhi, India',
    destination: finalDest,
    travelmode: 'driving',
    waypoints,
  });

  return `https://www.google.com/maps/dir/?api=1&${params.toString()}`;
}
