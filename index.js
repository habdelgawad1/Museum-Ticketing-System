const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const corsOptions = {
    origin: process.env.CLIENT_URL, 
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