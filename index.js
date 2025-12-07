const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // In development, allow common localhost origins
        const allowedOrigins = [
            'http://localhost:8000',
            'http://localhost:3000',
            'http://localhost:8080',
            'http://127.0.0.1:8000',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:8080',
        ];
        
        // If CLIENT_URL is set in environment, add it to allowed origins
        if (process.env.CLIENT_URL) {
            allowedOrigins.push(process.env.CLIENT_URL);
        }
        
        // In development mode, allow all localhost origins
        if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
            if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
                return callback(null, true);
            }
        }
        
        // Check if origin is in allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET','PUT','POST','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));

const BookingRoutes = require('./routes/BookingRoutes.js');
const UserRoutes = require('./routes/UserRoutes.js');
const TourRoutes = require('./routes/TourRoutes.js');
const ReviewRoutes = require('./routes/ReviewRoutes.js');
const AdminRoutes = require('./routes/AdminRoutes.js');
const AuthRoutes = require('./routes/AuthRoutes.js');

const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());

const API ="/api/v1";

app.use(`${API}/auth`, AuthRoutes);
app.use(`${API}/bookings`, BookingRoutes);
app.use(`${API}/users`, UserRoutes);
app.use(`${API}/tours`, TourRoutes);
app.use(`${API}/reviews`, ReviewRoutes);
app.use(`${API}/admin`, AdminRoutes);

module.exports = app;