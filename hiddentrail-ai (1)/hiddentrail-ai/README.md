# HiddenTrail AI — Local Tourism Discovery Platform

HiddenTrail AI is an AI-powered local tourism discovery platform that helps tourists discover hidden destinations, understand local heritage, and explore nearby attractions across **Gurugram and Haryana, India**.

## Project Highlights
- **Curated Destinations**: Authentic historical sites including Farrukhnagar Sheesh Mahal, Sultanpur National Park (Ramsar Wetland), Damdama Lake, Sohna Sulphur Springs & Shiva Temple, and Rao Tula Ram Memorial Museum.
- **Preference-Weighted Recommendation Engine**: Transparent algorithm factoring in user interests, budget constraints, available hours, and travel group profile.
- **AI Heritage Storyteller**: Rich architectural narratives and historical context with graceful offline fallback when no API key is provided.
- **Smart Itinerary Planner**: Nearest-neighbor sequential optimization, realistic Haryana suburban transit buffers, and one-tap Google Maps directions.

## Quick Start (Python / Streamlit)

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Streamlit application**:
   ```bash
   streamlit run app.py
   ```

3. **(Optional) Configure OpenAI API**:
   Copy `.env.example` to `.env` and set `OPENAI_API_KEY`:
   ```bash
   cp .env.example .env
   ```
   *Note: HiddenTrail AI includes a complete curated offline heritage knowledge base. The app runs 100% functional with or without an API key.*

## Testing Scenarios

- **Scenario A**: User selects *Heritage*, ₹500 budget, and 4 hours.
  - Recommended: Farrukhnagar Sheesh Mahal and Baoli of Ghaus Ali Shah.
- **Scenario B**: User selects *Nature*, ₹1000 budget, and 8 hours.
  - Recommended: Sultanpur National Park and Damdama Lake.
- **Scenario C**: User selects destinations suitable for *Family* travel.
  - Filter and ranking prioritizes safe, educational sites with family amenities.
- **Scenario D**: Heritage explanation requested without an API key.
  - Seamlessly delivers the verified archival narrative from `destinations.json`.
- **Scenario E**: User generates an itinerary and opens directions.
  - Generates optimized timeline stops, transit gaps, and functional multi-stop Google Maps directions.
