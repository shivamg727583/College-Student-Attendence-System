// models/ActivityLog.js
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    teacher_name: { type: String, required: true },
    class_name: { type: String, required: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    present_students: { type: Number, required: true },
    absent_students: { type: Number, required: true },
    total_students: { type: Number, required: true },
    date: { type: Date, default: Date.now }, // Timestamp of the activity
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
