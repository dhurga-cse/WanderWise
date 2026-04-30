# 🔄 MongoDB to PostgreSQL Migration Guide

## ✅ What Changed

### Database Layer
- **Removed:** MongoDB + Mongoose
- **Added:** PostgreSQL + Sequelize

### Files Updated
1. `package.json` - Replaced mongoose with sequelize, pg, pg-hstore
2. `config/db.js` - PostgreSQL connection with Sequelize
3. `models/User.js` - Sequelize User model
4. `models/Trip.js` - Sequelize Trip model
5. `models/Expense.js` - Sequelize Expense model
6. `routes/authRoutes.js` - Updated to Sequelize syntax
7. `routes/tripRoutes.js` - Updated to Sequelize syntax
8. `routes/expenseRoutes.js` - Updated to Sequelize syntax
9. `server.js` - Updated to use Sequelize connectDB
10. `.env` - Replaced MONGO_URI with PG_URI

### What Stayed the Same
- ✅ All API endpoints (same paths)
- ✅ Request/response formats
- ✅ Frontend code (no changes needed)
- ✅ Authentication logic
- ✅ Business logic

---

## 📦 Installation Steps

### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember your postgres password

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE wanderwise;

# Exit
\q
```

### 3. Update .env File

Edit `backend/.env`:
```env
PG_URI=postgres://postgres:YOUR_PASSWORD@localhost:5432/wanderwise
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### 4. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `sequelize` - ORM for PostgreSQL
- `pg` - PostgreSQL client
- `pg-hstore` - Serialization for Sequelize

### 5. Start Server

```bash
npm start
```

You should see:
```
✅ PostgreSQL Connected Successfully
✅ Database tables synced
🚀 Server running on port 5000
```

---

## 🔄 Key Differences

### MongoDB → PostgreSQL Syntax

| Operation | MongoDB (Mongoose) | PostgreSQL (Sequelize) |
|-----------|-------------------|------------------------|
| Find One | `User.findOne({ email })` | `User.findOne({ where: { email } })` |
| Find All | `Trip.find({ userId })` | `Trip.findAll({ where: { userId } })` |
| Create | `new User().save()` | `User.create()` |
| Update | `findOneAndUpdate()` | `trip.update()` |
| Delete | `findOneAndDelete()` | `trip.destroy()` |
| Sort | `.sort({ createdAt: -1 })` | `order: [['createdAt', 'DESC']]` |

### ID Field Changes

- MongoDB: `_id` (ObjectId)
- PostgreSQL: `id` (Integer, auto-increment)

**Frontend automatically works** because we return `id` in responses!

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE "Users" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

### Trips Table
```sql
CREATE TABLE "Trips" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  destination VARCHAR(255) NOT NULL,
  days INTEGER NOT NULL,
  budget FLOAT NOT NULL,
  "travelDate" DATE NOT NULL,
  "travelType" VARCHAR(50),
  itinerary TEXT,
  image TEXT,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

### Expenses Table
```sql
CREATE TABLE "Expenses" (
  id SERIAL PRIMARY KEY,
  "tripId" INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  amount FLOAT NOT NULL,
  note VARCHAR(255),
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

---

## ✅ Testing

1. **Start backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test features:**
   - Register new user
   - Login
   - Create trip
   - Add expenses
   - View charts
   - Everything should work exactly the same!

---

## 🔍 Verify Database

```bash
# Login to PostgreSQL
psql -U postgres -d wanderwise

# List tables
\dt

# View users
SELECT * FROM "Users";

# View trips
SELECT * FROM "Trips";

# View expenses
SELECT * FROM "Expenses";

# Exit
\q
```

---

## 🚀 Production Deployment

### Using Heroku Postgres:
```env
PG_URI=postgres://user:pass@host:5432/dbname
PG_SSL=true
```

### Using Railway:
```env
PG_URI=postgresql://postgres:pass@containers-us-west-123.railway.app:5432/railway
PG_SSL=true
```

---

## 🐛 Troubleshooting

**Error: "password authentication failed"**
- Check your PostgreSQL password in PG_URI

**Error: "database does not exist"**
- Create database: `CREATE DATABASE wanderwise;`

**Error: "relation does not exist"**
- Tables auto-create on first run
- Restart server if needed

**Error: "port 5432 already in use"**
- PostgreSQL is already running (this is good!)

---

## 📊 Benefits of PostgreSQL

✅ **ACID Compliance** - Better data integrity
✅ **Relational Data** - Proper foreign keys
✅ **Better Performance** - For complex queries
✅ **SQL Support** - Standard query language
✅ **Mature Ecosystem** - More tools and support

---

## 🎉 Migration Complete!

Your WanderWise app now uses PostgreSQL instead of MongoDB!

**Frontend works without any changes** - all API endpoints remain the same! ✨
