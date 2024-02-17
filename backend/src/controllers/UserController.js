/*
filename: UserController.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const User = require("./../models/User");
const web3 = require("./../smart-contracts/Web3Instance");
const UserService = require("./../services/UserService");
const Joi = require("joi");
const convertJoiValidationError = require("../utils/ConvertJoiValidationError");

exports.getProfile =  async (req, res) => {
    // Retrieve and return the profile of the authenticated user, along with their digital assets,
    // while also handling potential retrieval errors and enhancing image asset URLs.
    let userProfile;
    try { // Attempt to retrieve the user profile using the user ID embedded in the request object.
        userProfile = await UserService.findProfileById(req.user.id);
    } catch (error) {
        if (error instanceof UserService.UserNotFound) { // User Not Found Error: Return a 404 status code
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            })
        } else { // Generic Error: Return a 500 status code
            return res.status(500).json({
                status: "error",
                message: error
            })
        }
    }
    for (let row of userProfile.digital_assets) {
        if (row.image_name) { // Construct the full URL using the request protocol and host, concatenated with the image name.
            row.image_name =
                req.protocol + "://" + req.get("host") + "/" + row.image_name;
        }
    }
    return res.status(200).json({ //return a 200 status code and the data.
        status: "success",
        data : {
            user: userProfile
        }
    })
}

exports.getBalance =  async (req, res) => {
    // Purpose: Retrieve and return the current balance of the authenticated user
    // while also handling possible retrieval errors.
   let balance;
   try { // Attempt to retrieve the user's balance using their ID embedded in the request object.
       balance = await UserService.getBalanceByUserId(req.user.id);
   } catch (error) {
       if (error instanceof UserService.UserNotFound) {// User Not Found Error
           return res.status(404).json({
               status: "fail",
               message: "User not found"
           })
       } else { // Generic Error
           return res.status(500).json({
               status: "error",
               message: error
           })
       }
   }
    // Upon successful retrieval of the balance, send it back with a 200 status code.
    return res.status(200).json({
        status: "success",
        data : {
            balance
        }
    })
}

exports.depositCoins =  async (req, res) => {
    // Purpose: Deposit a specified number of coins to the authenticated user's balance,
    // managing potential deposit-related and input validation errors.
    try {// Attempt to deposit coins by utilizing the user ID from the request object and the body payload.
        await UserService.depositCoinsToUserBalance(req.user.id,req.body);
    } catch (error) {
        if (error instanceof Joi.ValidationError) { // Input Validation Error: Inform the client about invalid input
            return res.status(400).json({
                status: "fail",
                message: convertJoiValidationError(error),
            });
        } else if (error instanceof UserService.UserNotFound) {
            return res.status(404).json({ // User Not Found Error
                status: "fail",
                message: "User not found"
            })
        } else if (error instanceof  UserService.CoinLimitReached) {
            return res.status(400).json({
                status: "fail",
                message: error.message
            })
        } else {
            return res.status(500).json({
                status: "error",
                message: error
            })
        }
    }
    // Upon successful deposit, affirm the operation to the client with a 200 status code.
    return res.status(200).json({
        status: "success"
    })

}