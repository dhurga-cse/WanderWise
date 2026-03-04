import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, MapPin, DollarSign, Navigation } from 'lucide-react';

const HotelCard = ({ hotel, tripDestination, tripCoords }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const getPriceLevel = (level) => {
    return '$'.repeat(level || 2);
  };

  const handleViewRoute = () => {
    // Navigate to route map with coordinates if available
    const params = new URLSearchParams({
      source: tripDestination,
      destination: hotel.name + ', ' + hotel.address
    });
    
    if (tripCoords) {
      params.append('sourceLat', tripCoords.lat);
      params.append('sourceLng', tripCoords.lng);
    }
    if (hotel.coords) {
      params.append('destLat', hotel.coords.lat);
      params.append('destLng', hotel.coords.lng);
    }
    
    navigate(`/route-map/${id}?${params.toString()}`);
  };

  return (
    <div className="min-w-[300px] bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">
      <div className="h-48 overflow-hidden">
        {hotel.photo ? (
          <img src={hotel.photo} alt={hotel.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl">
            🏨
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 truncate">{hotel.name}</h3>
        
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold text-gray-700">{hotel.rating || 'N/A'}</span>
        </div>

        <div className="flex items-center gap-2 mb-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm">{getPriceLevel(hotel.priceLevel)}</span>
        </div>

        <div className="flex items-start gap-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-xs line-clamp-2">{hotel.address}</span>
        </div>

        <button
          onClick={handleViewRoute}
          className="w-full py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          View Route
        </button>
      </div>
    </div>
  );
};

export default HotelCard;
