const jwt = require('jsonwebtoken');
const { AdminModel } = require('../models/Admin-model');

async function auth(req, res, next) {
    const token = req.cookies.Admintoken;

    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const admin = await AdminModel.findById(decoded.id).select('-password');
       
        if (!admin) return res.status(401).send('Invalid token.');

        // Attach the admin information to the request object
        req.admin = admin; // Change to admin object instead of decoded payload

        next(); // Proceed to the next middleware or route handler
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = auth;
