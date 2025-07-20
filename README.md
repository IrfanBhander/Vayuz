# Pleasant Weather App

A beautiful, optimistic weather application with secure user authentication that focuses on presenting weather information in a positive, user-friendly way. Built with React, TypeScript, Tailwind CSS, and Node.js.

## 🌟 Key Features

### Pleasant Weather Focus
- **Optimistic Presentation**: Emphasizes positive aspects of all weather conditions
- **Beautiful Descriptions**: Transforms weather data into pleasant, encouraging messages
- **Comfort-Focused**: Highlights comfort levels and pleasant aspects of current conditions
- **Positive Messaging**: Avoids harsh weather warnings in favor of gentle, informative descriptions

### Core Functionality
- 🌤️ **Current Weather Display**: Temperature, humidity, wind speed, pressure, and visibility
- 🔄 **Unit Toggle**: Switch between Celsius and Fahrenheit
- 📍 **Geolocation Support**: Automatic weather detection for current location
- 🔍 **City Search**: Search for weather in any city worldwide with autocomplete
- 📱 **Responsive Design**: Optimized for all device sizes
- 💾 **Recent Searches**: Quick access to previously searched locations

### 🔐 Secure Authentication System
- **User Registration**: Secure account creation with email verification
- **Login/Logout**: JWT-based authentication with session management
- **Password Reset**: Secure password recovery via email
- **Two-Factor Authentication**: Optional 2FA with TOTP support
- **Account Security**: Rate limiting, account lockout, and security monitoring
- **Remember Me**: Secure persistent sessions

### Design Philosophy
- **Light & Bright**: Clean, optimistic visual design with pleasant color schemes
- **Weather-Adaptive Backgrounds**: Beautiful gradients that change based on weather conditions
- **Smooth Animations**: Gentle transitions and micro-interactions throughout
- **Pleasant Icons**: Weather icons with positive visual treatments
- **Comfortable Typography**: Easy-to-read fonts with proper contrast

## 🛠️ Technical Implementation

### Architecture
- **React 18** with TypeScript for type safety
- **Node.js/Express** backend with comprehensive security
- **Custom Hooks** for weather data management
- **Context Pattern** for state management
- **Service Layer** for API interactions
- **Utility Functions** for pleasant weather interpretation

### Security Features
- **Password Hashing**: bcrypt with configurable rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive validation and sanitization
- **CSRF Protection**: Cross-site request forgery prevention
- **Session Security**: Secure HTTP-only cookies
- **Account Lockout**: Automatic lockout after failed attempts
- **Email Verification**: Required email verification for new accounts

### Weather Data Processing
- **Pleasant Weather Mapping**: Transforms raw weather data into positive descriptions
- **Comfort Analysis**: Analyzes temperature, humidity, and wind for comfort levels
- **Condition Enhancement**: Presents all weather conditions in their best light
- **Smart Messaging**: Context-aware descriptions based on weather patterns

### User Experience
- **Gentle Error Handling**: Friendly error messages without alarming users
- **Optimistic Loading States**: Pleasant loading animations and messages
- **Intuitive Navigation**: Simple, clear interface focused on essential information
- **Accessibility**: Proper contrast ratios and keyboard navigation support

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- SMTP server access for email functionality (Gmail recommended)

### Installation

1. **Install dependencies**:
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd server
   npm install
   cd ..
   ```

2. **Frontend Environment Setup**:
   The weather API key is pre-configured in the `.env` file:
   ```
   VITE_OPENWEATHER_API_KEY=Your API key
   ```

3. **Backend Environment Setup**:
   Copy the example environment file and configure:
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `server/.env` with your configuration:
   ```
   # Security Keys (CHANGE THESE!)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   SESSION_SECRET=your-super-secret-session-key-change-in-production
   
   # Email Configuration
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Start the development servers**:
   
   Backend server:
   ```bash
   cd server
   npm run dev
   ```
   
   Frontend server (in a new terminal):
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## 🔧 Authentication Setup

### Email Configuration

For email functionality (verification, password reset), configure SMTP settings:

**Gmail Setup:**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account → Security → App passwords
3. Use your Gmail address and the generated app password in `.env`

**Other SMTP Providers:**
Update the SMTP settings in `server/.env`:
```
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

### Security Configuration

**Production Deployment:**
- Generate strong, unique secrets for JWT_SECRET and SESSION_SECRET
- Use environment variables for all sensitive configuration
- Enable HTTPS in production
- Configure proper CORS settings
- Set up proper database backups

**Development:**
- Default settings work for local development
- SQLite database is created automatically
- Email verification links work with localhost

## 🎨 Design Features

### Pleasant Weather Presentation
- **Positive Framing**: All weather conditions presented in their most favorable light
- **Comfort Indicators**: Clear indicators of comfort levels and pleasant aspects
- **Beautiful Visuals**: Weather-appropriate color schemes and gradients
- **Encouraging Messages**: Uplifting descriptions that make users feel good about the weather

### Visual Design
- **Clean Interface**: Minimal, uncluttered design focused on essential information
- **Smooth Animations**: Gentle transitions that enhance rather than distract
- **Responsive Layout**: Adapts beautifully to all screen sizes
- **Pleasant Color Palette**: Soft, welcoming colors that change with weather conditions

### User-Friendly Features
- **Instant Search**: Quick city search with recent searches history
- **One-Click Location**: Easy access to current location weather
- **Smart Defaults**: Sensible default settings and behaviors
- **Gentle Feedback**: Non-intrusive notifications and status updates

## 🌈 Weather Condition Handling

### Pleasant Interpretation
- **Clear Skies**: "Perfect sunny weather" with excellent rating
- **Partly Cloudy**: "Pleasant with some clouds" maintaining positive tone
- **Light Rain**: "Refreshing light showers" focusing on the pleasant aspects
- **Snow**: "Beautiful winter weather" emphasizing the scenic nature
- **Overcast**: "Comfortable overcast day" highlighting the cozy feeling

### Comfort Analysis
- **Temperature Feelings**: Descriptive comfort levels for all temperatures
- **Humidity Comfort**: Pleasant descriptions of humidity levels
- **Wind Descriptions**: Positive framing of wind conditions
- **Visibility**: Clear, non-alarming visibility information

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices with touch-friendly interfaces
- **Tablet Support**: Perfect layout for tablet viewing and interaction
- **Desktop Experience**: Full-featured desktop interface with enhanced visuals
- **Cross-Browser**: Compatible with all modern browsers

## 🔧 Build for Production

### Frontend
```bash
npm run build
```

The optimized build will be created in the `dist` directory.

### Backend
```bash
cd server
npm run build
npm start
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Test Coverage
```bash
cd server
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Initiate password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/setup-2fa` - Setup two-factor authentication
- `POST /api/auth/enable-2fa` - Enable two-factor authentication
- `POST /api/auth/disable-2fa` - Disable two-factor authentication

### Security Features

- **Rate Limiting**: 5 attempts per 15 minutes per IP/email
- **Account Lockout**: 5 failed attempts locks account for 30 minutes
- **Password Requirements**: 8+ chars, uppercase, lowercase, number, special char
- **JWT Expiration**: 24 hours (configurable)
- **Session Security**: HTTP-only cookies with secure flags

## 🌟 Key Benefits

1. **Positive User Experience**: Focuses on the pleasant aspects of weather
2. **Secure Authentication**: Enterprise-grade security features
3. **Stress-Free Interface**: Avoids alarming weather warnings and harsh presentations
4. **Beautiful Design**: Visually appealing with weather-adaptive backgrounds
5. **Reliable Performance**: Fast, responsive, and dependable across all devices
6. **User-Friendly**: Intuitive interface that anyone can use comfortably

## 🤝 Contributing

We welcome contributions that maintain the pleasant, optimistic nature and security standards of the application:

1. Fork the repository
2. Create a feature branch
3. Ensure changes align with the pleasant weather philosophy and security best practices
4. Add tests for new functionality
5. Submit a pull request

## 🔒 Security

This application implements security best practices:

- **Input Validation**: All user inputs are validated and sanitized
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **XSS Protection**: Content Security Policy and input sanitization
- **CSRF Protection**: CSRF tokens for state-changing operations
- **Rate Limiting**: Protection against brute force and DoS attacks
- **Secure Headers**: Helmet.js for security headers
- **Password Security**: bcrypt hashing with salt rounds
- **Session Security**: Secure, HTTP-only cookies

### Reporting Security Issues

Please report security vulnerabilities privately to the maintainers.

## 📄 License

This project is open source and available under the MIT License.

---

*Bringing you the bright side of weather, every day! ☀️*