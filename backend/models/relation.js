//-- Requires --//
const mongoose = require("mongoose");

//-- Schema --//
const relationSchema = mongoose.Schema({
    accountId: { type: String, required: true },
    serverRoomName: { type: String, required: true },
    serverRoomAddress: { type: String },
    serverRoomCity: { type: String }
});

//-- Exports --//
module.exports = mongoose.model("Relation", relationSchema);