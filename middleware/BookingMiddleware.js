const { parse } = require("dotenv");

const sanitizeInput = (value) => {
    if (typeof value !== 'string') return value;
    return value.replace(/'/g, "''");
};

const validateCreateBooking = (req, res, next) => {
    let {userID, tourID, numberOfTickets} = req.body;

    if (!userID || !tourID || !numberOfTickets) {
        return res.status(400).json({error: 'All fields are required'});
    }

    userID = parseInt(userID);
    tourID = parseInt(tourID);
    numberOfTickets = parseInt(numberOfTickets);

    if (isNaN(userID) || isNaN(tourID) || isNaN(numberOfTickets) || numberOfTickets <= 0) {
        return res.status(400).json({error: 'Invalid input data'});
    }

    req.body.userID = userID;
    req.body.tourID = tourID;
    req.body.numberOfTickets = numberOfTickets;
    next();
};

module.exports = {
    validateCreateBooking
};