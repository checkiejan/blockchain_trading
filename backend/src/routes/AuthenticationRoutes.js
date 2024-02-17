/*
filename: AuthenticationRoutes.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const express = require("express");
const authenticationController = require("./../controllers/AuthenticationController");
const router = express.Router(); // Router Initialization

router.route("/register") // Registration Route
    .post(authenticationController.register)

router.route("/login") // Login Route
    .post(authenticationController.login)

// Exporting Router
module.exports = router;