const express = require('express');
const axios = require('axios');
const Trip = require('../models/Trip');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all trips for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single trip
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new trip
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { destination, days, budget, travelDate, travelType } = req.body;

    // Fetch destination image from Unsplash
    let imageUrl = '';
    try {
      const unsplashResponse = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: destination,
          per_page: 1,
          orientation: 'landscape'
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      });
      if (unsplashResponse.data.results.length > 0) {
        imageUrl = unsplashResponse.data.results[0].urls.regular;
      }
    } catch (err) {
      console.log('Unsplash API error:', err.message);
    }

    // Generate basic itinerary
    const itinerary = generateItinerary(destination, days, travelType);

    const trip = new Trip({
      userId: req.userId,
      destination,
      days,
      budget,
      travelDate,
      travelType,
      itinerary,
      image: imageUrl
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update trip
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete trip
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to generate basic itinerary
function generateItinerary(destination, days, travelType) {
  const activities = {
    Solo: ['Explore local markets', 'Visit museums', 'Try street food', 'Photography walks'],
    Family: ['Visit theme parks', 'Beach activities', 'Family restaurants', 'Cultural sites'],
    Friends: ['Adventure sports', 'Nightlife', 'Group tours', 'Local experiences'],
    Couple: ['Romantic dinners', 'Sunset views', 'Spa & wellness', 'Scenic walks'],
    Business: ['Business meetings', 'Networking events', 'Conference centers', 'Professional dining']
  };

  const selectedActivities = activities[travelType] || activities.Solo;
  let itinerary = `${days}-Day Trip to ${destination}\n\n`;

  for (let i = 1; i <= days; i++) {
    itinerary += `Day ${i}:\n`;
    const activity = selectedActivities[(i - 1) % selectedActivities.length];
    itinerary += `- Morning: ${activity}\n`;
    itinerary += `- Afternoon: Explore ${destination} attractions\n`;
    itinerary += `- Evening: Local cuisine experience\n\n`;
  }

  return itinerary;
}

module.exports = router;
