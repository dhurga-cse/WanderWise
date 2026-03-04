const express = require('express');
const axios = require('axios');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Mock data for hotels
const mockHotels = {
  'New York': [
    { name: 'The Plaza Hotel', address: '768 5th Ave, New York, NY 10019', rating: 4.5, priceLevel: 4, photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', placeId: 'mock1', coords: { lat: 40.7648, lng: -73.9754 } },
    { name: 'The Standard High Line', address: '848 Washington St, New York, NY 10014', rating: 4.3, priceLevel: 3, photo: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400', placeId: 'mock2', coords: { lat: 40.7407, lng: -74.0086 } },
    { name: 'Pod Times Square', address: '400 W 42nd St, New York, NY 10036', rating: 4.0, priceLevel: 2, photo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400', placeId: 'mock3', coords: { lat: 40.7580, lng: -73.9911 } },
    { name: 'The Bowery Hotel', address: '335 Bowery, New York, NY 10003', rating: 4.4, priceLevel: 3, photo: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', placeId: 'mock4', coords: { lat: 40.7255, lng: -73.9931 } },
  ],
  'default': [
    { name: 'Grand Hotel', address: 'City Center', rating: 4.2, priceLevel: 3, photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', placeId: 'mock1', coords: { lat: 40.7128, lng: -74.0060 } },
    { name: 'Comfort Inn', address: 'Downtown Area', rating: 4.0, priceLevel: 2, photo: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400', placeId: 'mock2', coords: { lat: 40.7200, lng: -74.0100 } },
    { name: 'Luxury Suites', address: 'Business District', rating: 4.5, priceLevel: 4, photo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400', placeId: 'mock3', coords: { lat: 40.7300, lng: -74.0200 } },
  ]
};

// Mock data for restaurants
const mockRestaurants = {
  'New York': [
    { name: 'Katz\'s Delicatessen', address: '205 E Houston St, New York, NY 10002', rating: 4.6, cuisineType: 'Deli, American', photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', placeId: 'mock1', coords: { lat: 40.7223, lng: -73.9873 } },
    { name: 'Joe\'s Pizza', address: '7 Carmine St, New York, NY 10014', rating: 4.5, cuisineType: 'Pizza, Italian', photo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', placeId: 'mock2', coords: { lat: 40.7304, lng: -74.0027 } },
    { name: 'Shake Shack', address: 'Madison Square Park, New York, NY', rating: 4.4, cuisineType: 'Burgers, Fast Food', photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', placeId: 'mock3', coords: { lat: 40.7414, lng: -73.9882 } },
    { name: 'Le Bernardin', address: '155 W 51st St, New York, NY 10019', rating: 4.8, cuisineType: 'French, Seafood', photo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', placeId: 'mock4', coords: { lat: 40.7614, lng: -73.9776 } },
  ],
  'default': [
    { name: 'Local Restaurant', address: 'Main Street', rating: 4.3, cuisineType: 'International', photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', placeId: 'mock1', coords: { lat: 40.7128, lng: -74.0060 } },
    { name: 'Pizza Place', address: 'Downtown', rating: 4.2, cuisineType: 'Italian, Pizza', photo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', placeId: 'mock2', coords: { lat: 40.7200, lng: -74.0100 } },
    { name: 'Burger Joint', address: 'City Center', rating: 4.1, cuisineType: 'American, Burgers', photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', placeId: 'mock3', coords: { lat: 40.7300, lng: -74.0200 } },
  ]
};

// Get hotel recommendations
router.get('/hotels/:destination', authMiddleware, async (req, res) => {
  try {
    const { destination } = req.params;
    
    // Try Google Places API first
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: `hotels in ${destination}`,
          key: process.env.GOOGLE_PLACES_API_KEY
        },
        timeout: 5000
      });

      if (response.data.status === 'OK') {
        const hotels = response.data.results.slice(0, 6).map(place => ({
          name: place.name,
          address: place.formatted_address,
          rating: place.rating || 0,
          priceLevel: place.price_level || 2,
          photo: place.photos ? 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}` 
            : '',
          placeId: place.place_id
        }));
        return res.json(hotels);
      }
    } catch (apiError) {
      console.log('Google Places unavailable, using mock data');
    }

    // Fallback to mock data
    const hotels = mockHotels[destination] || mockHotels['default'];
    res.json(hotels);
  } catch (error) {
    console.error('Hotels error:', error.message);
    res.json(mockHotels['default']);
  }
});

// Get food recommendations
router.get('/food/:destination', authMiddleware, async (req, res) => {
  try {
    const { destination } = req.params;
    
    // Try Google Places API first
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: `restaurants in ${destination}`,
          key: process.env.GOOGLE_PLACES_API_KEY
        },
        timeout: 5000
      });

      if (response.data.status === 'OK') {
        const restaurants = response.data.results.slice(0, 6).map(place => ({
          name: place.name,
          address: place.formatted_address,
          rating: place.rating || 0,
          cuisineType: place.types ? place.types.join(', ') : 'Restaurant',
          photo: place.photos ? 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}` 
            : '',
          placeId: place.place_id
        }));
        return res.json(restaurants);
      }
    } catch (apiError) {
      console.log('Google Places unavailable, using mock data');
    }

    // Fallback to mock data
    const restaurants = mockRestaurants[destination] || mockRestaurants['default'];
    res.json(restaurants);
  } catch (error) {
    console.error('Restaurants error:', error.message);
    res.json(mockRestaurants['default']);
  }
});

module.exports = router;
