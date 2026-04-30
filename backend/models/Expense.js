const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Food', 'Hotel', 'Travel', 'Shopping', 'Other'),
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  note: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  timestamps: true
});

module.exports = Expense;
