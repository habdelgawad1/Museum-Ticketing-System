const setSecurityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');

    res.setHeader('X-Frame-Options', 'DENY');  

    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';");
    
    next();
};

module.exports = setSecurityHeaders;