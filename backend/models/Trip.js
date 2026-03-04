const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  days: {
    type: Number,
    required: true,
    min: 1
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  travelDate: {
    type: Date,
    required: true
  },
  travelType: {
    type: String,
    enum: ['Solo', 'Family', 'Friends', 'Couple', 'Business'],
    default: 'Solo'
  },
  itinerary: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);
