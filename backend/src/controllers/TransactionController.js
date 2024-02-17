/*
filename: TransactionController.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const TransactionService = require("./../services/TransactionService");
const Joi = require("joi");
const convertJoiValidationError = require("../utils/ConvertJoiValidationError");

exports.getAllTransactions = async (req,res) => { 
    // Retrieve all transactions related to the authenticated user and handle potential errors during retrieval.
    let transactions; 
    try {
        // Attempt to fetch transactions related to the user ID contained within the request object.
        transactions = await TransactionService.findTransactionsByUserId(req.user.id);
    } catch (error) {
        if (error instanceof Joi.ValidationError) {  // Validation Error: Return a 400 status code
            return res.status(400).json({
                status: "fail",
                message: convertJoiValidationError(error),
            });
        } else { // Generic Error: Return a 500 status 
            return res.status(500).json({
                status: "error",
                message: error
            })
        }
    }
    // Upon successful retrieval of transactions, return a 200 status code along with the fetched data.
    return res.status(200).json({
        status: "success",
        data: {
            transactions: transactions
        }
    })
}