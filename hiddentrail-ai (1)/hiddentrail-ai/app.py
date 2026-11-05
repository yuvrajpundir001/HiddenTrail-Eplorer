"""
HiddenTrail AI — Pan-India AI Tourism Discovery Platform
Run using: streamlit run app.py
"""

import os
import sys
import json

# Ensure services and utils are discoverable regardless of execution directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import streamlit as st
from services.recommender import recommend_destinations
from services.ai_guide import generate_heritage_story
from services.itinerary import build_smart_itinerary
from utils.maps import get_destination_directions_url, get_multi_stop_directions_url, get_destination_view_url

# Page configuration
st.set_page_config(
    page_title="HiddenTrail AI — Explore India Beyond the Ordinary",
    page_icon="🗺️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Earthy Green, Warm Cream & Terracotta Design
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }

    h1, h2, h3, .serif-font {
        font-family: 'Playfair Display', Georgia, serif;
    }

    .main {
        background-color: #FBF8F3;
        color: #1C1917;
    }

    .stButton>button {
        background-color: #163828;
        color: #FFFFFF;
        border-radius: 8px;
        padding: 0.5rem 1.25rem;
        border: none;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .stButton>button:hover {
        background-color: #24523B;
        color: #FFFFFF;
        box-shadow: 0 4px 12px rgba(22, 56, 40, 0.15);
    }

    .destination-card {
        background-color: #FFFFFF;
        border: 1px solid #E8E3DA;
        border-radius: 12px;
        padding: 1.25rem;
        margin-bottom: 1.25rem;
        box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }

    .meta-tag {
        color: #78716C;
        font-size: 0.825rem;
    }

    .badge-accent {
        color: #C25E38;
        font-weight: 600;
        font-size: 0.85rem;
    }

    .hero-container {
        background: linear-gradient(135deg, #163828 0%, #234D37 100%);
        color: #FFFFFF;
        padding: 3.5rem 2rem;
        border-radius: 16px;
        margin-bottom: 2rem;
        text-align: center;
    }

    .hero-title {
        font-family: 'Playfair Display', serif;
        font-size: 2.75rem;
        font-weight: 700;
        color: #FBF8F3;
        margin-bottom: 1rem;
    }

    .hero-subtitle {
        font-size: 1.15rem;
        color: #E2DDD5;
        max-width: 760px;
        margin: 0 auto 1.5rem auto;
        line-height: 1.6;
    }
</style>
""", unsafe_allow_html=True)

# Load data safely
@st.cache_data
def load_destinations():
    data_path = os.path.join(os.path.dirname(__file__), "data", "destinations.json")
    if not os.path.exists(data_path):
        data_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "destinations.json")
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)

destinations = load_destinations()

# Distinct states
all_states = sorted(list(set(d.get("state", "Unknown") for d in destinations)))

# Initialize session state
if "itinerary_ids" not in st.session_state:
    st.session_state.itinerary_ids = ["taj-mahal", "amer-fort-jaipur", "sultanpur-national-park"]
if "selected_story_id" not in st.session_state:
    st.session_state.selected_story_id = destinations[0]["id"]
if "nav_section" not in st.session_state:
    st.session_state.nav_section = "Home"

# Sidebar navigation
with st.sidebar:
    st.markdown("### 🌲 HiddenTrail AI")
    st.caption("Pan-India Tourism Discovery Platform · 125+ Destinations")
    
    selected_nav = st.radio(
        "Navigation",
        ["Home", "Discover Destinations", "AI Trip Planner", "Heritage Storyteller", "My Itinerary", "About HiddenTrail"],
        index=["Home", "Discover Destinations", "AI Trip Planner", "Heritage Storyteller", "My Itinerary", "About HiddenTrail"].index(st.session_state.nav_section)
    )
    st.session_state.nav_section = selected_nav

    st.markdown("---")
    st.markdown(f"**Selected for Itinerary:** {len(st.session_state.itinerary_ids)} stop(s)")
    if st.button("Clear Itinerary"):
        st.session_state.itinerary_ids = []
        st.rerun()

# ----------------- SECTION: HOME -----------------
if st.session_state.nav_section == "Home":
    st.markdown("""
    <div class="hero-container">
        <div class="hero-title">Explore India Beyond the Ordinary.</div>
        <div class="hero-subtitle">
            Discover India's hidden gems, timeless heritage, breathtaking landscapes, and unforgettable local experiences — powered by AI.
        </div>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    with col1:
        if st.button("Explore 125+ Destinations ➔", use_container_width=True):
            st.session_state.nav_section = "Discover Destinations"
            st.rerun()
    with col2:
        if st.button("Plan My Trip with AI ➔", use_container_width=True):
            st.session_state.nav_section = "AI Trip Planner"
            st.rerun()

    st.markdown("---")
    st.subheader("Pan-India Acceptance Tests (1-Click Run)")
    t1, t2, t3, t4 = st.columns(4)
    with t1:
        if st.button("1. Jaipur / Rajasthan"):
            st.session_state.nav_section = "Discover Destinations"
            st.session_state.selected_state_filter = "Rajasthan"
            st.rerun()
    with t2:
        if st.button("2. Amritsar / Punjab"):
            st.session_state.nav_section = "Discover Destinations"
            st.session_state.selected_state_filter = "Punjab"
            st.rerun()
    with t3:
        if st.button("3. Agra / Uttar Pradesh"):
            st.session_state.nav_section = "Discover Destinations"
            st.session_state.selected_state_filter = "Uttar Pradesh"
            st.rerun()
    with t4:
        if st.button("4. Munnar / Kerala"):
            st.session_state.nav_section = "Discover Destinations"
            st.session_state.selected_state_filter = "Kerala"
            st.rerun()

    t5, t6, t7, t8 = st.columns(4)
    with t5:
        if st.button("5. 3-Day from Gurugram"):
            st.session_state.nav_section = "AI Trip Planner"
            st.rerun()
    with t6:
        if st.button("6. India Map State Explorer"):
            st.session_state.nav_section = "Discover Destinations"
            st.rerun()
    with t7:
        if st.button("7. Taj Mahal Storyteller"):
            st.session_state.selected_story_id = "taj-mahal"
            st.session_state.nav_section = "Heritage Storyteller"
            st.rerun()
    with t8:
        if st.button("8. Meghalaya Hidden Gems"):
            st.session_state.nav_section = "Discover Destinations"
            st.session_state.selected_state_filter = "Meghalaya"
            st.rerun()

    st.markdown("---")
    st.subheader("How HiddenTrail AI Works Across India")
    hcol1, hcol2, hcol3 = st.columns(3)
    with hcol1:
        st.markdown("**1. Curated Archival Grounding**")
        st.write("ASI records, State Tourism gazetteers, and Ramsar wetland conservation listings. Never hallucinated.")
    with hcol2:
        st.markdown("**2. Location-Aware Matching**")
        st.write("Balances your starting hub (Gurugram, Delhi, Mumbai, Bengaluru), multi-day horizon, and budget.")
    with hcol3:
        st.markdown("**3. Turn-by-Turn Multi-Stop Trips**")
        st.write("Optimized routes with verified road buffers and one-tap Google Maps directions.")

# ----------------- SECTION: DISCOVER DESTINATIONS -----------------
elif st.session_state.nav_section == "Discover Destinations":
    st.title("Discover India's Heritage & Hidden Gems")
    st.write("Browse 125+ verified monuments, living root bridges, tea valleys, and coastal sanctuaries across all 28 states & 8 UTs.")

    fcol1, fcol2, fcol3 = st.columns([2, 1, 1])
    with fcol1:
        search_query = st.text_input("🔍 Search by monument, city, or state", "")
    with fcol2:
        default_state = getattr(st.session_state, "selected_state_filter", "All")
        state_idx = 0
        if default_state in all_states:
            state_idx = all_states.index(default_state) + 1
        state_filter = st.selectbox("Filter by State", ["All"] + all_states, index=state_idx)
    with fcol3:
        category_filter = st.selectbox("Category", ["All", "Heritage", "Nature", "Culture", "Adventure", "Religious", "Beach", "Hill Station", "Wildlife"])

    # Filter logic
    filtered = []
    for d in destinations:
        matches_search = (
            search_query.lower() in d["name"].lower()
            or search_query.lower() in d["description"].lower()
            or search_query.lower() in d.get("location", "").lower()
            or search_query.lower() in d.get("city", "").lower()
            or search_query.lower() in d.get("state", "").lower()
        )
        matches_state = (state_filter == "All" or d.get("state", "") == state_filter)
        matches_cat = (
            category_filter == "All"
            or category_filter.lower() in [c.lower() for c in d.get("categories", [d.get("category", "")])]
        )

        if matches_search and matches_state and matches_cat:
            filtered.append(d)

    st.write(f"Showing **{len(filtered)}** destination(s)")

    for dest in filtered:
        with st.container():
            c_img, c_info = st.columns([1, 2])
            with c_img:
                st.image(dest["image_url"], use_container_width=True)
            with c_info:
                st.markdown(f"### {dest['name']}")
                st.markdown(
                    f"<span class='meta-tag'>{dest.get('city', '')}, {dest.get('state', '')} · "
                    f"Approx. ₹{dest['estimated_budget_inr']} · {dest['estimated_duration_hours']}h visit · "
                    f"Best Season: {dest.get('best_time_to_visit', dest.get('opening_hours', ''))}</span>",
                    unsafe_allow_html=True
                )
                st.write(dest["description"])
                st.markdown(f"**Significance:** {dest['historical_significance']}")
                
                # Buttons row
                bcol1, bcol2, bcol3 = st.columns(3)
                with bcol1:
                    dir_url = get_destination_directions_url(dest["latitude"], dest["longitude"])
                    st.link_button("📍 Get Directions", dir_url)
                with bcol2:
                    if st.button("📖 Read Heritage Story", key=f"story_{dest['id']}"):
                        st.session_state.selected_story_id = dest["id"]
                        st.session_state.nav_section = "Heritage Storyteller"
                        st.rerun()
                with bcol3:
                    is_in = dest["id"] in st.session_state.itinerary_ids
                    label = "✓ In Itinerary" if is_in else "+ Add to Trip"
                    if st.button(label, key=f"itin_{dest['id']}"):
                        if is_in:
                            st.session_state.itinerary_ids.remove(dest["id"])
                        else:
                            st.session_state.itinerary_ids.append(dest["id"])
                        st.rerun()
            st.markdown("---")

# ----------------- SECTION: AI TRIP PLANNER -----------------
elif st.session_state.nav_section == "AI Trip Planner":
    st.title("AI Trip Recommender — Pan-India")
    st.write("Personalized travel recommendations matching your hub, duration (1-7 days), and budget.")

    with st.form("preference_form"):
        col1, col2 = st.columns(2)
        with col1:
            starting_city = st.selectbox(
                "Starting Location",
                ["Gurugram", "Delhi", "Jaipur", "Mumbai", "Bengaluru", "Kolkata", "Chandigarh", "Amritsar", "Kochi", "Agra", "Shillong"]
            )
            interests = st.multiselect(
                "Your Interests",
                ["heritage", "nature", "culture", "adventure", "religious", "beach", "hill_station", "wildlife", "food"],
                default=["heritage", "nature"]
            )
            travel_group = st.selectbox(
                "Travel Group",
                ["solo", "friends", "family", "couple"]
            )
        with col2:
            duration_days = st.slider("Trip Duration (Days)", 1, 7, 3, step=1)
            budget = st.slider("Total Trip Budget (₹)", 500, 25000, 5000, step=500)

        submitted = st.form_submit_button("Generate Recommendations ➔")

    # Run genuine recommender
    ranked = recommend_destinations(
        destinations=destinations,
        starting_city=starting_city,
        interests=interests,
        budget=budget,
        available_hours=float(duration_days * 8.0),
        travel_group=travel_group
    )

    st.subheader(f"Ranked Recommendations ({len(ranked)} destinations)")
    for rank_idx, item in enumerate(ranked[:15]):
        score = item["recommendation_score"]
        with st.container():
            c1, c2 = st.columns([1, 2])
            with c1:
                st.image(item["image_url"], use_container_width=True)
                st.markdown(f"**Match Fit:** `{score}% Match`")
            with c2:
                st.markdown(f"### {rank_idx + 1}. {item['name']} ({item.get('city', '')}, {item.get('state', '')})")
                st.markdown(f"<span class='badge-accent'>Why Recommended:</span> {item['why_recommended']}", unsafe_allow_html=True)
                st.write(item["description"])
                st.caption(f"Estimated: ₹{item['estimated_budget_inr']} · {item['estimated_duration_hours']} hours visit")

                b1, b2 = st.columns(2)
                with b1:
                    is_in = item["id"] in st.session_state.itinerary_ids
                    if st.button("✓ In Itinerary" if is_in else "+ Add to Itinerary", key=f"rec_add_{item['id']}"):
                        if is_in:
                            st.session_state.itinerary_ids.remove(item["id"])
                        else:
                            st.session_state.itinerary_ids.append(item["id"])
                        st.rerun()
                with b2:
                    if st.button("Explore Heritage Story", key=f"rec_story_{item['id']}"):
                        st.session_state.selected_story_id = item["id"]
                        st.session_state.nav_section = "Heritage Storyteller"
                        st.rerun()
            st.markdown("---")

# ----------------- SECTION: HERITAGE STORYTELLER -----------------
elif st.session_state.nav_section == "Heritage Storyteller":
    st.title("AI Heritage Storyteller")
    st.caption("Deep historical chronicles and architectural breakdowns covering all 28 states & 8 UTs.")

    dest_map = {d["id"]: d for d in destinations}
    selected_id = st.selectbox(
        "Select Destination",
        options=list(dest_map.keys()),
        format_func=lambda x: f"{dest_map[x]['name']} ({dest_map[x].get('state', '')})",
        index=list(dest_map.keys()).index(st.session_state.selected_story_id)
    )
    st.session_state.selected_story_id = selected_id
    dest = dest_map[selected_id]

    col1, col2 = st.columns([1, 1])
    with col1:
        st.image(dest["image_url"], use_container_width=True)
        st.markdown(f"**State:** {dest.get('state', '')} | **City:** {dest.get('city', '')}")
        st.markdown(f"**Coordinates:** `{dest['latitude']}, {dest['longitude']}`")
        st.link_button("Open in Google Maps", get_destination_directions_url(dest["latitude"], dest["longitude"]))

    with col2:
        story_res = generate_heritage_story(dest)
        st.markdown(f"## {story_res['title']}")
        st.caption(f"Source: {story_res['source']}")
        st.markdown(story_res["narrative"])

    st.markdown("---")
    scol1, scol2 = st.columns(2)
    with scol1:
        st.subheader("Architectural Details & What to Observe")
        for obs in dest.get("what_to_observe", []):
            st.markdown(f"- {obs}")
    with scol2:
        st.subheader("Famous Food & Living Traditions")
        foods = dest.get("famous_food", [])
        if foods:
            st.markdown(f"**Local Delicacies:** {', '.join(foods)}")
        st.markdown(f"**Traditions:** {dest.get('local_traditions', 'Vibrant regional culture')}")

# ----------------- SECTION: MY ITINERARY -----------------
elif st.session_state.nav_section == "My Itinerary":
    st.title("Smart Multi-Day Itinerary Planner")
    st.caption("Optimized sequence, transit buffers, and Google Maps multi-stop routing.")

    dest_map = {d["id"]: d for d in destinations}
    selected_objs = [dest_map[sid] for sid in st.session_state.itinerary_ids if sid in dest_map]

    if not selected_objs:
        st.warning("Your itinerary is currently empty! Add destinations from the Discover or AI Trip Planner sections.")
        if st.button("Discover Destinations ➔"):
            st.session_state.nav_section = "Discover Destinations"
            st.rerun()
    else:
        col_opt1, col_opt2 = st.columns(2)
        with col_opt1:
            start_hub = st.selectbox(
                "Starting City",
                ["Gurugram", "Delhi", "Jaipur", "Mumbai", "Bengaluru", "Kolkata", "Chandigarh", "Amritsar", "Kochi", "Agra"]
            )
        with col_opt2:
            start_time = st.selectbox("Departure Time", ["07:30", "08:30", "09:30", "10:30"], index=1)

        itin_data = build_smart_itinerary(
            selected_destinations=selected_objs,
            start_time_str=start_time,
            origin_name=start_hub
        )

        m1, m2, m3, m4 = st.columns(4)
        m1.metric("Total Stops", len(itin_data["stops"]))
        m2.metric("Total Excursion", f"{itin_data['total_duration_hours']} Hours")
        m3.metric("Est. Transit Distance", f"~{itin_data['total_transit_km']} km")
        m4.metric("Est. Total Budget", f"₹{itin_data['total_budget_inr']}")

        maps_multi_url = get_multi_stop_directions_url(start_hub, itin_data["destinations"])
        st.link_button("🗺️ Open Multi-Stop Route in Google Maps", maps_multi_url, use_container_width=True)

        st.markdown("---")
        st.subheader("Sequential Timeline")

        for stop in itin_data["stops"]:
            d = stop["destination"]
            with st.container():
                st.markdown(
                    f"#### Stop {stop['stop_number']}: {d['name']} ({d.get('city', '')}, {d.get('state', '')}) "
                    f"<span style='font-size:0.9rem; color:#78716C;'>({stop['arrival_time']} – {stop['departure_time']})</span>",
                    unsafe_allow_html=True
                )
                st.write(
                    f"**Transit leg:** ~{stop['distance_from_prev_km']} km ({stop['transit_minutes']} mins buffer) · "
                    f"**Visit duration:** {stop['visit_duration_hours']}h · "
                    f"**Budget:** approx. ₹{stop['estimated_budget_inr']}"
                )
                st.caption(d["description"])
                st.markdown("---")

# ----------------- SECTION: ABOUT HIDDENTRAIL -----------------
elif st.session_state.nav_section == "About HiddenTrail":
    st.title("About HiddenTrail AI")
    st.markdown("""
    ### Mission
    HiddenTrail AI connects curious travelers with the lesser-known historical, ecological, and cultural treasures across **all 28 Indian States and 8 Union Territories**.

    Starting from the ancient stepwells, Aravalli ecology, and 1857 Uprising heritage of Gurugram & Haryana, our platform has expanded to cover over 125 curated destinations across India.

    ### Reliability & Anti-Hallucination Policy
    - **No Fabricated Opening Hours or Tickets:** All timings and budgets are explicitly marked as verified or approximate estimates.
    - **Historical Accuracy:** Grounded in Archaeological Survey of India (ASI) reports, State Archives, and District Gazetteers.
    - **Transparent AI:** When API keys are active, AI models augment narratives within strict curatorial guardrails; otherwise, a 100% verified offline heritage database is served.
    """)
