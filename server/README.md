# Weather App Authentication Server

Secure, production-ready authentication server for the Pleasant Weather App.

## 🔐 Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive validation and sanitization
- **CSRF Protection**: Cross-site request forgery prevention
- **Account Lockout**: Automatic lockout after failed attempts
- **Two-Factor Authentication**: TOTP-based 2FA support
- **Email Verification**: Required email verification for new accounts
- **Session Security**: Secure HTTP-only cookies
- **Security Headers**: Helmet.js for comprehensive security headers

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Database schema and setup
│   │   └── environment.ts # Environment variables
│   ├── middleware/      # Express middleware
│   │   └── auth.ts      # Authentication middleware
│   ├── routes/          # API routes
│   │   └── auth.ts      # Authentication routes
│   ├── services/        # Business logic
│   │   ├── userService.ts # User management
│   │   └── emailService.ts # Email functionality
│   ├── __tests__/       # Test files
│   └── server.ts        # Express server setup
├── .env.example         # Environment template
├── package.json
└── tsconfig.json
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `JWT_SECRET` | JWT signing secret | Required in production |
| `SESSION_SECRET` | Session secret | Required in production |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email username | Required |
| `SMTP_PASS` | Email password | Required |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Database Schema

The application uses SQLite with the following tables:

- **users**: User accounts with security fields
- **sessions**: Active user sessions
- **login_attempts**: Security monitoring

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Initiate password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user info

### Two-Factor Authentication

- `POST /api/auth/setup-2fa` - Setup 2FA
- `POST /api/auth/enable-2fa` - Enable 2FA
- `POST /api/auth/disable-2fa` - Disable 2FA

### Security

- `GET /api/auth/csrf-token` - Get CSRF token

## 🛡️ Security Implementation

### Password Security
- bcrypt hashing with 12 salt rounds (configurable)
- Password strength requirements enforced
- Secure password reset with time-limited tokens

### Authentication
- JWT tokens with configurable expiration
- Secure HTTP-only cookies
- Session management with Redis support

### Rate Limiting
- 5 attempts per 15 minutes per IP/email combination
- Account lockout after 5 failed attempts
- 30-minute lockout duration (configurable)

### Input Validation
- express-validator for comprehensive validation
- Email normalization and sanitization
- XSS and injection attack prevention

### Two-Factor Authentication
- TOTP-based using speakeasy
- QR code generation for easy setup
- Backup codes for account recovery

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Test Structure
- Unit tests for services
- Integration tests for API endpoints
- Security tests for authentication flows

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
1. Set strong, unique secrets for JWT and session
2. Configure production database
3. Set up email service (Gmail, SendGrid, etc.)
4. Enable HTTPS
5. Configure reverse proxy (nginx, Apache)

### Security Checklist
- [ ] Strong JWT and session secrets
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Email service configured
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] CORS properly configured
- [ ] Environment variables secured

## 📊 Monitoring

### Security Events
The server logs the following security events:
- Failed login attempts
- Account lockouts
- Password reset requests
- Two-factor authentication changes

### Health Check
```
GET /health
```

Returns server status and environment information.

## 🔍 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check SMTP credentials
   - Verify email service configuration
   - Check firewall/network settings

2. **JWT token errors**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure consistent secret across instances

3. **Database errors**
   - Check database file permissions
   - Verify SQLite installation
   - Check disk space

4. **Rate limiting issues**
   - Adjust rate limit settings
   - Check IP address detection
   - Verify Redis connection (if used)

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and stack traces.

## 📝 License

This project is licensed under the MIT License.