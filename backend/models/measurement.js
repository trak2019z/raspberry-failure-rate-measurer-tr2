//-- Requires --//
const mongoose = require("mongoose");

//-- Schema --//
const measurementSchema = mongoose.Schema({
    serverRoom: { type: String, required: true },
    date: { type: String },
    realDate: { type: Date},
    temperature: { type: String },
    humidity: { type: String },
});

//-- Exports --//
module.exports = mongoose.model("Measurement", measurementSchema);