const jwt = require('jsonwebtoken');
const { TeacherModel } = require('../models/Teacher-model');

async function TeacherAuth(req, res, next) {
    const token = req.cookies.Teachertoken;

    if (!token){
        req.flash('error',"Invalid token.")
        return res.status(401).redirect('/api/teachers/login')
        };

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const teacher = await TeacherModel.findById(decoded._id).select('-password');
       
        if (!teacher) return res.status(401).send('Invalid token.');

        // Attach the teacher information to the request object
        req.teacher = teacher; // Change to admin object instead of decoded payload

        next(); // Proceed to the next middleware or route handler
    } catch (ex) {
        req.flash('error',"Invalid token.")
     res.status(401).redirect('/api/teachers/login')
    }
}

module.exports = TeacherAuth;
