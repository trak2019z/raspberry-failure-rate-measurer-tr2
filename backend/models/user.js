//-- Requires --//
const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

//-- Schema --//
const userSchema = mongoose.Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Number },
    isActive: { type: Number }
});

//-- Exports --//
module.exports = mongoose.model("User", userSchema);