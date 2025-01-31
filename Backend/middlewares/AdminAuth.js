const jwt = require("jsonwebtoken");
const { AdminModel } = require("../models/Admin-model");

async function auth(req, res, next) {
    // Get token from headers instead of cookies
    const token = req.header("Authorization")?.replace("Bearer ", ""); 

    if (!token) {
        console.log("Token not found");
        return res.status(401).json({ error: "Unauthorized: No token provided" }); // ❌ No Redirect
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const admin = await AdminModel.findById(decoded.id).select("-password");

        if (!admin) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        req.admin = admin;
        next(); // Proceed to next middleware
    } catch (ex) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}

module.exports = auth;
