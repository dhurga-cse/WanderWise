import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, DollarSign, Plus, Trash2, MapPin, Hotel, Utensils, Download } from 'lucide-react';
import { getTrip, getExpenses, addExpense, deleteExpense } from '../api';
import ExpenseChart from '../components/ExpenseChart';

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [totalExpense, setTotalExpense] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: 'Food',
    amount: '',
    note: ''
  });

  useEffect(() => {
    fetchTripData();
  }, [id]);

  const fetchTripData = async () => {
    try {
      const [tripRes, expenseRes] = await Promise.all([
        getTrip(id),
        getExpenses(id)
      ]);
      
      setTrip(tripRes.data);
      setExpenses(expenseRes.data.expenses);
      setCategoryTotals(expenseRes.data.categoryTotals);
      setTotalExpense(expenseRes.data.totalExpense);
      setRemainingBudget(expenseRes.data.remainingBudget);
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await addExpense({ ...expenseForm, tripId: id });
      setExpenseForm({ category: 'Food', amount: '', note: '' });
      setShowExpenseForm(false);
      fetchTripData();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await deleteExpense(expenseId);
        fetchTripData();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const downloadSummary = () => {
    const summary = `
TRIP SUMMARY - ${trip.destination}
${'='.repeat(50)}

Destination: ${trip.destination}
Duration: ${trip.days} days
Travel Date: ${new Date(trip.travelDate).toLocaleDateString()}
Travel Type: ${trip.travelType}
Budget: $${trip.budget}

EXPENSES
${'-'.repeat(50)}
Total Spent: $${totalExpense}
Remaining Budget: $${remainingBudget}

Category Breakdown:
${Object.entries(categoryTotals).map(([cat, amt]) => `${cat}: $${amt}`).join('\n')}

ITINERARY
${'-'.repeat(50)}
${trip.itinerary}
    `;

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.destination}-trip-summary.txt`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  const isOverBudget = remainingBudget < 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80"></div>
        {trip.image && (
          <img src={trip.image} alt={trip.destination} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2">{trip.destination}</h1>
            <p className="text-xl">{trip.days} Days • {trip.travelType} Trip</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Trip Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-700">Travel Date</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">{new Date(trip.travelDate).toLocaleDateString()}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-700">Budget</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">${trip.budget}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`bg-white rounded-2xl p-6 shadow-lg ${isOverBudget ? 'border-2 border-red-500' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className={`w-6 h-6 ${isOverBudget ? 'text-red-600' : 'text-purple-600'}`} />
              <h3 className="font-semibold text-gray-700">Remaining</h3>
            </div>
            <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
              ${remainingBudget}
            </p>
            {isOverBudget && <p className="text-sm text-red-600 mt-1">⚠️ Over budget!</p>}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Expense Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Expense Breakdown</h2>
              <ExpenseChart data={categoryTotals} />
            </motion.div>

            {/* Itinerary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Itinerary</h2>
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">{trip.itinerary}</pre>
            </motion.div>

            {/* Route Map Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <button
                onClick={() => navigate(`/route-map/${id}`)}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                View Route Map
              </button>
            </motion.div>

            {/* Recommendation Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate(`/recommendations/${id}?type=hotels`)}
                className="py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Hotel className="w-5 h-5" />
                View Hotels
              </button>
              <button
                onClick={() => navigate(`/recommendations/${id}?type=restaurants`)}
                className="py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Utensils className="w-5 h-5" />
                View Restaurants
              </button>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Add Expense */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Expenses</h2>
                <button
                  onClick={() => setShowExpenseForm(!showExpenseForm)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {showExpenseForm && (
                <form onSubmit={handleAddExpense} className="mb-6 space-y-4">
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Food">Food</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="Amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    value={expenseForm.note}
                    onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })}
                    placeholder="Note (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Add Expense
                  </button>
                </form>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {expenses.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No expenses yet</p>
                ) : (
                  expenses.map((expense) => (
                    <div key={expense._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{expense.category}</p>
                        <p className="text-sm text-gray-600">{expense.note}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-gray-800">${expense.amount}</p>
                        <button
                          onClick={() => handleDeleteExpense(expense._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Download Summary */}
            <button
              onClick={downloadSummary}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;
