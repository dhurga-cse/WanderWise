import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, MapPin, Trash2 } from 'lucide-react';
import { deleteTrip } from '../api';

const TripCard = ({ trip, index, onUpdate }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete trip to ${trip.destination}?`)) {
      try {
        await deleteTrip(trip._id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/trip/${trip._id}`)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition group"
    >
      <div className="relative h-48 overflow-hidden">
        {trip.image ? (
          <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{trip.destination}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{new Date(trip.travelDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{trip.days} Days • {trip.travelType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Budget: ${trip.budget}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-blue-600 font-semibold hover:text-blue-700 transition">
            View Details →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
