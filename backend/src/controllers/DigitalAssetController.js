/*
filename: DigitalAssetController.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const Joi = require("joi");
const DigitalAssetService = require("./../services/DigitalAssetService")
const UserService = require("./../services/UserService")
const convertJoiValidationError = require("../utils/ConvertJoiValidationError");
const {InvalidResponseError} = require("web3")
exports.createDigitalAsset = async (req, res) => {
    // Accepts asset details from request body and user id from request object. 
    // Validates input and handles potential errors, including validation and web3-related errors.
    let newAsset; //variable to hold the new asset data.
    try {
        // Attempt to create a new digital asset with parameters from request.
        newAsset = await DigitalAssetService.createDigitalAsset(req.body.name,req.body.description,req.body.category,req.body.price,req.user.id,req.fileName)
    } catch (error) {
        if (error instanceof Joi.ValidationError) {
            return res.status(400).json({ //Joi validation error, return 400 status code
                status: "fail",
                message: convertJoiValidationError(error),
            });
        } else  if (error instanceof  InvalidResponseError) {
            return res.status(500).json({ //`InvalidResponseError` related to blockchain interaction
                status: "fail",
                message: "Web3.js: " + error.message,
            });
        }
        else {
            // Catch-all error handler.
            return res.status(500).json({
                status: "error",
                message: error,
            });
        }
    }
     // On success, return new asset data with a 200 status code.
    return res.status(200).json({
        status: "success",
        data: {
            digital_asset: newAsset
        },
    });

};

exports.getAllDigitalAssets = async (req, res) => {  // Attempt to retrieve all digital assets based on the query.
    let assets;
    try {
        assets = await DigitalAssetService.findDigitalAssets(req.query); // Fetch digital assets using the query parameters from the request object.
    } catch (error) { // Error handling: Manage specific errors first, then handle generic errors
        if (error instanceof Joi.ValidationError) {  // Validation Error: query parameters are invalid
            return res.status(400).json({
                status: "fail",
                message: convertJoiValidationError(error),
            });
        } else if (error instanceof  DigitalAssetService.DigitalAssetsNotFoundError) {
            return res.status(404).json({  // Not Found Error
                status: "fail",
                message: "There is no available assets. You can login and sell a new asset",
            });
        } else {
            return res.status(500).json({  // Generic Error: Handle any unexpected errors
                status: "error",
                message: error,
            });
        }
    }
    // Process the retrieved assets to ensure the image URLs are fully qualified.
    for (let row of assets) {
        if (row.image_name) {  // Construct a full URL for the image by appending the protocol, host, and image name.
            row.image_name =
                req.protocol + "://" + req.get("host") + "/" + row.image_name; 
        }
    }

    // Respond with a status of success and the retrieved assets in a structured JSON format
    return res.status(200).json({
        status: "success",
        data: {
            digital_assets: assets
        },
    });
};

exports.getOneDigitalAsset = async (req, res) => {
    let asset; //variable to hold the retrieved digital assets
    try {
        asset = await DigitalAssetService.findDigitalAssetById(req.params.id);
    } catch (error) {
        if (error instanceof DigitalAssetService.DigitalAssetsNotFoundError) { // Not Found Error
            return res.status(404).json({
                status: "fail",
                message: "Digital Asset not found"
            });
        } else {
            return res.status(500).json({ // Generic Error: Handle any unexpected errors
                status: "error",
                message: error
            });
        }
    }
// Process the retrieved asset to ensure the image URL is fully qualified.
    if (asset.image_name) {
        // Construct a full URL for the image by appending the protocol, host, and image name.
        asset.image_name =
            req.protocol + "://" + req.get("host") + "/" + asset.image_name;
    }
    // Respond with a status of success
    return res.status(200).json({
        status: "success",
        data: {
            digital_asset: asset,
        },
    });
};

exports.purchaseDigitalAsset = async (req, res) => {
    try { // Attempt to execute the purchase logic via DigitalAssetService using provided IDs.
        await DigitalAssetService.purchaseDigitalAsset(req.user.id,req.params.id)
    } catch (error) {
        if (error instanceof Joi.ValidationError) {
            return res.status(400).json({ // Validation Error: Return a 400 status code and the validation error message.
                status: "fail",
                message: convertJoiValidationError(error),
            });
        } else if (error instanceof DigitalAssetService.DigitalAssetsNotFoundError) { // Not Found Error
            return res.status(404).json({
                status: "fail",
                message: "Digital Asset not found",
            });
        } else if (error instanceof UserService.InvalidCredentialsError) {
            return res.status(400).json({ // Authentication Error: Notify the client if supplied credentials are invalid.
                status: "fail",
                message: "Invalid credentials",
            });
        } else if (error instanceof  DigitalAssetService.DigitalAssetNotAvailableError) {
            return res.status(400).json({ // Availability Error: Inform the client if the asset is not available for purchase.
                status: "fail",
                message: "Digital Asset not available",
            });
        } else if (error instanceof  DigitalAssetService.DigitalAssetIsOwnedByUserError) {
            return res.status(400).json({ // Ownership Error: Notify the client if they already own the asset
                status: "fail",
                message: "You already own the digital asset",
            });
        } else { // Generic Error: Return a 500 status code
            return res.status(500).json({
                status: "error",
                message: error
            });
        }
    }
    return res.status(200).json({ // Upon successful purchase, return a 200 status code
        status: "success"
    });
};
