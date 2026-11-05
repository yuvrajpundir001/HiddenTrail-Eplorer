"""
HiddenTrail AI - Smart Itinerary Planner
Constructs realistic schedules, sequence optimization, transit buffers, and budget tallies.
"""

import math
from datetime import datetime, timedelta
from typing import List, Dict, Any

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes great-circle distance between two GPS coordinates in kilometers.
    """
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def estimate_transit_minutes(distance_km: float) -> int:
    """
    Estimates realistic transit minutes in Haryana suburban/semi-rural roads.
    Assumes average 35 km/h transit speed with a 10-minute parking/local maneuver buffer.
    """
    if distance_km <= 1.0:
        return 10  # Walking or quick transfer
    hours = distance_km / 35.0
    minutes = int(math.ceil(hours * 60)) + 10
    return max(15, minutes)

def build_smart_itinerary(
    selected_destinations: List[Dict[str, Any]],
    start_time_str: str = "08:30",
    origin_name: str = "Cyber Hub, Gurugram",
    origin_lat: float = 28.4986,
    origin_lng: float = 77.0878
) -> Dict[str, Any]:
    """
    Generates an optimized sequence, timeline stops, travel gaps, and total budget.
    """
    if not selected_destinations:
        return {
            "stops": [],
            "total_duration_hours": 0.0,
            "total_budget_inr": 0,
            "total_transit_km": 0.0,
            "advice": ["Select one or more destinations to generate a custom itinerary."]
        }

    # Sequence optimization using greedy nearest neighbor from starting location
    unvisited = list(selected_destinations)
    current_lat = origin_lat
    current_lng = origin_lng
    ordered_destinations = []

    while unvisited:
        next_dest = min(
            unvisited,
            key=lambda d: haversine_distance_km(current_lat, current_lng, d["latitude"], d["longitude"])
        )
        ordered_destinations.append(next_dest)
        current_lat = next_dest["latitude"]
        current_lng = next_dest["longitude"]
        unvisited.remove(next_dest)

    # Build schedule timeline
    try:
        current_time = datetime.strptime(start_time_str, "%H:%M")
    except ValueError:
        current_time = datetime.strptime("08:30", "%H:%M")

    timeline_stops = []
    prev_lat = origin_lat
    prev_lng = origin_lng
    total_budget = 0
    total_transit_km = 0.0

    for idx, dest in enumerate(ordered_destinations):
        # Calculate transit from previous point
        dist_km = haversine_distance_km(prev_lat, prev_lng, dest["latitude"], dest["longitude"])
        # Road distance is typically ~1.25x haversine in NCR road grid
        est_road_km = round(dist_km * 1.25, 1) if dist_km > 1.0 else dist_km
        total_transit_km += est_road_km
        transit_min = estimate_transit_minutes(est_road_km)

        # Transit leg
        transit_start = current_time.strftime("%I:%M %p")
        current_time += timedelta(minutes=transit_min)
        arrival_time = current_time.strftime("%I:%M %p")

        # Destination duration
        visit_hours = float(dest.get("estimated_duration_hours", 2.0))
        visit_minutes = int(visit_hours * 60)
        departure_time = (current_time + timedelta(minutes=visit_minutes)).strftime("%I:%M %p")

        # Budget
        dest_budget = int(dest.get("estimated_budget_inr", 150))
        total_budget += dest_budget

        timeline_stops.append({
            "stop_number": idx + 1,
            "destination": dest,
            "distance_from_prev_km": est_road_km,
            "transit_minutes": transit_min,
            "transit_window": f"{transit_start} - {arrival_time}",
            "arrival_time": arrival_time,
            "departure_time": departure_time,
            "visit_duration_hours": visit_hours,
            "estimated_budget_inr": dest_budget
        })

        # Advance clock for departure
        current_time += timedelta(minutes=visit_minutes)
        prev_lat = dest["latitude"]
        prev_lng = dest["longitude"]

    # Calculate total excursion time from initial start to final departure
    start_dt = datetime.strptime(start_time_str, "%H:%M") if start_time_str else datetime.strptime("08:30", "%H:%M")
    total_duration_hours = round((current_time - start_dt).total_seconds() / 3600.0, 1)

    # Contextual practical advice
    practical_advice = [
        f"Trip departs at {start_dt.strftime('%I:%M %p')} from {origin_name} and wraps up around {current_time.strftime('%I:%M %p')}.",
        "Traffic conditions around Sohna Road and Farrukhnagar state highway peak between 5:30 PM - 7:30 PM; early starts help beat commuter rush.",
        f"Carry small cash notes (₹50, ₹100) for entry counters and local Haryana village tea stalls (total estimated budget: ₹{total_budget}).",
        "Keep comfortable walking shoes and at least 1 litre water per person."
    ]

    return {
        "stops": timeline_stops,
        "total_duration_hours": total_duration_hours,
        "total_budget_inr": total_budget,
        "total_transit_km": round(total_transit_km, 1),
        "advice": practical_advice,
        "destinations": ordered_destinations
    }
