const express = require('express');
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all expenses for a trip
router.get('/trip/:tripId', authMiddleware, async (req, res) => {
  try {
    // Verify trip belongs to user
    const trip = await Trip.findOne({
      where: { id: req.params.tripId, userId: req.userId }
    });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const expenses = await Expense.findAll({
      where: { tripId: req.params.tripId },
      order: [['createdAt', 'DESC']]
    });

    // Calculate category-wise totals
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.json({
      expenses,
      categoryTotals,
      totalExpense,
      remainingBudget: trip.budget - totalExpense
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new expense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tripId, category, amount, note } = req.body;

    // Verify trip belongs to user
    const trip = await Trip.findOne({
      where: { id: tripId, userId: req.userId }
    });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const expense = await Expense.create({ tripId, category, amount, note });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Verify trip belongs to user
    const trip = await Trip.findOne({
      where: { id: expense.tripId, userId: req.userId }
    });
    if (!trip) return res.status(403).json({ message: 'Unauthorized' });

    await expense.destroy();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
