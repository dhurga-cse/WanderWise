const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  days: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  travelDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  travelType: {
    type: DataTypes.ENUM('Solo', 'Family', 'Friends', 'Couple', 'Business'),
    defaultValue: 'Solo'
  },
  itinerary: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  image: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  timestamps: true
});

module.exports = Trip;
