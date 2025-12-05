const {db} = require('../config/db');

const getAllTours = (req, res) => {
    const query = `SELECT * FROM tours WHERE TourStatus = ? ORDER BY Date ASC, StartTime ASC`;
    const params = ['scheduled'];

    db.all(query, params, (err, rows) => {
        if (err) {
            logger.error("Error Retrieving Scheduled Tours: " + err);
            console.error(err.message);
            return res.status(500).json({ error: 'Error Retrieving Tours' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No Scheduled Tours Found' });
        }
        logger.log("Scheduled Tours retrieved successfully");
        return res.status(200).json({
            message: 'Scheduled Tours Retrieved Successfully',
            count: rows.length,
            tours: rows
        });
    });
};

const getTourById = (req, res) => {
    const tourID = req.params.id;

    if (!tourID) {
        return res.status(400).json({ error: 'Tour ID is required' });
    }

    const query = `SELECT * FROM tours WHERE TourID = ?`;
    const params = [tourID];

    db.get(query, params, (err, row) => {
        if (err) {
            logger.error("Error Retrieving Tour: " + err);
            console.error(err.message);
            return res.status(500).json({ error: 'Error Retrieving Tour' });
        }

        if (!row) {
            return res.status(404).json({ message: 'Tour Not Found' });
        }
        logger.log(`Tour retrieved successfully: TourID ${tourID}`);
        return res.status(200).json({
            message: 'Tour Retrieved Successfully',
            tour: row
        });
    });
};

const getToursByGuide = (req, res) => {
    const guideID = req.params.guideId;

    if (!guideID) {
        return res.status(400).json({ error: 'Guide ID is required' });
    }

    const verifyQuery = `SELECT UserID, Role FROM Users WHERE UserID = ?`;

    db.get(verifyQuery, [guideID], (err, user) => {
        if (err) {
            logger.error("Error Verifying Guide: " + err);
            console.error(err.message);
            return res.status(500).json({ error: 'Error Verifying Guide' });
        }

        if (!user) {
            return res.status(404).json({ message: 'Guide Not Found' });
        }

        if (user.Role !== 'guide') {
            return res.status(403).json({ message: 'User is not a Guide' });
        }

        const query = `SELECT * FROM tours WHERE GuideID = ? ORDER BY Date ASC, StartTime ASC`;
        
        db.all(query, [guideID], (err, rows) => {
            if (err) {
                logger.error("Error Retrieving Tours for GuideID " + guideID + ": " + err);
                console.error(err.message);
                return res.status(500).json({ error: 'Error Retrieving Tours' });
            }

            if (rows.length === 0) {
                return res.status(404).json({ message: 'No Tours Found for this Guide' });
            }
            logger.log(`Tours retrieved successfully for GuideID ${guideID}`);
            return res.status(200).json({
                message: 'Tours Retrieved Successfully',
                count: rows.length,
                tours: rows
            });
        });
    });
};

module.exports = {
    getAllTours,
    getTourById,
    getToursByGuide
};

