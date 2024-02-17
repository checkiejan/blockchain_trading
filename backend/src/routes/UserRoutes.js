/*
filename: UserRoutes.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const express = require("express");
const transactionController = require("./../controllers/TransactionController");
const userController = require("./../controllers/UserController");
const JwtMiddleware = require("./../middlewares/JwtMiddleware");

const router = express.Router();

// User transaction routes
router.route("/profile/transactions")
    .get(JwtMiddleware.authenticateToken,transactionController.getAllTransactions);

// User profile routes
router.route("/profile")
    .get(JwtMiddleware.authenticateToken,userController.getProfile);

// User balance routes
router.route("/balance")
    .get(JwtMiddleware.authenticateToken,userController.getBalance)
    .put(JwtMiddleware.authenticateToken,userController.depositCoins);




module.exports = router;