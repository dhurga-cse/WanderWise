const express = require('express');
const axios = require('axios');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Calculate distance (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Get optimized route
router.post('/optimize', authMiddleware, async (req, res) => {
  try {
    const { source, destination, sourceCoords: providedSourceCoords, destCoords: providedDestCoords } = req.body;

    // Use provided coordinates if available, otherwise geocode
    let sourceCoords = providedSourceCoords;
    let destCoords = providedDestCoords;

    if (!sourceCoords) {
      sourceCoords = await geocodeNominatim(source);
    }
    if (!destCoords) {
      destCoords = await geocodeNominatim(destination);
    }

    if (!sourceCoords || !destCoords) {
      return res.status(400).json({ message: 'Unable to find locations. Please try again.' });
    }

    // Try to get real route from OSRM (free, no API key needed)
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${sourceCoords.lng},${sourceCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson`;
      
      const routeResponse = await axios.get(osrmUrl, { timeout: 10000 });
      
      if (routeResponse.data.code === 'Ok' && routeResponse.data.routes.length > 0) {
        const route = routeResponse.data.routes[0];
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Swap for Leaflet

        return res.json({
          coordinates,
          distance: (route.distance / 1000).toFixed(2),
          duration: Math.round(route.duration / 60),
          source: { name: source, coords: sourceCoords },
          destination: { name: destination, coords: destCoords }
        });
      }
    } catch (osrmError) {
      console.log('OSRM unavailable, using straight line');
    }

    // Fallback to straight line
    const distance = calculateDistance(sourceCoords.lat, sourceCoords.lng, destCoords.lat, destCoords.lng);
    const duration = Math.round(distance / 60 * 60);

    const coordinates = [
      [sourceCoords.lat, sourceCoords.lng],
      [destCoords.lat, destCoords.lng]
    ];

    res.json({
      coordinates,
      distance: distance.toFixed(2),
      duration,
      source: { name: source, coords: sourceCoords },
      destination: { name: destination, coords: destCoords }
    });
  } catch (error) {
    console.error('Route error:', error.message);
    res.status(500).json({ message: 'Error calculating route. Please try again.' });
  }
});

async function geocodeNominatim(location) {
  try {
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'WanderWise-TravelApp/1.0'
      },
      timeout: 10000
    });

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
}

module.exports = router;
