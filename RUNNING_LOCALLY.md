# 🧙 Diagonalley Shop - Local Development Setup

## Quick Start Guide for Running Frontend & Backend on Local Network

### Prerequisites
- Node.js (v16+) installed
- npm installed
- MongoDB connection working (already configured in server/.env)

---

## Option 1: Using Command (RECOMMENDED)

### Start Both Servers (Frontend + Backend)

Open Command Prompt in the project root and run:

```bash
npm run dev:all
```

**What this does:**
- Starts backend server on: **http://127.0.0.1:5001**
- Starts frontend on: **http://localhost:8080** or **http://127.0.0.1:8080**
- Frontend proxy `/api` requests to backend on port 5001

---

## Option 2: Using Batch File

Double-click `start-dev.bat` in the project root directory.

---

## Server Ports

| Service | Port | URL | Notes |
|---------|------|-----|-------|
| **Backend (Express)** | 5001 | http://127.0.0.1:5001 | Node.js/Express server |
| **Frontend (Vite)** | 8080 | http://localhost:8080 | React dev server |

---

## Individual Server Commands

If you need to run servers separately:

### Start Backend Only
```bash
npm run dev:server
```
- Runs server on port **5001**

### Start Frontend Only
```bash
npm run dev:client
```
- Runs frontend on port **8080**

---

## Accessing the Application

### Local Development
1. Open browser: **http://localhost:8080**
2. API calls are proxied through Vite to backend on 5001

### Access from Another Computer on Network

To access from another device (phone, tablet, or another PC):

1. Get your machine's local IP (run in Command Prompt):
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (usually 192.168.x.x or 10.x.x.x)

2. Use that IP with port 8080:
   ```
   http://192.168.x.x:8080
   ```

3. API calls will work because:
   - Backend CORS allows 192.168.x.x origins
   - Frontend proxy redirects /api calls to 127.0.0.1:5001 (localhost)

---

## Testing the Forgot Password Feature

1. Click "Forgot your spell?" on login page
2. Enter your registered email address (e.g., test user email)
3. Click "Send OTP via Owl Post"
4. **OTP will display on the screen** (for dev/testing)
5. Enter the 6-digit OTP
6. Set a new password
7. Try logging in with new password

---

## Environment Configuration

### Backend (.env in /server directory)
- `MONGO_URI` - MongoDB Atlas connection
- `JWT_SECRET` - JWT token signing key
- `PORT` - Server port (default: 5001)
- `CLIENT_URL` - Frontend URL for CORS

### Frontend Configuration
- Vite config proxies `/api` to backend
- Configured in `vite.config.ts`

---

## Troubleshooting

### Port Already in Use
If you get "Port 5001 already in use" error:

**Find what's using the port:**
```bash
netstat -ano | findstr :5001
```

**Kill the process:**
```bash
taskkill /PID <process_id> /F
```

### MongoDB Connection Issues
- Check MONGO_URI in server/.env
- Ensure you have internet (MongoDB Atlas requires IP whitelist)
- Server logs will show connection status

### Frontend Not Loading
- Clear browser cache (Ctrl + Shift + Delete)
- Check that backend is running on 5001
- Check browser console for errors (F12)

### CORS Errors
- Backend allows localhost, 127.0.0.1, and 192.168.x.x origins
- Check server logs for blocked origins

---

## Server Logs

Both servers output logs to the console:

**Backend logs:**
- Shows database connection status
- Shows OTP generation (debug mode)
- Shows CORS blocked origins

**Frontend logs (Vite):**
- Shows HMR (Hot Module Reload) status
- Shows compilation errors/warnings
- Available at http://localhost:8080/__vite_ping

---

## API Endpoints

### Authentication (No Auth Required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/send-otp` - Send OTP (EMAIL-BASED)
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/reset-password` - Reset password with OTP

### User Profile (Requires Auth Token)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/avatar` - Update avatar
- `PUT /api/user/update` - Update username
- `POST /api/user/sort` - Trigger Sorting Hat ceremony

---

## OTP Testing

**Important:** The OTP feature is in **dev mode**:
- OTP is displayed on screen in the popup
- Also logged to server console
- No real email is sent
- Expires in 5 minutes
- Rate limited to 3 OTP requests per 15 minutes per email

To integrate real email sending in production:
1. Set up email service (Resend, SendGrid, etc.)
2. Remove the `otp` field from response in `server/controllers/otpController.js`
3. Send actual email instead of displaying on screen

---

## Build for Production

```bash
npm run build
```

Creates optimized production build in `/dist` directory.

---

## Next Steps

1. ✅ Start servers with: `npm run dev:all`
2. ✅ Open: http://localhost:8080
3. ✅ Test login and new forgot password feature
4. ✅ Try accessing from another device using your machine's IP

Enjoy! 🧙‍♂️🪄
