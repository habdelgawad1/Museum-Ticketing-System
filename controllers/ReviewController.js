const {db} = require('../config/db');

const createReview = (req, res) => {
    const userID = req.body.userID;
    const tourID = req.body.tourID;
    const bookingID = req.body.bookingID;
    const rating = req.body.rating;
    const comment = req.body.comment;

    if (!userID || !tourID || !bookingID || !rating) {
        return res.status(400).json({error: 'All fields except comment are required'});
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({error: 'Rating must be between 1 and 5'});
    }

    const userQuery = `SELECT UserID FROM Users WHERE UserID = ?`;

    db.get(userQuery, [userID], (err, user) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        const tourQuery = `SELECT TourID FROM Tours WHERE TourID = ?`;
        db.get(tourQuery, [tourID], (err, tour) => {
            if (err) {
                return res.status(500).json({error: 'Database error'});
            }
            if (!tour) {
                return res.status(404).json({error: 'Tour not found'});
            }

            const bookingQuery = `SELECT * FROM Bookings WHERE BookingID = ?`;
            db.get(bookingQuery, [bookingID], (err, booking) => {
                if (err) {
                    return res.status(500).json({error: 'Database error'});
                }
                if (!booking) {
                    return res.status(404).json({error: 'Booking not found'});
                }

                const insertQuery = `INSERT INTO Reviews (UserID, TourID, BookingID, Rating, Comment) VALUES (?, ?, ?, ?, ?)`;
                params = [userID, tourID, bookingID, rating, comment || ''];
                db.run(insertQuery, params, function(err) {
                    if (err) {
                        return res.status(500).json({error: 'Database error'});
                    }
                    res.status(201).json({message: 'Review created', reviewID: this.lastID});
                });
            });
        });
    });
};

const getReviewsByTour = (req, res) => {
    const {tourID} = req.params;

    if (!tourID) {
        return res.status(400).json({error: 'Tour ID is required'});
    }

    const query = `SELECT * FROM Reviews WHERE TourID = ?`;
    db.all(query, [tourID], (err, reviews) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }
        res.status(200).json(reviews);
    });
};

module.exports = {
    createReview,
    getReviewsByTour
};