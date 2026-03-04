# 📁 WanderWise Project Structure

```
TripPlan/
│
├── 📄 README.md                    # Main documentation
├── 📄 QUICKSTART.md                # Quick setup guide
├── 📄 .env.template                # Environment variables template
├── 📄 .gitignore                   # Git ignore rules
│
├── 📂 backend/                     # Node.js + Express Backend
│   ├── 📂 config/
│   │   └── db.js                   # MongoDB connection setup
│   │
│   ├── 📂 middleware/
│   │   └── auth.js                 # JWT authentication middleware
│   │
│   ├── 📂 models/
│   │   ├── User.js                 # User schema (name, email, password)
│   │   ├── Trip.js                 # Trip schema (destination, budget, etc.)
│   │   └── Expense.js              # Expense schema (category, amount, note)
│   │
│   ├── 📂 routes/
│   │   ├── authRoutes.js           # POST /register, /login
│   │   ├── tripRoutes.js           # CRUD operations for trips
│   │   ├── expenseRoutes.js        # Expense management + analytics
│   │   ├── recommendationRoutes.js # Google Places API integration
│   │   └── routeRoutes.js          # OpenRouteService integration
│   │
│   ├── 📄 .env                     # Environment variables (create from template)
│   ├── 📄 package.json             # Backend dependencies
│   └── 📄 server.js                # Express server entry point
│
└── 📂 frontend/                    # React Frontend
    ├── 📂 public/
    │   └── index.html              # HTML template
    │
    ├── 📂 src/
    │   ├── 📂 pages/
    │   │   ├── LandingPage.js      # Hero section, features, testimonials
    │   │   ├── LoginPage.js        # User login form
    │   │   ├── RegisterPage.js     # User registration form
    │   │   ├── DashboardPage.js    # All trips overview
    │   │   ├── CreateTripPage.js   # New trip creation form
    │   │   ├── TripDetailsPage.js  # Trip info, expenses, recommendations
    │   │   └── RouteMapPage.js     # Interactive map with route
    │   │
    │   ├── 📂 components/
    │   │   ├── TripCard.js         # Trip card for dashboard
    │   │   ├── ExpenseChart.js     # Pie chart for expenses
    │   │   ├── HotelCard.js        # Hotel recommendation card
    │   │   └── FoodCard.js         # Restaurant recommendation card
    │   │
    │   ├── 📄 api.js               # Axios API service
    │   ├── 📄 App.js               # React Router setup
    │   ├── 📄 index.js             # React entry point
    │   └── 📄 index.css            # Tailwind CSS + custom styles
    │
    ├── 📄 package.json             # Frontend dependencies
    ├── 📄 tailwind.config.js       # Tailwind configuration
    └── 📄 postcss.config.js        # PostCSS configuration
```

## 🔄 Data Flow

```
User Action → Frontend (React)
    ↓
API Call (Axios)
    ↓
Backend Route (Express)
    ↓
Middleware (JWT Auth)
    ↓
Controller Logic
    ↓
Database (MongoDB) / External API
    ↓
Response to Frontend
    ↓
UI Update (React State)
```

## 🎯 Key Features by File

### Backend

**server.js**
- Express app setup
- CORS configuration
- Route mounting
- MongoDB connection

**authRoutes.js**
- User registration with password hashing
- User login with JWT token generation
- Token validation

**tripRoutes.js**
- Create trip with Unsplash image fetch
- Auto-generate itinerary based on travel type
- CRUD operations for trips

**expenseRoutes.js**
- Add/delete expenses
- Calculate category-wise totals
- Calculate remaining budget

**recommendationRoutes.js**
- Fetch hotels via Google Places API
- Fetch restaurants via Google Places API
- Return formatted data with photos

**routeRoutes.js**
- Geocode locations
- Calculate optimized route
- Return coordinates for map display

### Frontend

**LandingPage.js**
- Hero section with gradient overlay
- Feature cards with icons
- Stats section
- Testimonials
- Smooth scroll animations

**DashboardPage.js**
- Display all user trips
- Trip cards with images
- Create trip button
- Delete trip functionality

**TripDetailsPage.js**
- Trip information display
- Expense tracker with form
- Pie chart visualization
- Hotel recommendations
- Restaurant recommendations
- Download summary button

**RouteMapPage.js**
- Source/destination input
- Route calculation
- Interactive Leaflet map
- Distance and duration display

**ExpenseChart.js**
- Recharts pie chart
- Category-wise breakdown
- Percentage display
- Custom tooltips

## 🎨 Design System

**Colors:**
- Primary: Blue (#3B82F6)
- Secondary: Purple (#8B5CF6)
- Accent: Pink (#EC4899)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Danger: Red (#EF4444)

**Typography:**
- Font: Inter (Google Fonts)
- Headings: Bold, 2xl-5xl
- Body: Regular, sm-base

**Components:**
- Rounded corners: rounded-xl, rounded-2xl
- Shadows: shadow-lg, shadow-2xl
- Transitions: All interactive elements
- Hover effects: Scale, shadow, color

## 🔐 Security Features

- Password hashing with bcryptjs (10 rounds)
- JWT tokens (7-day expiration)
- Protected routes with middleware
- Token stored in localStorage
- CORS enabled for frontend access

## 📊 Database Schema

**Users Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

**Trips Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  destination: String,
  days: Number,
  budget: Number,
  travelDate: Date,
  travelType: String (enum),
  itinerary: String,
  image: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

**Expenses Collection:**
```javascript
{
  _id: ObjectId,
  tripId: ObjectId (ref: Trip),
  category: String (enum),
  amount: Number,
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 API Endpoints

**Auth:**
- POST /api/auth/register
- POST /api/auth/login

**Trips:**
- GET /api/trips (all user trips)
- GET /api/trips/:id (single trip)
- POST /api/trips (create trip)
- PUT /api/trips/:id (update trip)
- DELETE /api/trips/:id (delete trip)

**Expenses:**
- GET /api/expenses/trip/:tripId (all expenses + analytics)
- POST /api/expenses (add expense)
- DELETE /api/expenses/:id (delete expense)

**Recommendations:**
- GET /api/recommendations/hotels/:destination
- GET /api/recommendations/food/:destination

**Routes:**
- POST /api/routes/optimize (calculate route)

## 💡 Development Tips

1. Start backend first, then frontend
2. Test API endpoints with Postman/Thunder Client
3. Check MongoDB data with MongoDB Compass
4. Use React DevTools for debugging
5. Monitor API rate limits
6. Keep API keys secure

---

**This structure ensures clean separation of concerns and scalability!**
