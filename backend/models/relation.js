//-- Requires --//
const mongoose = require("mongoose");

//-- Schema --//
const relationSchema = mongoose.Schema({
    accountId: { type: String, required: true },
    serverRoomName: { type: String, required: true }
});

//-- Exports --//
module.exports = mongoose.model("Relation", relationSchema);