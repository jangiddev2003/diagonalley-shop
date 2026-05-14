# Forgot Password Refactor - Complete Implementation

## 📋 Summary of Changes

### ✅ COMPLETED: Email-Based OTP Password Reset

Changed from mobile number-based to **email-based password reset** with **OTP displayed on screen for testing**.

---

## 📁 Modified Files

### Frontend Changes

#### 1. `src/services/api.ts`
- ✅ Changed `sendOtp(phoneNumber)` → `sendOtp(email)`
- ✅ Changed `verifyOtp(phoneNumber, otp)` → `verifyOtp(email, otp)`
- ✅ Changed `resetPassword(phoneNumber, pwd)` → `resetPassword(email, pwd)`
- ✅ Added `otp?: string` to return type for dev mode display

#### 2. `src/components/OtpPopup.tsx`
- ✅ Changed step type from `'phone'` to `'email'`
- ✅ Replaced "Mobile Number" with "Email Address"
- ✅ Updated form validation from phone to email regex
- ✅ Changed icon from `Phone` to `Mail`
- ✅ Added `displayOtp` state to show OTP on screen
- ✅ Added OTP display box (styled, shows after sending)
- ✅ Updated all API calls to use email instead of phone
- ✅ Updated progress indicators and step navigation

### Backend Changes

#### 3. `server/controllers/otpController.js`
- ✅ Removed `normalizePhone` helper
- ✅ Updated `sendOtp()` to use email from request
- ✅ Updated `verifyOtp()` to use email from request
- ✅ Updated `resetPassword()` to use email from request
- ✅ Changed all database queries to use `email` field
- ✅ Changed error messages (phone → email)
- ✅ Returns OTP in response for dev mode (remove in production)
- ✅ Updated comments and documentation

#### 4. `server/.env` (No changes needed)
- Already configured with MongoDB and JWT
- PORT=5001 for backend
- CLIENT_URL=http://localhost:8080 for CORS

---

## 🚀 How to Run Locally

### Option 1: Start Both Servers (Recommended)
```bash
cd c:\git_projects\diagonalley-shop
npm run dev:all
```

### Option 2: Double-click Batch File
```
start-dev.bat
```

### Option 3: Run Separately
```bash
npm run dev:server   # Terminal 1 - Backend on port 5001
npm run dev:client   # Terminal 2 - Frontend on port 8080
```

---

## 🌐 Access URLs

| Service | URL | Host |
|---------|-----|------|
| Frontend | http://localhost:8080 | Vite Dev Server |
| Backend | http://127.0.0.1:5001 | Express Server |
| API Proxy | /api (through frontend) | Vite Proxy |

---

## 🔒 Test the Forgot Password Feature

### Step-by-Step Testing

1. **Open Application**
   - Browser: http://localhost:8080

2. **Navigate to Forgot Password**
   - Click "Forgot your spell?" on login page

3. **Enter Email**
   - Enter your registered email (or any email from your test user)
   - Example: user@hogwarts.edu

4. **Send OTP**
   - Click "Send OTP via Owl Post"
   - **OTP will display on screen** in a box (dev/testing feature)
   - OTP also logged to server console

5. **Enter OTP**
   - Copy OTP from the display box
   - Enter 6-digit code in the input fields

6. **Set New Password**
   - Enter new password (min 6 characters)
   - Confirm password
   - Click "Reset My Spell"

7. **Login with New Password**
   - Return to login page
   - Use same email + new password

---

## 📱 Test from Another Device on Network

### Get Your Local IP
```bash
ipconfig
```
Look for "IPv4 Address" (usually 192.168.x.x or 10.x.x.x)

### Open from Other Device
```
http://YOUR_LOCAL_IP:8080
```

Example: `http://192.168.1.100:8080`

### Why This Works
- ✅ Backend CORS allows 192.168.x.x origins
- ✅ Frontend proxies /api to backend via Vite
- ✅ All API calls work across network

---

## 🔧 API Endpoints (Email-Based)

### Password Reset Flow

1. **Send OTP**
```
POST /api/auth/send-otp
{
  "email": "user@hogwarts.edu"
}

Response (Dev Mode):
{
  "success": true,
  "message": "An OTP has been sent to your email...",
  "otp": "123456"  // Only in dev mode
}
```

2. **Verify OTP**
```
POST /api/auth/verify-otp
{
  "email": "user@hogwarts.edu",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "OTP verified! You may now reset your password."
}
```

3. **Reset Password**
```
POST /api/auth/reset-password
{
  "email": "user@hogwarts.edu",
  "newPassword": "newPassword123"
}

Response:
{
  "success": true,
  "message": "Password reset successful! You can now log in."
}
```

---

## 🛡️ Security Features

✅ **OTP Hashing** - OTP hashed with bcrypt before storage
✅ **5-minute Expiry** - OTP expires after 5 minutes
✅ **Rate Limiting** - Max 3 OTP requests per 15 minutes per email
✅ **Email Verification** - Valid email required for reset
✅ **Password Hashing** - New password hashed before storage

---

## 📝 Important Notes

### Development Mode
- OTP is **displayed on screen** for easy testing
- OTP is **logged to server console** for debugging
- No real email is sent

### Production Deployment
To enable real email sending:

1. Remove `otp` field from response in `server/controllers/otpController.js`
2. Integrate email service (Resend, SendGrid, etc.)
3. Send actual email with OTP code
4. Set `NODE_ENV=production` in Render environment

### Environment Variables
```bash
# server/.env (local dev)
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<your_jwt_secret>
PORT=5001
CLIENT_URL=http://localhost:8080
```

---

## 📊 Project Structure

```
diagonalley-shop/
├── src/
│   ├── components/
│   │   └── OtpPopup.tsx          ✅ Email-based OTP popup
│   ├── pages/
│   │   └── LoginPage.tsx         Uses OtpPopup
│   └── services/
│       └── api.ts                ✅ Email API functions
├── server/
│   ├── controllers/
│   │   ├── otpController.js      ✅ Email OTP logic
│   │   └── authController.js     Uses OTP controller
│   ├── routes/
│   │   └── authRoutes.js         Routes to OTP endpoints
│   ├── models/
│   │   └── User.js               Email field + OTP fields
│   └── server.js                 Express server
├── server/.env                   ✅ Configuration
├── package.json                  npm scripts
├── vite.config.ts                Frontend + API proxy
└── start-dev.bat                 ✅ Quick start batch file
```

---

## ✅ Checklist

- ✅ Refactored from phone to email
- ✅ OTP displays on screen (dev mode)
- ✅ Email validation working
- ✅ Backend API updated
- ✅ Frontend UI updated
- ✅ All API calls use email parameter
- ✅ Rate limiting implemented
- ✅ OTP hashing implemented
- ✅ Error messages updated
- ✅ Documentation created
- ✅ Quick start batch file created
- ✅ Servers can run on local network

---

## 🎯 Next Steps

1. **Run Locally**
   ```bash
   npm run dev:all
   ```

2. **Test on Same Machine**
   - http://localhost:8080

3. **Test on Network**
   - Get IP: `ipconfig`
   - Open: http://192.168.x.x:8080

4. **Test Forgot Password Flow**
   - Complete steps 1-7 above

5. **Verify Both Servers Running**
   - Backend: http://127.0.0.1:5001 (shows "Alohomora — Diagonalley Shop API is running!")
   - Frontend: http://localhost:8080 (shows app)

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5001 in use | `taskkill /PID <pid> /F` |
| Can't connect from other device | Check firewall, use correct local IP |
| MongoDB error | Check MONGO_URI, ensure internet |
| Blank page | Check browser console (F12), clear cache |
| API errors | Check server console for detailed logs |
| CORS error | Verify origin in backend CORS config |

---

## 📞 Testing Checklist

- [ ] Backend running on port 5001
- [ ] Frontend running on port 8080
- [ ] Login page loads
- [ ] "Forgot your spell?" button visible
- [ ] Click opens email input popup
- [ ] Email validation works
- [ ] OTP displays after sending
- [ ] Can enter 6 OTP digits
- [ ] OTP verification passes
- [ ] Password reset works
- [ ] Can login with new password
- [ ] Works from another device on network

---

All done! 🧙‍♂️ Happy testing!
