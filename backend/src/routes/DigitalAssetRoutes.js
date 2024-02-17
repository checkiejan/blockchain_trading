/*
filename: DigitalAssetRoutes.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const express = require("express");
const digitalAssetController = require("./../controllers/DigitalAssetController");
const JwtMiddleware = require("./../middlewares/JwtMiddleware");
const multerMiddleware = require("./../middlewares/MulterMiddleware");

const router = express.Router();

router.route("/")
    .get(digitalAssetController.getAllDigitalAssets) // Retrieve all digital assets
    .post(JwtMiddleware.authenticateToken, // JWT authentication
            multerMiddleware, // File upload middleware
            digitalAssetController.createDigitalAsset); // Create a new digital asset

router.route("/:id")
    .get(digitalAssetController.getOneDigitalAsset) // Retrieve a specific digital asset by ID

router.route("/:id/purchase") // Purchase a specific digital asset by ID
    .post(JwtMiddleware.authenticateToken,digitalAssetController.purchaseDigitalAsset)

module.exports = router;