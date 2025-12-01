const { parse } = require("dotenv");

const sanitizeInput = (value) => {
    if (typeof value !== 'string') return value;
    return value.replace(/'/g, "''");
};

const validateCreateBooking = (req, res, next) => {
    let {userID, TourID, NumberOfTickets} = req.body;

    if (!userID || !TourID || !NumberOfTickets) {
        return res.status(400).json({error: 'All fields are required'});
    }

    userID = parseInt(userID);
    TourID = parseInt(TourID);
    NumberOfTickets = parseInt(NumberOfTickets);

    if (isNaN(userID) || isNaN(TourID) || isNaN(NumberOfTickets) || NumberOfTickets <= 0) {
        return res.status(400).json({error: 'Invalid input data'});
    }

    req.body.userID = userID;
    req.body.TourID = TourID;
    req.body.NumberOfTickets = NumberOfTickets;
    next();
};

module.exports = {
    validateCreateBooking
};