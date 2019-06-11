//-- Requires --//
const mongoose = require("mongoose");

//-- Schema --//
const preferencesSchema = mongoose.Schema({
    serverRoomName: { type: String, required: true },
    minimumTemperature: { type: Number },
    maximumTemperature: { type: Number },
    minimumHumidity: { type: Number },
    maximumHumidity: { type: Number },
});

//-- Exports --//
module.exports = mongoose.model("Preferences", preferencesSchema);