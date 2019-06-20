//--- Requires ---//
const express = require("express");
const AuthController = require("../controllers/auth");

const router = express.Router();

//--- Methods ---/
router.post("/signup", AuthController.createUser);
router.post("/login", AuthController.loginUser);

//--- Exports ---//
module.exports = router;
