const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

// Admin Schema
const AdminSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Admin name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Admin email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [ /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address' ]
    },
    password: {
        type: String,
        required: [true, 'Admin password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    }
}, { 
    timestamps: true 
});

// Validation for Admin
const adminValidationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Admin name is required',
        'any.required': 'Admin name is required'
    }),
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.empty': 'Admin email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Admin email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Admin password is required',
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Admin password is required'
    })
});

// Export both the Admin model and the validation schema
module.exports = {
    AdminModel: mongoose.model('Admin', AdminSchema),
    validateAdmin: (data) => adminValidationSchema.validate(data)
};
