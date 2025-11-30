const {db} = require('../config/db');

const createTour = (req, res) => {
    const {guideID, title, description, startTime, endTime, date, maxParticipants, price, language} = req.body;
    
    if (!guideID || !title || !startTime || !endTime || !date || !maxParticipants || !price || !language) {
        return res.status(400).json({error: 'All fields are required'});
    }

    const verifyQuery = 'SELECT UserID, Role FROM Users WHERE UserID = ?';

    db.get(verifyQuery, [guideID], (err, user) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }

        if (!user) {
            return res.status(404).json({error: 'Guide not found'});
        }

        if (user.Role !== 'guide') {
            return res.status(403).json({error: 'User is not authorized to create tours'});
        }

        const query = `INSERT INTO Tours VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [guideID, title, description || '', startTime, endTime, date, maxParticipants, maxParticipants, price, language, 'scheduled'];

        db.run(query, params, function(err) {
            if (err) {
                return res.status(500).json({error: 'Failed to create tour'});
            }

            return res.status(201).json({message: 'Tour created successfully'});
        });
    });
};

const getAllToursAdmin = (req, res) => {
    const query = 'SELECT * FROM Tours ORDER BY Date DESC, StartTime DESC';

    db.all(query, [], (err, tours) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }

        if (tours.length === 0) {
            return res.status(404).json({error: 'No tours found'});
        }

        return res.status(200).json({   
                message: 'Tours retrieved successfully',
                count: tours.length,
                tours: tours
            });
    });
};

const deleteTour = (req, res) => {
    const {tourID} = req.params;

    if (!tourID) {
        return res.status(400).json({error: 'Tour ID is required'});
    }

    const verifyQuery = 'SELECT * FROM Tours WHERE TourID = ?';

    db.get(verifyQuery, [tourID], (err, tour) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }

        if (!tour) {
            return res.status(404).json({error: 'Tour not found'});
        }

        const query = 'DELETE FROM Tours WHERE TourID = ?';

        db.run(query, [tourID], function(err) {
            if (err) {
                return res.status(500).json({error: 'Failed to delete tour'});
            }

            return res.status(200).json({message: 'Tour deleted successfully'});
        });
    });
};

const updateTourStatus = (req, res) => {
    const {tourID} = req.params;
    const {tourStatus} = req.body;

    if (!tourID || !tourStatus) {
        return res.status(400).json({error: 'Tour ID and status are required'});
    }

    const validStatuses = ['scheduled', 'ongoing', 'completed', 'canceled'];
    if (!validStatuses.includes(tourStatus)) {
        return res.status(400).json({error: 'Invalid tour status'});
    }

    const verifyQuery = 'SELECT * FROM Tours WHERE TourID = ?';

    db.get(verifyQuery, [tourID], (err, tour) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }

        if (!tour) {
            return res.status(404).json({error: 'Tour not found'});
        }

        const query = 'UPDATE Tours SET TourStatus = ? WHERE TourID = ?';

        db.run(query, [tourStatus, tourID], function(err) {
            if (err) {
                return res.status(500).json({error: 'Failed to update tour status'});
            }

            return res.status(200).json({message: 'Tour status updated successfully'});
        });
    });
};

module.exports = {
    createTour,
    getAllToursAdmin,
    deleteTour,
    updateTourStatus
};

