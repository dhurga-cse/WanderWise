import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { ArrowLeft, Navigation } from 'lucide-react';
import { getOptimizedRoute } from '../api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteMapPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [source, setSource] = useState(searchParams.get('source') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-calculate route if URL has parameters
  useEffect(() => {
    if (searchParams.get('source') && searchParams.get('destination')) {
      handleGetRoute();
    }
  }, []);

  const handleGetRoute = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get coordinates from URL if available
      const sourceLat = searchParams.get('sourceLat');
      const sourceLng = searchParams.get('sourceLng');
      const destLat = searchParams.get('destLat');
      const destLng = searchParams.get('destLng');

      const requestData = { source, destination };
      
      if (sourceLat && sourceLng) {
        requestData.sourceCoords = { lat: parseFloat(sourceLat), lng: parseFloat(sourceLng) };
      }
      if (destLat && destLng) {
        requestData.destCoords = { lat: parseFloat(destLat), lng: parseFloat(destLng) };
      }

      const response = await getOptimizedRoute(requestData);
      setRouteData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(`/trip/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Trip
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Navigation className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Route Optimization</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleGetRoute} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                required
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Source (e.g., New York)"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination (e.g., Boston)"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Calculating Route...' : 'Get Optimized Route'}
            </button>
          </form>

          {routeData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Distance</p>
                  <p className="text-2xl font-bold text-blue-600">{routeData.distance} km</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="text-2xl font-bold text-purple-600">{routeData.duration} min</p>
                </div>
              </div>

              <div className="h-96 rounded-2xl overflow-hidden shadow-lg">
                <MapContainer
                  center={routeData.coordinates[0]}
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Polyline positions={routeData.coordinates} color="blue" weight={4} />
                  <Marker position={[routeData.source.coords.lat, routeData.source.coords.lng]}>
                    <Popup>{routeData.source.name}</Popup>
                  </Marker>
                  <Marker position={[routeData.destination.coords.lat, routeData.destination.coords.lng]}>
                    <Popup>{routeData.destination.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RouteMapPage;
