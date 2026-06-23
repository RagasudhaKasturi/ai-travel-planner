const Trip = require('../models/Trip');
const { callGeminiJSON } = require('../utils/geminiClient');
const { buildTripGenerationPrompt, buildRegenerateDayPrompt } = require('../utils/promptTemplates');

/**
 * Every handler below scopes its MongoDB query with `userId: req.user.id`
 * (or finds-then-checks ownership). This is what enforces strict
 * per-user data isolation end to end, not just at the route level.
 */

// POST /api/trips/generate
exports.generateTrip = async (req, res, next) => {
  try {
    const { destination, durationDays, budgetTier, interests = [] } = req.body;

    if (!destination || !durationDays || !budgetTier) {
      return res
        .status(400)
        .json({ message: 'destination, durationDays, and budgetTier are required.' });
    }
    if (!['Low', 'Medium', 'High'].includes(budgetTier)) {
      return res.status(400).json({ message: 'budgetTier must be Low, Medium, or High.' });
    }

    const prompt = buildTripGenerationPrompt({ destination, durationDays, budgetTier, interests });
    const aiResult = await callGeminiJSON(prompt);

    const trip = await Trip.create({
      userId: req.user.id,
      destination,
      durationDays,
      budgetTier,
      interests,
      itinerary: aiResult.itinerary || [],
      hotels: aiResult.hotels || [],
      estimatedBudget: aiResult.estimatedBudget || {},
      packingList: aiResult.packingList || [],
      status: 'ready'
    });

    return res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

// GET /api/trips
exports.getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};

// GET /api/trips/:id
exports.getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }
    return res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

// PUT /api/trips/:id  (generic partial update — used for manual edits)
exports.updateTrip = async (req, res, next) => {
  try {
    const allowedFields = ['itinerary', 'hotels', 'estimatedBudget', 'packingList', 'interests'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }
    return res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/trips/:id
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }
    return res.status(200).json({ message: 'Trip deleted.' });
  } catch (error) {
    next(error);
  }
};

// POST /api/trips/:id/activities  { dayNumber, title, description, estimatedCostUSD, timeOfDay }
exports.addActivity = async (req, res, next) => {
  try {
    const { dayNumber, title, description = '', estimatedCostUSD = 0, timeOfDay = 'Afternoon' } = req.body;
    if (!dayNumber || !title) {
      return res.status(400).json({ message: 'dayNumber and title are required.' });
    }

    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const day = trip.itinerary.find((d) => d.dayNumber === Number(dayNumber));
    if (!day) {
      return res.status(404).json({ message: `Day ${dayNumber} not found in this trip.` });
    }

    day.activities.push({ title, description, estimatedCostUSD, timeOfDay });
    await trip.save();

    return res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/trips/:id/activities/:activityId
exports.removeActivity = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    let found = false;
    for (const day of trip.itinerary) {
      const before = day.activities.length;
      day.activities = day.activities.filter(
        (a) => a._id.toString() !== req.params.activityId
      );
      if (day.activities.length !== before) found = true;
    }

    if (!found) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    await trip.save();
    return res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

// POST /api/trips/:id/regenerate-day  { dayNumber, feedback }
exports.regenerateDay = async (req, res, next) => {
  try {
    const { dayNumber, feedback } = req.body;
    if (!dayNumber || !feedback) {
      return res.status(400).json({ message: 'dayNumber and feedback are required.' });
    }

    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const dayExists = trip.itinerary.some((d) => d.dayNumber === Number(dayNumber));
    if (!dayExists) {
      return res.status(404).json({ message: `Day ${dayNumber} not found in this trip.` });
    }

    const prompt = buildRegenerateDayPrompt({
      destination: trip.destination,
      budgetTier: trip.budgetTier,
      interests: trip.interests,
      dayNumber: Number(dayNumber),
      feedback,
      existingItinerary: trip.itinerary
    });

    const newDay = await callGeminiJSON(prompt);

    trip.itinerary = trip.itinerary.map((d) =>
      d.dayNumber === Number(dayNumber)
        ? { dayNumber: newDay.dayNumber, theme: newDay.theme, activities: newDay.activities }
        : d
    );

    await trip.save();
    return res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/trips/:id/packing/:itemId  (toggle isPacked)
exports.togglePackingItem = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const item = trip.packingList.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Packing item not found.' });
    }

    item.isPacked = !item.isPacked;
    await trip.save();

    return res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
};
