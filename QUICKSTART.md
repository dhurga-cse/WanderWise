# 🚀 Quick Start Guide - WanderWise

## Step-by-Step Setup (5 minutes)

### 1️⃣ Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2️⃣ Setup MongoDB

**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update MONGO_URI in backend/.env

### 3️⃣ Get API Keys (Free)

**Unsplash (Travel Images):**
- Visit: https://unsplash.com/developers
- Register app → Copy Access Key

**Google Places (Hotels/Restaurants):**
- Visit: https://console.cloud.google.com/
- Create project → Enable Places API → Create API Key

**OpenRouteService (Maps/Routes):**
- Visit: https://openrouteservice.org/
- Sign up → Generate API Key

### 4️⃣ Configure Backend

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/wanderwise
JWT_SECRET=mysecretkey123
UNSPLASH_ACCESS_KEY=paste_your_key_here
GOOGLE_PLACES_API_KEY=paste_your_key_here
OPENROUTE_API_KEY=paste_your_key_here
```

### 5️⃣ Start Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend running on http://localhost:3000

### 6️⃣ Test the Application

1. Open browser: http://localhost:3000
2. Click "Get Started"
3. Register new account
4. Create your first trip!

## 🎯 Features to Test

✅ Register & Login
✅ Create Trip (auto-fetches destination image)
✅ Add Expenses (see pie chart update)
✅ View Hotel Recommendations
✅ View Restaurant Recommendations
✅ Calculate Optimized Route
✅ Download Trip Summary

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check MONGO_URI in .env

**API Key Errors:**
- Verify all API keys are correct
- Check API quotas/limits

**Port Already in Use:**
- Change PORT in backend/.env
- Update API_URL in frontend/src/api.js

**Module Not Found:**
- Run `npm install` in both directories

## 📱 Test Credentials

After registration, you can create test trips:
- Destination: Paris, Tokyo, New York, London
- Budget: $2000-5000
- Days: 3-7 days

## 🎨 UI Preview

**Landing Page:** Beautiful hero section with gradient overlay
**Dashboard:** Card-based trip layout
**Trip Details:** Comprehensive view with charts and recommendations
**Route Map:** Interactive Leaflet map with polyline routes

## 💡 Tips

- Use real city names for better API results
- Add expenses to see budget tracking in action
- Try route optimization between major cities
- Download trip summary to see formatted output

## 🆘 Need Help?

Check the main README.md for detailed documentation!

---

**Enjoy planning your trips with WanderWise! ✈️🌍**
