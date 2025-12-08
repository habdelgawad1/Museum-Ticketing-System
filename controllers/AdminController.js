const {db} = require('../config/db');
const logger = require('../utils/logger.js');
const bcrypt = require('bcrypt');

const createTour = (req, res) => {
    guideID = req.body.guideID
    title = req.body.title
    description = req.body.description
    startTime =  req.body.startTime
    endTime = req.body.endTime
    date = req.body.date
    availableSpots = req.body.availableSpots
    maxParticipants = req.body.maxParticipants
    price = req.body.price
    language = req.body.language
    
    if (!guideID || !title || !startTime || !endTime || !date || !maxParticipants || !price || !language) {
        return res.status(400).json({error: 'All fields are required'});
    }

    const verifyQuery = 'SELECT UserID, Role FROM Users WHERE UserID = ?';

    db.get(verifyQuery, [guideID], (err, user) => {
        if (err) {
            logger.log("Error retrieving User: " + err.message);
            return res.status(500).json({error: 'Database error'});
        }

        if (!user) {
            return res.status(404).json({error: 'Guide not found'});
        }

        if (user.Role !== 'guide') {
            return res.status(403).json({error: 'User is not authorized to create tours'});
        }

        const query = `INSERT INTO Tours (GuideID, Title, Description, StartTime, EndTime, Date, MaxParticipants, AvailableSpots, Price, Language, TourStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [guideID, title, description || '', startTime, endTime, date, maxParticipants, maxParticipants, price, language, 'scheduled'];

        db.run(query, params, function(err) {
            if (err) {
                logger.log("Error creating Tour: " + err.message);
                return res.status(500).json({error: 'Failed to create tour'});
            }

            logger.log("Tour created successfully: TourID " + this.lastID);
            return res.status(201).json({message: 'Tour created successfully'});
        });
    });
};

const getAllToursAdmin = (req, res) => {
    const query = 'SELECT * FROM Tours ORDER BY Date DESC, StartTime DESC';

    db.all(query, [], (err, tours) => {
        if (err) {
            logger.log("Error retrieving Tours: " + err.message);
            return res.status(500).json({error: 'Database error'});
        }

        if (tours.length === 0) {
            return res.status(404).json({error: 'No tours found'});
        }

        logger.log("Tours retrieved successfully: Count " + tours.length);
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
            logger.log("Error retrieving Tour: " + err.message);
            return res.status(500).json({error: 'Database error'});
        }

        if (!tour) {
            return res.status(404).json({error: 'Tour not found'});
        }

        const query = 'DELETE FROM Tours WHERE TourID = ?';

        db.run(query, [tourID], function(err) {
            if (err) {
                logger.log("Error deleting Tour: " + err.message);
                return res.status(500).json({error: 'Failed to delete tour'});
            }

            logger.log("Tour deleted successfully: TourID " + tourID);
            return res.status(200).json({message: 'Tour deleted successfully'});
        });
    });
};

const updateTourStatus = (req, res) => {
    const {tourID} = req.params;
    const TourStatus = req.body.TourStatus;

    if (!TourStatus) {
        return res.status(400).json({error: 'Tour status is required'});
    }

    const validStatuses = ['scheduled', 'ongoing', 'completed', 'canceled'];
    if (!validStatuses.includes(TourStatus)) {
        return res.status(400).json({error: 'Invalid tour status'});
    }

    const verifyQuery = 'SELECT * FROM Tours WHERE TourID = ?';

    db.get(verifyQuery, [tourID], (err, tour) => {
        if (err) {
            logger.log("Error retrieving Tour: " + err.message);
            return res.status(500).json({error: 'Database error'});
        }

        if (!tour) {
            return res.status(404).json({error: 'Tour not found'});
        }

        const query = 'UPDATE Tours SET TourStatus = ? WHERE TourID = ?';

        db.run(query, [TourStatus, tourID], function(err) {
            if (err) {
                logger.log("Error updating Tour status: " + err.message);
                return res.status(500).json({error: 'Failed to update tour status'});
            }

            logger.log("Tour status updated successfully: TourID " + tourID);
            return res.status(200).json({message: 'Tour status updated successfully'});
        });
    });
};

const createAdmin = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const role = 'admin';

    if (!name || !email || !password) {
        return res.status(400).json({error: 'All fields are required'});
    }

    bcrypt.hash(password, 10, (err, hashedpassword) => {
        if (err) {
            logger.log("Error in Hashing Password: " + err.message);
            return res.status(500).json({ message: "Error in Hashing Password"});
        }

        const query = `INSERT INTO Users (Name, Email, Password, Phone, Role) VALUES (?, ?, ?, ?, ?)`;
        const params = [name, email, hashedpassword, phone, role];

        db.run(query, params, function(err) {
            if (err) {
                logger.log("Error creating Admin: " + err.message);
                return res.status(500).json({error: 'Failed to create admin'});
            }

            logger.log("Admin created successfully: AdminID " + this.lastID);
            return res.status(201).json({message: 'Admin created successfully'});
            }
        );
    });
};

const deleteAdmin = (req, res) => {
    const {adminID} = req.params;   
    if (!adminID) {
        return res.status(400).json({error: 'Admin ID is required'});
    }

    const verifyQuery = 'SELECT * FROM Users WHERE UserID = ? AND Role = ?';

    db.get(verifyQuery, [adminID, 'admin'], (err, admin) => {
        if (err) {
            return res.status(500).json({error: 'Database error'});
        }

        if (!admin) {
            return res.status(404).json({error: 'Admin not found'});
        }

        const query = 'DELETE FROM Users WHERE UserID = ? AND Role = ?';

        db.run(query, [adminID, 'admin'], function(err) {
            if (err) {
                return res.status(500).json({error: 'Failed to delete admin'});
            }

            logger.log("Admin deleted successfully: AdminID " + adminID);
            return res.status(200).json({message: 'Admin deleted successfully'});
        });
    });
};


module.exports = {
    createTour,
    getAllToursAdmin,
    deleteTour,
    updateTourStatus,
    createAdmin,
    deleteAdmin
};

