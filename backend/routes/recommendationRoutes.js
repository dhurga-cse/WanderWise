const express = require('express');
const axios = require('axios');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const hotelPhotos = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400',
];

const foodPhotos = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
];

// Search real places using Nominatim
async function searchPlaces(destination, type) {
  const query = type === 'hotel'
    ? `hotel in ${destination}`
    : `restaurant in ${destination}`;

  const response = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: query,
      format: 'json',
      limit: 10,
      addressdetails: 1,
      extratags: 1
    },
    headers: { 'User-Agent': 'WanderWise-TravelApp/1.0' },
    timeout: 10000
  });

  return response.data || [];
}

// Get hotel recommendations
router.get('/hotels/:destination', authMiddleware, async (req, res) => {
  try {
    const destination = decodeURIComponent(req.params.destination);

    const places = await searchPlaces(destination, 'hotel');

    const hotels = places
      .filter(p => p.name && p.name.trim() !== '')
      .slice(0, 6)
      .map((p, idx) => ({
        name: p.name,
        address: [
          p.address.road,
          p.address.suburb || p.address.county,
          p.address.city || p.address.state_district,
          p.address.postcode
        ].filter(Boolean).join(', '),
        rating: parseFloat((3.5 + (idx % 5) * 0.3).toFixed(1)),
        priceLevel: (idx % 3) + 2,
        photo: hotelPhotos[idx % hotelPhotos.length],
        coords: { lat: parseFloat(p.lat), lng: parseFloat(p.lon) },
        placeId: `nom_${p.place_id}`
      }));

    res.json(hotels);
  } catch (error) {
    console.error('Hotels error:', error.message);
    res.status(500).json({ message: 'Error fetching hotels: ' + error.message });
  }
});

// Get restaurant recommendations
router.get('/food/:destination', authMiddleware, async (req, res) => {
  try {
    const destination = decodeURIComponent(req.params.destination);

    const places = await searchPlaces(destination, 'restaurant');

    const restaurants = places
      .filter(p => p.name && p.name.trim() !== '')
      .slice(0, 6)
      .map((p, idx) => ({
        name: p.name,
        address: [
          p.address.road,
          p.address.suburb || p.address.county,
          p.address.city || p.address.state_district,
          p.address.postcode
        ].filter(Boolean).join(', '),
        rating: parseFloat((3.5 + (idx % 5) * 0.3).toFixed(1)),
        cuisineType: p.extratags && p.extratags.cuisine
          ? p.extratags.cuisine.replace(/_/g, ' ').replace(/;/g, ', ')
          : 'Restaurant',
        photo: foodPhotos[idx % foodPhotos.length],
        coords: { lat: parseFloat(p.lat), lng: parseFloat(p.lon) },
        placeId: `nom_${p.place_id}`
      }));

    res.json(restaurants);
  } catch (error) {
    console.error('Restaurants error:', error.message);
    res.status(500).json({ message: 'Error fetching restaurants: ' + error.message });
  }
});

module.exports = router;
