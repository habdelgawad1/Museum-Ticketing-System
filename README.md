# Grand Egyptian Museum - Backend API

A comprehensive RESTful API for the Grand Egyptian Museum ticketing and tour management system. Built with Express.js, SQLite, and JWT authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

The Grand Egyptian Museum Backend API provides a complete system for managing museum tours, user bookings, reviews, and administrative functions. It includes role-based access control (admin, guide, visitor), secure authentication, and comprehensive CRUD operations for all entities.

### Key Capabilities

- **User Management**: Registration, authentication, profile management
- **Tour Management**: CRUD operations for museum tours
- **Booking System**: Create, update, cancel bookings with availability tracking
- **Payment Processing**: Support for cash and points-based payments
- **Review System**: Users can rate and review tours
- **Admin Panel**: Administrative controls for tours, users, and system management
- **Role-Based Access**: Different permissions for admins, guides, and visitors

## ✨ Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (Admin, Guide, Visitor)
- ✅ Secure cookie handling
- ✅ Input validation and sanitization

### User Features
- ✅ User registration and login
- ✅ Profile management
- ✅ Points system for rewards
- ✅ Password encryption

### Tour Management
- ✅ Browse scheduled tours
- ✅ View tour details
- ✅ Filter tours by guide
- ✅ Tour status tracking (scheduled, ongoing, completed, canceled)
- ✅ Capacity management

### Booking System
- ✅ Create bookings with availability check
- ✅ Update booking details
- ✅ Cancel bookings with spot restoration
- ✅ Multiple payment methods (cash, points)
- ✅ Booking status tracking (confirmed, canceled, completed)

### Review System
- ✅ Create reviews with ratings (1-5 stars)
- ✅ View reviews by tour
- ✅ Comment system

### Admin Features
- ✅ Create and manage tours
- ✅ Update tour status
- ✅ Delete tours
- ✅ Create admin users
- ✅ View all tours

## 🛠️ Technology Stack

### Core Technologies
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js (v5.1.0)
- **Database**: SQLite3 (v5.1.7)
- **Authentication**: JSON Web Token (v9.0.2)
- **Password Hashing**: bcryptjs (v3.0.3)

### Additional Dependencies
- **dotenv**: Environment variable management (v17.2.3)
- **cookie-parser**: Cookie parsing middleware (v1.4.7)
- **axios**: HTTP client (v1.13.2)

## 📁 Project Structure

```
museum-ticketing-system/
├── config/
│   └── db.js                    # Database configuration and schema
├── controllers/
│   ├── AdminController.js       # Admin operations logic
│   ├── AuthController.js        # Authentication logic
│   ├── BookingController.js     # Booking management
│   ├── ReviewController.js      # Review operations
│   ├── TourController.js        # Tour management
│   └── UserController.js        # User profile operations
├── middleware/
│   ├── AuthMiddleware.js        # Authentication validation
│   └── UserMiddleware.js        # User input validation
├── routes/
│   ├── AdminRoutes.js           # Admin endpoints
│   ├── AuthRoutes.js            # Auth endpoints
│   ├── BookingRoutes.js         # Booking endpoints
│   ├── ReviewRoutes.js          # Review endpoints
│   ├── TourRoutes.js            # Tour endpoints
│   └── UserRoutes.js            # User endpoints
├── .env                         # Environment variables (not in repo)
├── .gitignore                   # Git ignore file
├── index.js                     # Express app configuration
├── server.js                    # Server entry point
├── package.json                 # Dependencies
├── package-lock.json            # Dependency lock file
└── museum.db                    # SQLite database (auto-generated)
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL,
    Phone TEXT NOT NULL,
    Role TEXT NOT NULL CHECK (Role IN ('admin', 'guide', 'visitor')),
    Points INTEGER DEFAULT 0
)
```

**Fields:**
- `UserID`: Unique identifier (auto-increment)
- `Name`: User's full name
- `Email`: Unique email address
- `Password`: Hashed password (bcrypt)
- `Phone`: Contact phone number
- `Role`: User role (admin, guide, or visitor)
- `Points`: Reward points for point-based payments

### Tours Table
```sql
CREATE TABLE Tours (
    TourID INTEGER PRIMARY KEY AUTOINCREMENT,
    GuideID INTEGER NOT NULL,
    Title TEXT NOT NULL,
    Description TEXT,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    Date DATETIME NOT NULL,
    MaxParticipants INTEGER NOT NULL,
    AvailableSpots INTEGER NOT NULL,
    Price REAL NOT NULL,
    Language TEXT NOT NULL,
    TourStatus TEXT NOT NULL CHECK (TourStatus IN ('scheduled', 'ongoing', 'completed', 'canceled'))
)
```

**Fields:**
- `TourID`: Unique identifier (auto-increment)
- `GuideID`: Foreign key to Users table (must be a guide)
- `Title`: Tour name
- `Description`: Detailed tour description
- `StartTime`: Tour start time
- `EndTime`: Tour end time
- `Date`: Tour date
- `MaxParticipants`: Maximum capacity
- `AvailableSpots`: Current available spots
- `Price`: Tour price in USD
- `Language`: Tour language
- `TourStatus`: Current status (scheduled, ongoing, completed, canceled)

### Bookings Table
```sql
CREATE TABLE Bookings (
    BookingID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER NOT NULL,
    TourID INTEGER NOT NULL,
    NumberOfTickets INTEGER NOT NULL,
    BookingStatus TEXT NOT NULL CHECK (BookingStatus IN ('confirmed', 'canceled', 'completed'))
)
```

**Fields:**
- `BookingID`: Unique identifier (auto-increment)
- `UserID`: Foreign key to Users table
- `TourID`: Foreign key to Tours table
- `NumberOfTickets`: Number of tickets booked
- `BookingStatus`: Booking status (confirmed, canceled, completed)

### Reviews Table
```sql
CREATE TABLE Reviews (
    ReviewID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER NOT NULL,
    TourID INTEGER NOT NULL,
    BookingID INTEGER NOT NULL,
    Rating INTEGER NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT
)
```

**Fields:**
- `ReviewID`: Unique identifier (auto-increment)
- `UserID`: Foreign key to Users table
- `TourID`: Foreign key to Tours table
- `BookingID`: Foreign key to Bookings table
- `Rating`: Star rating (1-5)
- `Comment`: Review text (optional)

## 📥 Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **Git** (for cloning the repository)

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd museum-ticketing-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   touch .env
   ```

4. **Configure environment variables** (see Configuration section)

5. **Initialize the database**
   The database will be automatically created when you start the server for the first time.

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4423

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRES_IN=90d

# Database Configuration (optional, defaults to museum.db)
DB_NAME=museum.db

# Node Environment
NODE_ENV=development
```

### Environment Variables Explained

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 4423 | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | 90d | Yes |
| `DB_NAME` | SQLite database filename | museum.db | No |
| `NODE_ENV` | Environment (development/production) | development | No |

**⚠️ Security Note**: Never commit your `.env` file to version control. The `.gitignore` file is already configured to exclude it.

## 🚀 Running the Server

### Development Mode

```bash
node server.js
```

The server will start on `http://localhost:4423` (or your configured PORT).

### Production Mode

```bash
NODE_ENV=production node server.js
```

### Using Process Manager (PM2) - Recommended for Production

```bash
# Install PM2 globally
npm install -g pm2

# Start the server
pm2 start server.js --name museum-api

# View logs
pm2 logs museum-api

# Restart server
pm2 restart museum-api

# Stop server
pm2 stop museum-api
```

### Verification

Once the server is running, you should see:
```
Server is running on port 4423
```

The database tables will be created automatically on first run.

## 📚 API Documentation

Base URL: `http://localhost:4423/api/v1`

### Quick Reference

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **Auth** | `/auth/register` | POST | Register new user |
| **Auth** | `/auth/login` | POST | User login |
| **Users** | `/users/profile/:userID` | GET | Get user profile |
| **Users** | `/users/update` | PUT | Update profile |
| **Users** | `/users/delete` | DELETE | Delete user |
| **Tours** | `/tours` | GET | Get all tours |
| **Tours** | `/tours/:id` | GET | Get tour by ID |
| **Tours** | `/tours/guide/:guideId` | GET | Get tours by guide |
| **Bookings** | `/bookings` | POST | Create booking |
| **Bookings** | `/bookings/:bookingID` | GET | Get booking |
| **Bookings** | `/bookings/:bookingID` | PUT | Update booking |
| **Bookings** | `/bookings/:bookingID` | DELETE | Cancel booking |
| **Bookings** | `/bookings/:bookingID/pay-cash` | POST | Pay with cash |
| **Bookings** | `/bookings/:bookingID/pay-points` | POST | Pay with points |
| **Reviews** | `/reviews` | POST | Create review |
| **Reviews** | `/reviews/:tourID` | GET | Get tour reviews |
| **Admin** | `/admin/tours` | POST | Create tour |
| **Admin** | `/admin/tours` | GET | Get all tours (admin) |
| **Admin** | `/admin/tours/:tourID` | PUT | Update tour status |
| **Admin** | `/admin/tours/:tourID` | DELETE | Delete tour |
| **Admin** | `/admin/admins` | POST | Create admin user |
| **Admin** | `/admin/admins/:adminID` | DELETE | Delete admin user |

### Authentication Endpoints

#### Register User
Creates a new user account.

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "role": "visitor"
}
```

**Validation Rules:**
- `name`: Required
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters, must include uppercase, lowercase, number, and special character
- `phone`: Required
- `role`: Optional, defaults to "visitor" (valid: admin, guide, visitor)

**Success Response (201):**
```json
{
  "message": "User Successfully Created"
}
```

**Error Responses:**
- `400`: Invalid input or email already exists
- `500`: Server error

---

#### Login
Authenticate a user and receive a JWT token.

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "Login Successful",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "visitor"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Invalid credentials or missing fields
- `500`: Server error

---

### User Endpoints

#### Get User Profile
Retrieve user profile information.

**Endpoint:** `GET /api/v1/users/profile/:userID`

**Success Response (200):**
```json
{
  "message": "User Profile Retrieved Successfully",
  "profile": {
    "UserID": 1,
    "Name": "John Doe",
    "Email": "john.doe@example.com",
    "Phone": "+1234567890"
  }
}
```

---

#### Update Profile
Update user profile information.

**Endpoint:** `PUT /api/v1/users/update`

**Request Body:**
```json
{
  "userID": 1,
  "name": "John Smith",
  "email": "john.smith@example.com",
  "password": "NewPassword123!",
  "phone": "+1234567890"
}
```

**Success Response (200):**
```json
{
  "message": "User Successfully Updated"
}
```

---

### Tour Endpoints

#### Get All Scheduled Tours
Retrieve all scheduled tours.

**Endpoint:** `GET /api/v1/tours`

**Success Response (200):**
```json
{
  "message": "Scheduled Tours Retrieved Successfully",
  "count": 2,
  "tours": [
    {
      "TourID": 1,
      "GuideID": 2,
      "Title": "Ancient Treasures Tour",
      "Description": "Explore the ancient artifacts...",
      "StartTime": "09:00:00",
      "EndTime": "11:00:00",
      "Date": "2025-01-15",
      "MaxParticipants": 20,
      "AvailableSpots": 15,
      "Price": 50.00,
      "Language": "English",
      "TourStatus": "scheduled"
    }
  ]
}
```

---

#### Get Tour by ID
Retrieve details of a specific tour.

**Endpoint:** `GET /api/v1/tours/:id`

**Success Response (200):**
```json
{
  "message": "Tour Retrieved Successfully",
  "tour": {
    "TourID": 1,
    "Title": "Ancient Treasures Tour",
    "Description": "Explore the ancient artifacts...",
    "Price": 50.00,
    "AvailableSpots": 15
  }
}
```

---

### Booking Endpoints

#### Create Booking
Create a new tour booking.

**Endpoint:** `POST /api/v1/bookings`

**Request Body:**
```json
{
  "userID": 1,
  "TourID": 1,
  "NumberOfTickets": 2
}
```

**Success Response (201):**
```json
{
  "message": "Booking created successfully",
  "bookingID": 1
}
```

---

#### Cancel Booking
Cancel an existing booking.

**Endpoint:** `DELETE /api/v1/bookings/:bookingID`

**Success Response (200):**
```json
{
  "message": "Booking canceled successfully"
}
```

---

### Review Endpoints

#### Create Review
Submit a review for a completed tour.

**Endpoint:** `POST /api/v1/reviews`

**Request Body:**
```json
{
  "userID": 1,
  "tourID": 1,
  "bookingID": 1,
  "rating": 5,
  "comment": "Excellent tour! Very informative."
}
```

**Success Response (201):**
```json
{
  "message": "Review created",
  "reviewID": 1
}
```

---

### Admin Endpoints

#### Create Tour (Admin Only)
Create a new museum tour.

**Endpoint:** `POST /api/v1/admin/tours`

**Request Body:**
```json
{
  "guideID": 2,
  "title": "Pharaoh's Legacy Tour",
  "description": "Discover the legacy of Egyptian pharaohs...",
  "startTime": "09:00:00",
  "endTime": "11:00:00",
  "date": "2025-01-20",
  "maxParticipants": 25,
  "availableSpots": 25,
  "price": 60.00,
  "language": "English"
}
```

**Success Response (201):**
```json
{
  "message": "Tour created successfully"
}
```

---

## 🛡️ Middleware

### Authentication Middleware (`middleware/AuthMiddleware.js`)

#### Validation Functions

**`validateSignup(req, res, next)`**
- Validates registration data
- Sanitizes all inputs
- Checks password strength (min 8 chars, uppercase, lowercase, number, special char)
- Validates role

**`validateLogin(req, res, next)`**
- Validates login credentials
- Sanitizes email and password
- Checks required fields

### User Middleware (`middleware/UserMiddleware.js`)

**`validateUpdateProfile(req, res, next)`**
- Validates profile update requests
- Sanitizes inputs
- Validates email format
- Validates password strength if provided

---

## ⚠️ Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server/database errors |

---

## 🔒 Security

### Implemented Security Features

1. **Password Security**
   - Passwords hashed using bcrypt (10 rounds)
   - Never stored or transmitted in plain text
   - Strong password requirements enforced

2. **Input Validation & Sanitization**
   - All inputs sanitized before processing
   - SQL injection prevention through parameterized queries
   - XSS prevention through input escaping

3. **Authentication**
   - JWT-based stateless authentication
   - Tokens signed with secret key
   - Configurable expiration time

4. **Authorization**
   - Role-based access control
   - Database constraints for role validation

5. **HTTP Security**
   - Cookie security with httpOnly flag
   - Environment variable protection

---

## 🧪 Testing

### Manual Testing with cURL

**Register a User:**
```bash
curl -X POST http://localhost:4423/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "phone": "+1234567890",
    "role": "visitor"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:4423/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

---

## 🚀 Deployment

### Production Steps

1. **Configure Environment**
   ```env
   PORT=4423
   JWT_SECRET=your_production_secret_key_very_long_and_random
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ```

2. **Start with PM2**
   ```bash
   pm2 start server.js --name museum-api
   pm2 save
   pm2 startup
   ```

3. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourmuseum.com;
       
       location / {
           proxy_pass http://localhost:4423;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Setup SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d api.yourmuseum.com
   ```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 📞 Support

For issues, questions, or contributions:
- **Email**: support@grandegyptianmuseum.com

---

**Built with ❤️ for the Grand Egyptian Museum**

*Last Updated: December 2025 | Version: 1.0.0*
