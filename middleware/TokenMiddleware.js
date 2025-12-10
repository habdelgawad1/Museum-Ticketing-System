const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        logger.log('No token provided');
        return res.status(401).json({ message: 'Access Denied, No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        logger.log('Invalid token');
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.Role === 'admin') {
        next();
    } else {
        logger.log('Admin access required');
        return res.status(403).json({ message: 'Admin access required' });
    }
};

const isOwner = (req, res, next) => {
    const resourceOwnerId = req.params.userID || req.body.userID;
    if (req.user && req.user.UserID === resourceOwnerId) {
        next();
    } else {
        logger.log('Owner access required');
        return res.status(403).json({ message: 'Owner access required' });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isOwner
};