# 🔧 WanderWise Troubleshooting Guide

## Common Issues & Solutions

### 🔴 Backend Issues

#### Issue: "MongoDB Connection Error"
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. Make sure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

2. Check MongoDB status:
   ```bash
   mongod --version
   ```

3. Use MongoDB Atlas (cloud) instead:
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Update MONGO_URI in .env

#### Issue: "JWT_SECRET is not defined"
```
Error: secretOrPrivateKey must have a value
```

**Solution:**
- Check if `.env` file exists in backend folder
- Make sure JWT_SECRET is set in .env
- Restart backend server after changing .env

#### Issue: "Port 5000 already in use"
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Kill process on port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

2. Change port in backend/.env:
   ```env
   PORT=5001
   ```
   Then update frontend/src/api.js:
   ```javascript
   const API_URL = 'http://localhost:5001/api';
   ```

#### Issue: "Module not found"
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd backend
npm install
```

### 🔵 Frontend Issues

#### Issue: "Module not found: Can't resolve 'react-router-dom'"
```
Error: Module not found
```

**Solution:**
```bash
cd frontend
npm install
```

#### Issue: "Failed to fetch" or "Network Error"
```
Error: Network Error
```

**Solutions:**
1. Make sure backend is running on port 5000
2. Check API_URL in frontend/src/api.js
3. Check CORS settings in backend/server.js
4. Verify token in localStorage (open DevTools → Application → Local Storage)

#### Issue: "Tailwind styles not working"
```
Classes not applying
```

**Solutions:**
1. Make sure tailwind.config.js exists
2. Check if index.css has Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Restart development server

#### Issue: "Map not displaying"
```
Leaflet map shows blank
```

**Solutions:**
1. Check if Leaflet CSS is imported in index.html:
   ```html
   <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
   ```
2. Make sure route data has valid coordinates
3. Check browser console for errors

### 🟡 API Issues

#### Issue: "Unsplash API returns 401"
```
Error: Unauthorized
```

**Solutions:**
1. Verify UNSPLASH_ACCESS_KEY in .env
2. Check if key is active on Unsplash dashboard
3. Make sure you're using Access Key, not Secret Key
4. Check API rate limits (50 requests/hour for free tier)

#### Issue: "Google Places API returns 403"
```
Error: This API project is not authorized
```

**Solutions:**
1. Enable Places API in Google Cloud Console
2. Check if API key is correct in .env
3. Verify API key restrictions (if any)
4. Check billing is enabled (required even for free tier)
5. Wait a few minutes after enabling API

#### Issue: "OpenRouteService returns 401"
```
Error: Unauthorized
```

**Solutions:**
1. Verify OPENROUTE_API_KEY in .env
2. Check if key is active on OpenRouteService dashboard
3. Check API rate limits (2000 requests/day for free tier)
4. Make sure you're using the correct API key format

### 🟢 Authentication Issues

#### Issue: "Invalid credentials" on login
```
Error: Invalid credentials
```

**Solutions:**
1. Make sure you registered first
2. Check email and password are correct
3. Verify user exists in MongoDB
4. Check password hashing is working

#### Issue: "Authentication required" on protected routes
```
Error: 401 Unauthorized
```

**Solutions:**
1. Make sure you're logged in
2. Check if token exists in localStorage
3. Verify token is being sent in Authorization header
4. Check if token is expired (7-day expiration)
5. Try logging out and logging in again

### 🟣 Database Issues

#### Issue: "Duplicate key error"
```
Error: E11000 duplicate key error
```

**Solutions:**
1. Email already exists - use different email
2. Clear database and try again:
   ```bash
   # MongoDB Shell
   use wanderwise
   db.users.deleteMany({})
   ```

#### Issue: "Trip not found"
```
Error: 404 Trip not found
```

**Solutions:**
1. Make sure trip belongs to logged-in user
2. Check if trip ID is valid
3. Verify trip exists in database

### 🔶 Development Issues

#### Issue: "React app won't start"
```
Error: Something is already running on port 3000
```

**Solutions:**
1. Kill process on port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill -9
   ```

2. Or use different port:
   ```bash
   PORT=3001 npm start
   ```

#### Issue: "npm install fails"
```
Error: EACCES permission denied
```

**Solutions:**
1. Run with sudo (Mac/Linux):
   ```bash
   sudo npm install
   ```

2. Fix npm permissions:
   ```bash
   npm config set prefix ~/.npm-global
   export PATH=~/.npm-global/bin:$PATH
   ```

3. Delete node_modules and try again:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 🔷 Browser Issues

#### Issue: "CORS error in browser console"
```
Error: Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Make sure CORS is enabled in backend/server.js:
   ```javascript
   app.use(cors());
   ```

2. Or specify origin:
   ```javascript
   app.use(cors({ origin: 'http://localhost:3000' }));
   ```

#### Issue: "localStorage is not defined"
```
Error: ReferenceError: localStorage is not defined
```

**Solutions:**
1. Make sure you're running in browser (not server-side)
2. Check if browser supports localStorage
3. Check if cookies/storage is enabled in browser

### 🔸 Performance Issues

#### Issue: "App is slow"

**Solutions:**
1. Check network tab in DevTools for slow API calls
2. Optimize images (compress before upload)
3. Reduce API calls (implement caching)
4. Check MongoDB indexes
5. Use production build:
   ```bash
   npm run build
   ```

#### Issue: "Map is laggy"

**Solutions:**
1. Reduce polyline points
2. Use lighter tile layer
3. Implement map lazy loading
4. Check browser performance

## 🛠 Debugging Tips

### Backend Debugging

1. **Check server logs:**
   ```bash
   # Look for error messages in terminal
   ```

2. **Test API with Postman/Thunder Client:**
   ```
   POST http://localhost:5000/api/auth/login
   Body: { "email": "test@test.com", "password": "123456" }
   ```

3. **Check MongoDB data:**
   ```bash
   # MongoDB Shell
   use wanderwise
   db.users.find()
   db.trips.find()
   db.expenses.find()
   ```

4. **Add console.logs:**
   ```javascript
   console.log('Request body:', req.body);
   console.log('User ID:', req.userId);
   ```

### Frontend Debugging

1. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors in Console tab

2. **Check network requests:**
   - Open DevTools → Network tab
   - Look for failed requests (red)
   - Check request/response data

3. **Check React state:**
   - Install React DevTools extension
   - Inspect component state and props

4. **Check localStorage:**
   - DevTools → Application → Local Storage
   - Verify token exists

5. **Add console.logs:**
   ```javascript
   console.log('State:', state);
   console.log('API response:', response.data);
   ```

## 📞 Getting Help

If you're still stuck:

1. **Check error message carefully** - It usually tells you what's wrong
2. **Google the error** - Someone probably had the same issue
3. **Check API documentation** - Unsplash, Google Places, OpenRouteService
4. **Review code** - Compare with working examples
5. **Start fresh** - Sometimes it's easier to start over

## ✅ Verification Checklist

Before asking for help, verify:

- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 3000)
- [ ] .env file exists with all keys
- [ ] npm install completed successfully
- [ ] No errors in terminal
- [ ] No errors in browser console
- [ ] API keys are valid
- [ ] Network requests are successful

## 🔍 Quick Diagnostics

Run these commands to check your setup:

```bash
# Check Node version (should be 14+)
node --version

# Check npm version
npm --version

# Check MongoDB version
mongod --version

# Check if backend dependencies are installed
cd backend && npm list

# Check if frontend dependencies are installed
cd frontend && npm list

# Test backend API
curl http://localhost:5000/api/health

# Check if ports are available
netstat -an | findstr "5000 3000"
```

---

**Most issues can be solved by:**
1. Restarting servers
2. Checking .env file
3. Running npm install
4. Clearing browser cache
5. Reading error messages carefully

**Happy debugging! 🐛**
