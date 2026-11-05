"""
HiddenTrail AI - Recommendation Engine
Implements deterministic, preference-weighted recommendation logic for local tourism.
"""

from typing import List, Dict, Any, Optional

def score_destination(
    dest: Dict[str, Any],
    interests: List[str],
    budget: float,
    available_hours: float,
    travel_group: str,
    starting_city: str
) -> Dict[str, Any]:
    """
    Computes a match score (0-100) and rationale for a destination based on user preferences.
    """
    score = 0.0
    reasons = []

    dest_categories = [c.lower() for c in dest.get("categories", [dest.get("category", "")])]
    user_interests = [i.lower() for i in interests]
    
    # 1. Category / Interest Matching (up to 45 pts)
    matched_interests = set(dest_categories).intersection(set(user_interests))
    if matched_interests:
        pts = (len(matched_interests) / max(len(user_interests), 1)) * 45
        score += min(pts, 45.0)
        interest_names = ", ".join(m.title() for m in matched_interests)
        reasons.append(f"Directly matches your interest in {interest_names}.")
    elif not user_interests:
        score += 25.0
        reasons.append("Popular highlight suited for general exploration.")

    # 2. Travel Group Suitability (up to 25 pts)
    suitable_groups = [g.lower() for g in dest.get("suitable_for", [])]
    if travel_group.lower() in suitable_groups:
        score += 25.0
        reasons.append(f"Highly rated for {travel_group.lower()} travelers with safe access.")
    else:
        score += 10.0

    # 3. Time Availability Fit (up to 15 pts)
    est_duration = float(dest.get("estimated_duration_hours", 2.0))
    if est_duration <= available_hours:
        score += 15.0
        reasons.append(f"Fits neatly into your {available_hours:.1f}h window (requires ~{est_duration:.1f}h visit).")
    else:
        # Penalize if it exceeds available time
        penalty = min(20.0, (est_duration - available_hours) * 10)
        score = max(0.0, score - penalty)
        reasons.append(f"Visit duration ({est_duration:.1f}h) may feel rushed in a {available_hours:.1f}h window.")

    # 4. Budget Compatibility (up to 15 pts)
    est_budget = float(dest.get("estimated_budget_inr", 0))
    if est_budget <= budget:
        score += 15.0
        reasons.append(f"Within your budget: est. ₹{int(est_budget)} vs your budget of ₹{int(budget)}.")
    else:
        penalty = min(25.0, ((est_budget - budget) / max(budget, 1)) * 20)
        score = max(0.0, score - penalty)
        reasons.append(f"Estimated expense (₹{int(est_budget)}) slightly exceeds your ₹{int(budget)} target.")

    normalized_score = round(min(100.0, max(1.0, score)), 1)
    
    return {
        "score": normalized_score,
        "matched_interests": list(matched_interests),
        "explanation": " ".join(reasons)
    }

def recommend_destinations(
    destinations: List[Dict[str, Any]],
    starting_city: str = "Gurugram",
    interests: Optional[List[str]] = None,
    budget: float = 1000.0,
    available_hours: float = 6.0,
    travel_group: str = "solo"
) -> List[Dict[str, Any]]:
    """
    Ranks destinations based on user preferences.
    Guarantees reproducible, non-random, transparent recommendations.
    """
    interests = interests or []
    scored_results = []

    for dest in destinations:
        scoring = score_destination(
            dest=dest,
            interests=interests,
            budget=budget,
            available_hours=available_hours,
            travel_group=travel_group,
            starting_city=starting_city
        )
        
        # Build enriched object
        item = dict(dest)
        item["recommendation_score"] = scoring["score"]
        item["why_recommended"] = scoring["explanation"]
        item["matched_interests"] = scoring["matched_interests"]
        scored_results.append(item)

    # Sort descending by match score, then ascending by distance
    scored_results.sort(
        key=lambda d: (-d["recommendation_score"], d.get("distance_from_gurugram_center_km", 999))
    )

    return scored_results
