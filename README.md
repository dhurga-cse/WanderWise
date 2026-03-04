# WanderWise - Smart Travel Planning Application

A production-level MERN stack travel planning web application with modern UI, real-time recommendations, route optimization, and expense tracking.

## 🎯 Features

- **User Authentication** - Secure JWT-based registration and login
- **Trip Management** - Create, view, and manage trips with auto-generated itineraries
- **Expense Tracker** - Track expenses by category with visual pie charts
- **Budget Monitoring** - Real-time budget tracking with over-budget warnings
- **Route Optimization** - Interactive maps with optimized routes using OpenRouteService
- **Hotel Recommendations** - Real hotel suggestions via Google Places API
- **Food Discovery** - Restaurant recommendations with ratings and photos
- **Trip Summary Download** - Export trip details as text file
- **Responsive Design** - Beautiful UI that works on all devices
- **Smooth Animations** - Framer Motion powered transitions

## 🛠 Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Recharts (Pie Charts)
- React Leaflet (Maps)
- Tailwind CSS
- Framer Motion
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs

### APIs
- OpenRouteService (Route Optimization)
- Unsplash API (Travel Images)
- Google Places API (Hotels & Restaurants)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- API Keys:
  - Unsplash Access Key
  - Google Places API Key
  - OpenRouteService API Key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/wanderwise
JWT_SECRET=your_jwt_secret_key_here_change_in_production
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
OPENROUTE_API_KEY=your_openroute_api_key
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start React development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🔑 Getting API Keys

### Unsplash API
1. Go to https://unsplash.com/developers
2. Register your application
3. Copy the Access Key

### Google Places API
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable "Places API"
4. Create credentials (API Key)
5. Copy the API Key

### OpenRouteService API
1. Go to https://openrouteservice.org/
2. Sign up for free account
3. Generate API key
4. Copy the API Key

## 📱 Usage

1. **Landing Page** - Visit homepage and click "Get Started"
2. **Register** - Create a new account
3. **Login** - Sign in with credentials
4. **Dashboard** - View all your trips
5. **Create Trip** - Add destination, budget, dates, and travel type
6. **Trip Details** - View itinerary, add expenses, see recommendations
7. **Route Map** - Enter source and destination for optimized route
8. **Download Summary** - Export trip details

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth hover animations
- Card-based layouts with soft shadows
- Responsive grid system
- Loading skeletons
- Error handling with user-friendly messages
- Over-budget warnings
- Interactive charts and maps

## 📂 Project Structure

```
TripPlan/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Trip.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── routeRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── TripCard.js
    │   │   ├── ExpenseChart.js
    │   │   ├── HotelCard.js
    │   │   └── FoodCard.js
    │   ├── pages/
    │   │   ├── LandingPage.js
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── DashboardPage.js
    │   │   ├── CreateTripPage.js
    │   │   ├── TripDetailsPage.js
    │   │   └── RouteMapPage.js
    │   ├── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Push code to GitHub
2. Connect to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build production version: `npm run build`
2. Deploy build folder
3. Update API URL in `api.js`

## 🔒 Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Protected API routes
- Input validation
- CORS enabled

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 👨‍💻 Author

Built with ❤️ for travelers worldwide

---

**Note**: Remember to keep your API keys secure and never commit them to version control!
