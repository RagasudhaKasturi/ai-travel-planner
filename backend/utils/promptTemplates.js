/**
 * All prompt construction lives here, isolated from controller logic.
 * Every prompt forces a strict JSON contract that mirrors the Trip
 * schema, so the controller can trust the shape of what comes back.
 */

function buildTripGenerationPrompt({ destination, durationDays, budgetTier, interests }) {
  return `
You are a meticulous travel planning agent. Create a detailed, realistic ${durationDays}-day
travel itinerary for a trip to ${destination}.

Traveler preferences:
- Budget tier: ${budgetTier} (Low = backpacker/hostel pricing, Medium = mid-range comfort,
  High = upscale/luxury pricing)
- Interests: ${interests.length ? interests.join(', ') : 'general sightseeing'}

Rules:
- Each day must have 2-4 activities spread across Morning/Afternoon/Evening.
- Activities should reflect the traveler's stated interests where relevant.
- Cost estimates must reflect realistic local prices for ${destination} at the ${budgetTier} tier.
- Suggest exactly 3 hotels: one Budget, one Mid-range, and one Luxury option, each with a
  plausible nightly rate and a rating like "4.3/5".
- estimatedBudget totals must equal the sum of flights + accommodation + food + activities + transport.
- Generate a packingList of 8-14 items relevant to ${destination}'s climate and the planned
  activities, categorized as Documents, Clothing, Gear, or Other.

Respond with ONLY valid JSON (no markdown fences, no commentary) matching exactly this shape:
{
  "itinerary": [
    {
      "dayNumber": 1,
      "theme": "Short theme for the day",
      "activities": [
        { "title": "string", "description": "string", "estimatedCostUSD": 0, "timeOfDay": "Morning" }
      ]
    }
  ],
  "hotels": [
    { "name": "string", "tier": "Budget", "estimatedCostNightUSD": 0, "rating": "4.5/5" }
  ],
  "estimatedBudget": {
    "flights": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "transport": 0,
    "total": 0
  },
  "packingList": [
    { "item": "string", "category": "Documents", "isPacked": false }
  ]
}
`.trim();
}

function buildRegenerateDayPrompt({ destination, budgetTier, interests, dayNumber, feedback, existingItinerary }) {
  return `
You are revising day ${dayNumber} of an existing ${destination} itinerary based on traveler feedback.

Traveler preferences: Budget tier: ${budgetTier}. Interests: ${interests.join(', ') || 'general sightseeing'}.

Full current itinerary for context (do not change other days):
${JSON.stringify(existingItinerary)}

Traveler feedback for day ${dayNumber}: "${feedback}"

Rewrite ONLY day ${dayNumber} to incorporate this feedback. Keep 2-4 activities spread across
Morning/Afternoon/Evening with realistic ${budgetTier}-tier cost estimates for ${destination}.

Respond with ONLY valid JSON (no markdown fences, no commentary) matching exactly this shape:
{
  "dayNumber": ${dayNumber},
  "theme": "Short theme for the day",
  "activities": [
    { "title": "string", "description": "string", "estimatedCostUSD": 0, "timeOfDay": "Morning" }
  ]
}
`.trim();
}

module.exports = { buildTripGenerationPrompt, buildRegenerateDayPrompt };
