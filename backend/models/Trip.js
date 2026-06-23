const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  estimatedCostUSD: { type: Number, default: 0 },
  timeOfDay: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening'],
    default: 'Morning'
  }
});

const DaySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  theme: { type: String, default: '' }, // e.g. "Temples & Street Food"
  activities: [ActivitySchema]
});

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tier: { type: String, default: '' }, // Budget / Mid-range / Luxury
  estimatedCostNightUSD: { type: Number, default: 0 },
  rating: { type: String, default: '' }
});

const PackingItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  category: {
    type: String,
    enum: ['Documents', 'Clothing', 'Gear', 'Other'],
    default: 'Other'
  },
  isPacked: { type: Boolean, default: false }
});

const BudgetSchema = new mongoose.Schema(
  {
    flights: { type: Number, default: 0 },
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  { _id: false }
);

const TripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    destination: { type: String, required: true, trim: true },
    durationDays: { type: Number, required: true, min: 1, max: 30 },
    budgetTier: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true
    },
    interests: [{ type: String }],
    itinerary: [DaySchema],
    hotels: [HotelSchema],
    estimatedBudget: { type: BudgetSchema, default: () => ({}) },
    packingList: [PackingItemSchema],
    status: {
      type: String,
      enum: ['generating', 'ready', 'failed'],
      default: 'generating'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', TripSchema);
