import { Destination, RecommendationResult, UserPreferences } from '../types/tourism';
import { haversineDistanceKm, CITY_COORDINATES, getStartingCoordinates } from './itinerary';

export { CITY_COORDINATES, getStartingCoordinates };

export function calculateRecommendation(
  dest: Destination,
  prefs: UserPreferences
): { score: number; explanation: string; matched: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Category / Interest Matching (up to 35 pts)
  const destCats = dest.categories.map((c) => c.toLowerCase());
  const userCats = prefs.interests.map((i) => i.toLowerCase());
  const matched = destCats.filter((c) => userCats.includes(c));

  if (matched.length > 0) {
    const pts = (matched.length / Math.max(userCats.length, 1)) * 35;
    score += Math.min(pts, 35);
    const matchedNames = matched.map((m) => m.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())).join(', ');
    reasons.push(`Directly matches your interest in ${matchedNames}.`);
  } else if (userCats.length === 0) {
    score += 20;
    reasons.push('Curated highlight suited for general exploration.');
  }

  // 2. Geographic & Trip Duration Reachability (up to 25 pts)
  const startCoords = getStartingCoordinates(prefs.starting_city);
  const distanceKm = haversineDistanceKm(startCoords.lat, startCoords.lng, dest.latitude, dest.longitude);
  const days = prefs.duration_days || Math.ceil(prefs.available_hours / 8.0) || 1;

  let maxFeasibleDistance = 150;
  if (days === 1) maxFeasibleDistance = 220;
  else if (days === 2) maxFeasibleDistance = 450;
  else if (days === 3) maxFeasibleDistance = 650;
  else if (days <= 5) maxFeasibleDistance = 1200;
  else maxFeasibleDistance = 3500; // Multi-day flight / train accessible pan-India

  if (prefs.target_state && dest.state.toLowerCase() === prefs.target_state.toLowerCase()) {
    score += 25;
    reasons.push(`Located directly in your target state of ${dest.state}.`);
  } else if (distanceKm <= maxFeasibleDistance) {
    const distScore = 25 * (1 - distanceKm / (maxFeasibleDistance * 1.2));
    score += Math.max(10, Math.min(25, distScore));
    if (distanceKm < 100) {
      reasons.push(`Easily reachable from ${prefs.starting_city} (~${Math.round(distanceKm)} km away).`);
    } else {
      reasons.push(`Ideal ${days}-day excursion from ${prefs.starting_city} (~${Math.round(distanceKm)} km away in ${dest.state}).`);
    }
  } else {
    // Accessible with flight or multi-day trip
    score += 8;
    reasons.push(`Located in ${dest.state} (~${Math.round(distanceKm)} km from ${prefs.starting_city}); best planned with flights/train.`);
  }

  // 3. Travel Group Suitability (up to 15 pts)
  if (dest.suitable_for.includes(prefs.travel_group)) {
    score += 15;
    const groupName = prefs.travel_group.charAt(0).toUpperCase() + prefs.travel_group.slice(1);
    reasons.push(`Well-suited for ${groupName} travelers with family-friendly and accessible amenities.`);
  } else {
    score += 8;
  }

  // 4. Budget Feasibility (up to 15 pts)
  // Scale budget per destination vs total trip budget
  const perDestBudgetBudget = Math.max(200, (prefs.budget || 2000) / Math.max(days * 2, 2));
  if (dest.estimated_budget_inr <= perDestBudgetBudget * 1.5) {
    score += 15;
    reasons.push(`Fits your ₹${prefs.budget} budget target (approx. ₹${dest.estimated_budget_inr} visit cost).`);
  } else {
    const budgetDelta = dest.estimated_budget_inr - perDestBudgetBudget;
    const penalty = Math.min(10, (budgetDelta / perDestBudgetBudget) * 8);
    score += Math.max(5, 15 - penalty);
    reasons.push(`Approx. ₹${dest.estimated_budget_inr} visit cost.`);
  }

  // 5. Season & Weather Suitability (up to 10 pts)
  if (
    dest.season === 'All Year' ||
    (prefs.preferred_season && dest.season === prefs.preferred_season) ||
    (!prefs.preferred_season && dest.season === 'Winter')
  ) {
    score += 10;
    reasons.push(`Optimal to explore during ${dest.best_time_to_visit}.`);
  } else {
    score += 5;
  }

  // 6. Hidden Gem bonus if applicable
  if (dest.is_hidden_gem) {
    score = Math.min(100, score + 3);
  }

  const finalScore = Math.round(Math.min(100, Math.max(10, score)));

  return {
    score: finalScore,
    explanation: reasons.join(' '),
    matched,
  };
}

export function rankDestinations(
  destinations: Destination[],
  prefs: UserPreferences
): RecommendationResult[] {
  const startCoords = getStartingCoordinates(prefs.starting_city);

  return destinations
    .map((dest) => {
      const { score, explanation, matched } = calculateRecommendation(dest, prefs);
      const distance = haversineDistanceKm(startCoords.lat, startCoords.lng, dest.latitude, dest.longitude);
      return {
        ...dest,
        recommendation_score: score,
        why_recommended: explanation,
        matched_interests: matched,
        distance_from_gurugram_center_km: distance,
      };
    })
    .sort((a, b) => {
      if (b.recommendation_score !== a.recommendation_score) {
        return b.recommendation_score - a.recommendation_score;
      }
      return (a.distance_from_gurugram_center_km || 9999) - (b.distance_from_gurugram_center_km || 9999);
    });
}
