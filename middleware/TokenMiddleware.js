const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        logger.log('No token provided');
        return res.status(401).json({ message: 'Access Denied, No token provided' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        logger.log(`Token verified for user: ${decoded.userID}, role: ${decoded.role}`);
        next();
    } catch (error) {
        logger.log('Invalid token: ' + error.message);
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        logger.log(`Admin access denied for user: ${req.user?.userID}, role: ${req.user?.role}`);
        return res.status(403).json({ message: 'Admin access required' });
    }
};

const isOwner = (req, res, next) => {
    const resourceOwnerId = req.params.userID || req.body.userID;
    
    const tokenUserId = parseInt(req.user.userID);
    const resourceId = parseInt(resourceOwnerId);
    
    if (req.user && tokenUserId === resourceId) {
        next();
    } else {
        logger.log(`Owner access denied. Token userID: ${tokenUserId}, Resource userID: ${resourceId}`);
        return res.status(403).json({ message: 'Owner access required' });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isOwner
};