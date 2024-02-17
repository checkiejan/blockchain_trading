/*
filename: AuthenticationController.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const UserService = require("./../services/UserService");
const Joi = require("joi");
const convertJoiValidationError = require("./../utils/ConvertJoiValidationError")
exports.register = async (req,res) => { //handles user registration
    let userData;
    try {
        //create a user using the UserService and request body data.
        userData = await UserService.createUser(req.body.first_name,req.body.last_name,req.body.email,req.body.password)
    } catch (error) {
        if (error instanceof Joi.ValidationError) { //if error, check its type
            return res.status(400).json({
                status: "fail",
                message: convertJoiValidationError(error), // Handle Joi validation errors.
            });
        }

        if (error.code === "ER_DUP_ENTRY") { // Handle errors related to duplicate email
            return res.status(400).json({
                status: "fail",
                message: "An user with the email already exists"
            })
        } else { // Handle all other errors by returning a 500 status
            return res.status(500).json({
                status: "error",
                message: error
            })
        }
    }
    return res.status(200).json({ // If user creation is successful, return a 200 status
        status: "success",
        data : {
            userData
        }
    })
}


exports.login = async (req,res) => { //handle user login.
    let accessToken;
    try { //try to log the user in using the UserService and request body data
        accessToken = await UserService.login(req.body.email,req.body.password);
    } catch (error) {
        if (error instanceof Joi.ValidationError) { // Handle Joi validation errors.
            return res.status(400).json({
                status: "fail",
                message: convertJoiValidationError(error),
            });
        }
        else if (error instanceof UserService.InvalidCredentialsError) { // Handle errors related to invalid user credentials.
            return res.status(404).json({
                status: "error",
                message: "Invalid credentials"
            })
        } else {
            return res.status(500).json({ // Handle all other errors
                status: "error",
                message: error
            })
        }

    }

    return res.status(200).json({ // If login is successful, return a 200 status
        status: "success",
        data : {
            access_token: accessToken
        }
    })
}