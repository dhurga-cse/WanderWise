import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Hotel, Utensils } from 'lucide-react';
import { getTrip, getHotels, getRestaurants } from '../api';
import HotelCard from '../components/HotelCard';
import FoodCard from '../components/FoodCard';

const RecommendationsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  
  const [trip, setTrip] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id, type]);

  const fetchData = async () => {
    try {
      const tripRes = await getTrip(id);
      setTrip(tripRes.data);

      if (type === 'hotels') {
        const hotelsRes = await getHotels(tripRes.data.destination);
        setRecommendations(hotelsRes.data);
      } else if (type === 'restaurants') {
        const restaurantsRes = await getRestaurants(tripRes.data.destination);
        setRecommendations(restaurantsRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  const isHotels = type === 'hotels';

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
        >
          <div className="flex items-center gap-3 mb-8">
            {isHotels ? (
              <Hotel className="w-10 h-10 text-blue-600" />
            ) : (
              <Utensils className="w-10 h-10 text-orange-600" />
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                {isHotels ? 'Hotel Recommendations' : 'Restaurant Recommendations'}
              </h1>
              <p className="text-gray-600 mt-1">
                Best {isHotels ? 'hotels' : 'restaurants'} in {trip?.destination}
              </p>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">{isHotels ? '🏨' : '🍽️'}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No recommendations found</h3>
              <p className="text-gray-600">Try again later or check another destination</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {isHotels ? (
                    <HotelCard hotel={item} tripDestination={trip?.destination} />
                  ) : (
                    <FoodCard restaurant={item} tripDestination={trip?.destination} />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
