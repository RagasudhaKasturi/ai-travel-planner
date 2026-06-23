const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  generateTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addActivity,
  removeActivity,
  regenerateDay,
  togglePackingItem
} = require('../controllers/tripController');

// Every route below requires a valid JWT
router.use(protect);

router.post('/generate', generateTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

router.post('/:id/activities', addActivity);
router.delete('/:id/activities/:activityId', removeActivity);

router.post('/:id/regenerate-day', regenerateDay);

router.patch('/:id/packing/:itemId', togglePackingItem);

module.exports = router;
