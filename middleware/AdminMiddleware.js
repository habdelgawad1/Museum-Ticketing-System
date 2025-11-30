const sanitizeInput = (value) => {
    if (typeof value !== 'string') return "";
    return value.trim().replace(/'/g, "''");
}

const validateCreateTour = (req, res, next) => {
    const { guideID, title, description, startTime, endTime, date, maxParticipants, price, language } = req.body;

    if (!guideID || !title  || !startTime || !endTime || !date || !maxParticipants || !price || !language) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    guideID = sanitizeInput(guideID);
    title = sanitizeInput(title);
    description = sanitizeInput(description || "");
    startTime = sanitizeInput(startTime);
    endTime = sanitizeInput(endTime);
    date = sanitizeInput(date);
    maxParticipants = parseInt(maxParticipants, 10);
    price = parseFloat(price);
    language = sanitizeInput(language);

    if (isNaN(maxParticipants) || isNaN(price)) {
        return res.status(400).json({ error: 'Invalid number format for maxParticipants or price' });
    }

    req.body = { guideID, title, description, startTime, endTime, date, maxParticipants, price, language };
    next();

};

module.exports = {
    validateCreateTour
};