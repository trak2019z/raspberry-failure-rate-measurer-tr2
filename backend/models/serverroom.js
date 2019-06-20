//-- Requires --//
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//-- Schema --//
const serverRoomSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true }
});

serverRoomSchema.plugin(uniqueValidator);

//-- Exports --//
module.exports = mongoose.model("ServerRoom", serverRoomSchema);