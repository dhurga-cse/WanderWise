import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { ArrowLeft, Navigation } from 'lucide-react';
import { getOptimizedRoute } from '../api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Auto-fit map to show entire route
const FitBounds = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);
  return null;
};

const RouteMapPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [source, setSource] = useState(searchParams.get('source') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-calculate if URL has source and destination
  useEffect(() => {
    if (searchParams.get('source') && searchParams.get('destination')) {
      calculateRoute(
        searchParams.get('source'),
        searchParams.get('destination'),
        searchParams.get('sourceLat') ? { lat: parseFloat(searchParams.get('sourceLat')), lng: parseFloat(searchParams.get('sourceLng')) } : null,
        searchParams.get('destLat') ? { lat: parseFloat(searchParams.get('destLat')), lng: parseFloat(searchParams.get('destLng')) } : null
      );
    }
  }, []);

  const calculateRoute = async (src, dest, srcCoords, dstCoords) => {
    setError('');
    setLoading(true);
    try {
      const requestData = { source: src, destination: dest };
      if (srcCoords) requestData.sourceCoords = srcCoords;
      if (dstCoords) requestData.destCoords = dstCoords;

      const response = await getOptimizedRoute(requestData);
      setRouteData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate route');
    } finally {
      setLoading(false);
    }
  };

  const handleGetRoute = async (e) => {
    e.preventDefault();
    await calculateRoute(source, destination, null, null);
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
                placeholder="Source (e.g., Chennai)"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination (e.g., Bangalore)"
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

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="ml-4 text-gray-600">Calculating real road route...</p>
            </div>
          )}

          {routeData && !loading && (
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

              {/* Map - height increased for better visibility */}
              <div className="h-[500px] rounded-2xl overflow-hidden shadow-lg">
                <MapContainer
                  center={routeData.coordinates[Math.floor(routeData.coordinates.length / 2)]}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />

                  {/* Auto fit map to show full route */}
                  <FitBounds coordinates={routeData.coordinates} />

                  {/* Real road route polyline */}
                  <Polyline
                    positions={routeData.coordinates}
                    color="#2563EB"
                    weight={5}
                    opacity={0.8}
                  />

                  {/* Source marker */}
                  <Marker position={[routeData.source.coords.lat, routeData.source.coords.lng]}>
                    <Popup>
                      <strong>Start:</strong> {routeData.source.name}
                    </Popup>
                  </Marker>

                  {/* Destination marker */}
                  <Marker position={[routeData.destination.coords.lat, routeData.destination.coords.lng]}>
                    <Popup>
                      <strong>End:</strong> {routeData.destination.name}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              <p className="text-sm text-gray-500 mt-3 text-center">
                🛣️ Real road route via OpenStreetMap • {routeData.coordinates.length} route points
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RouteMapPage;
