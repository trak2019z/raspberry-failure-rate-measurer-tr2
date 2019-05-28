//--- Requires ---//
const express = require("express");
const mongoose = require("mongoose");
// const path = require("path");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");

const app = express();

//--- DB Connection ---//
mongoose.connect("mongodb+srv://fkuca:1qazxsw2@cluster0-4lwuv.mongodb.net/rfrm?retryWrites=true")
  .then(() => {
    console.log('Connected');
  })
  .catch(() => {
    console.log('Error');
  });

//--- Methods ---/
app.use(bodyParser.json());

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
})

app.use("/api/auth", authRoutes);
//

//--- Exports ---//
module.exports = app;
