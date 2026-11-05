"""
HiddenTrail AI - Navigation & Maps Utility
Generates official Google Maps directions and view URLs using verified coordinates.
"""

import urllib.parse
from typing import List, Dict, Any, Optional

def get_destination_directions_url(latitude: float, longitude: float, origin: Optional[str] = None) -> str:
    """
    Builds a Google Maps directions URL for a single destination.
    """
    base = "https://www.google.com/maps/dir/?api=1"
    params = {
        "destination": f"{latitude},{longitude}",
        "travelmode": "driving"
    }
    if origin and origin.strip():
        params["origin"] = origin.strip()
    return f"{base}&{urllib.parse.urlencode(params)}"

def get_destination_view_url(latitude: float, longitude: float, place_name: Optional[str] = None) -> str:
    """
    Builds a Google Maps search/pin URL.
    """
    query = f"{latitude},{longitude}"
    if place_name:
        query = f"{place_name}, {query}"
    return f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(query)}"

def get_multi_stop_directions_url(
    origin: str,
    destinations: List[Dict[str, Any]]
) -> str:
    """
    Builds a multi-stop sequential Google Maps directions URL for an itinerary.
    """
    if not destinations:
        return "https://www.google.com/maps"
    
    if len(destinations) == 1:
        return get_destination_directions_url(
            destinations[0]["latitude"],
            destinations[0]["longitude"],
            origin=origin
        )

    # First is origin (or user custom origin, with first dest as first stop)
    start_point = origin.strip() if origin and origin.strip() else f"{destinations[0]['latitude']},{destinations[0]['longitude']}"
    
    if origin and origin.strip():
        # Destination is the last one, intermediate are waypoints
        final_dest = f"{destinations[-1]['latitude']},{destinations[-1]['longitude']}"
        waypoints = [f"{d['latitude']},{d['longitude']}" for d in destinations[:-1]]
    else:
        # Origin is destination 0, final is destination -1
        final_dest = f"{destinations[-1]['latitude']},{destinations[-1]['longitude']}"
        waypoints = [f"{d['latitude']},{d['longitude']}" for d in destinations[1:-1]]

    base = "https://www.google.com/maps/dir/?api=1"
    params = {
        "origin": start_point,
        "destination": final_dest,
        "travelmode": "driving"
    }
    if waypoints:
        params["waypoints"] = "|".join(waypoints)
        
    return f"{base}&{urllib.parse.urlencode(params)}"
