const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 50 * 1000, // 15 minutes
    max: 10, // limit each IP to 1 request per windowMs
    message: 'Too many login attempts from this IP, please try again after 30 seconds',
});

module.exports = loginLimiter; 
