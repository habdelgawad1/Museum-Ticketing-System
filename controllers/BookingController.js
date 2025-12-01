const {db} = require('../config/db');

const createBooking = (req, res) => {
    const {userID, TourID, numberOfTickets} = req.body;

    if (!userID || !TourID || !numberOfTickets) {
        return res.status(400).json({error: 'All fields are required'});
    }

    if (numberOfTickets <= 0) {
        return res.status(400).json({error: 'Number of tickets must be greater than zero'});
    }

    const userQuery = `SELECT UserID FROM Users WHERE UserID = ?`;

    db.get(userQuery, [userID], (err, user) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        const tourQuery = `SELECT AvailableSpots, Price FROM Tours WHERE TourID = ?`;
        db.get(tourQuery, [TourID], (err, tour) => {
            if (err) {
                return res.status(500).json({error: 'Database error'});
            }

            if (!tour) {
                return res.status(404).json({error: 'Tour not found'});
            }

            if (tour.AvailableSpots < numberOfTickets) {
                return res.status(400).json({error: 'Not enough available spots'});
            }

            if (tour.TourStatus !== 'scheduled') {
                return res.status(400).json({error: 'Cannot book a canceled tour'});
            }

            const bookingQuery = `INSERT INTO Bookings (UserID, TourID, NumberOfTickets, BookingStatus) VALUES (?, ?, ?, ?)`;
            const params = [userID, TourID, numberOfTickets, 'confirmed'];

            db.run(bookingQuery, params, function(err) {
                if (err) {
                    return res.status(500).json({error: 'Failed to create booking'});
                }

                const updateTourQuery = `UPDATE Tours SET AvailableSpots = AvailableSpots - ? WHERE TourID = ?`;
                const params = [numberOfTickets, TourID];
                db.run(updateTourQuery, params, function(err) {
                    if (err) {
                        db.run(`DELETE FROM Bookings WHERE BookingID = ?`, [this.lastID]);
                        return res.status(500).json({error: 'Failed to update available spots'});
                    }

                    return res.status(201).json({message: 'Booking created successfully', bookingID: this.lastID});
                });
            });
        });
    });
};

const getBookingByID = (req, res) => {
    const {bookingID} = req.params;
    if (!bookingID) {
        return res.status(400).json({error: 'Booking ID is required'});
    }

    const query = 'SELECT * FROM Bookings WHERE BookingID = ?';

    db.get(query, [bookingID], (err, booking) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }

        if (!booking) {
            return res.status(404).json({error: 'Booking not found'});
        }

        return res.status(200).json(booking);
    });
};

const updateBooking = (req, res) => {
    const {bookingID} = req.params;
    const {numberOfTickets} = req.body;

    if (!numberOfTickets) {
        return res.status(400).json({error: 'Number of tickets is required'});
    }

    const bookingQuery = 'SELECT * FROM Bookings WHERE BookingID = ?';
    db.get(bookingQuery, [bookingID], (err, booking) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }

        if (!booking) {
            return res.status(404).json({error: 'Booking not found'});
        }

        if (booking.BookingStatus !== 'confirmed') {
            return res.status(400).json({error: 'Only confirmed bookings can be updated'});
        }

        const tourQuery = 'SELECT AvailableSpots FROM Tours WHERE TourID = ?';
        db.get(tourQuery, [booking.TourID], (err, tour) => {
            if (err) {
                return res.status(500).json({error: 'Database error'});
            }

            if (!tour) {
                return res.status(404).json({error: 'Tour not found'});
            }

            if (tour.TourStatus !== 'scheduled') {
                return res.status(400).json({error: 'Cannot update booking for a canceled tour'});
            }

            const spotsDifference = numberOfTickets - booking.NumberOfTickets;

            if (spotsDifference > tour.AvailableSpots) {
                return res.status(400).json({error: 'Not enough available spots for the update'});
            }

            const updateBookingQuery = 'UPDATE Bookings SET NumberOfTickets = ? WHERE BookingID = ?';
            db.run(updateBookingQuery, [numberOfTickets, bookingID], function(err) {
                if (err) {
                    return res.status(500).json({error: 'Failed to update booking'});
                }

                const updateTourQuery = 'UPDATE Tours SET AvailableSpots = AvailableSpots - ? WHERE TourID = ?';
                db.run(updateTourQuery, [spotsDifference, booking.TourID], function(err) {
                    if (err) {
                        return res.status(500).json({error: 'Failed to update available spots'});
                    }

                    return res.status(200).json({message: 'Booking updated successfully'});
                });
            });
        });
    });
};

const cancelBooking = (req, res) => {
    const {bookingID} = req.params;

    if (!bookingID) {
        return res.status(400).json({error: 'Booking ID is required'});
    }

    const bookingQuery = 'SELECT * FROM Bookings WHERE BookingID = ?';

    db.get(bookingQuery, [bookingID], (err, booking) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }

        if (!booking) {
            return res.status(404).json({error: 'Booking not found'});
        }

        if (booking.BookingStatus !== 'confirmed') {
            return res.status(400).json({error: 'Only confirmed bookings can be canceled'});
        }

        const updateBookingQuery = 'UPDATE Bookings SET BookingStatus = ? WHERE BookingID = ?';

        db.run(updateBookingQuery, ['canceled', bookingID], function(err) {
            if (err) {
                return res.status(500).json({error: 'Failed to cancel booking'});
            }

            const updateTourQuery = 'UPDATE Tours SET AvailableSpots = AvailableSpots + ? WHERE TourID = ?';
            db.run(updateTourQuery, [booking.NumberOfTickets, booking.TourID], function(err) {
                if (err) {
                    return res.status(500).json({error: 'Failed to update available spots'});
                }
                return res.status(200).json({message: 'Booking canceled successfully'});
            }); 
        });
    });
};

const payBookingCash = (req, res) => {
    const {bookingID} = req.params;

    if (!bookingID) {
        return res.status(400).json({error: 'Booking ID is required'});
    }

    const bookingQuery = 'SELECT * FROM Bookings WHERE BookingID = ?';

    db.get(bookingQuery, [bookingID], (err, booking) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }

        if (!booking) {
            return res.status(404).json({error: 'Booking not found'});
        }

        if (booking.BookingStatus !== 'confirmed') {
            return res.status(400).json({error: 'Only confirmed bookings can be paid for'});
        }

        const updateBookingQuery = 'UPDATE Bookings SET BookingStatus = ? WHERE BookingID = ?';

        db.run(updateBookingQuery, ['completed', bookingID], function(err) {
            if (err) {
                return res.status(500).json({error: 'Failed to update booking status'});
            }

            return res.status(200).json({message: 'Booking paid successfully'});
        });
    });
};

const payBookingPoints = (req, res) => {
    const {bookingID} = req.params;

    if (!bookingID) {
        return res.status(400).json({error: 'Booking ID is required'});
    }

    const bookingQuery = 'SELECT * FROM Bookings WHERE BookingID = ?';

    db.get(bookingQuery, [bookingID], (err, booking) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }

        if (!booking) {
            return res.status(404).json({error: 'Booking not found'});
        }

        if (booking.BookingStatus !== 'confirmed') {
            return res.status(400).json({error: 'Only confirmed bookings can be paid for'});
        }

        const updatePointsQuery = 'UPDATE Users SET Points = Points - ? WHERE UserID = ?';

        db.run(updatePointsQuery, [booking.NumberOfTickets * 10, booking.UserID], function(err) {
            if (err) {
                return res.status(500).json({error: 'Failed to deduct points'});
            }

            const updateBookingQuery = 'UPDATE Bookings SET BookingStatus = ? WHERE BookingID = ?';

            db.run(updateBookingQuery, ['completed', bookingID], function(err) {
                if (err) {
                    return res.status(500).json({error: 'Failed to update booking status'});
                }

                return res.status(200).json({message: 'Booking paid successfully'});
            });
        });
    });
};

module.exports = {
    createBooking,
    getBookingByID,
    updateBooking,
    cancelBooking,
    payBookingCash,
    payBookingPoints
};