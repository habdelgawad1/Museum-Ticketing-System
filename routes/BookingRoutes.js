const express = require('express');
const BookingRouter = express.Router();
const {createBooking, getBookingByID, updateBooking, cancelBooking, payBookingCash, payBookingPoints} = require('../controllers/BookingController');
const {validateCreateBooking} = require('../middleware/BookingMiddleware');

BookingRouter.route('/')
    .post(validateCreateBooking, createBooking);

BookingRouter.route('/:bookingID')
    .get(getBookingByID)
    .put(updateBooking)
    .delete(cancelBooking);

BookingRouter.route('/:bookingID/pay-cash')
    .post(payBookingCash);

BookingRouter.route('/:bookingID/pay-points')
    .post(payBookingPoints);

module.exports = BookingRouter;