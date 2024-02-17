/*
filename: Transaction.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const db = require("./DB");
const Joi = require("joi");
class Transaction {
    constructor(transaction_hash,buyer_id,seller_id,asset_id) {
        // Initializing properties for the Transaction instance.
        this.transaction_hash = transaction_hash;
        this.buyer_id = buyer_id;
        this.seller_id = seller_id;
        this.asset_id = asset_id;
    }

    static getValidationSchema = () => Joi.object({
        // Returning a Joi object schema for transaction data validation
        transaction_hash: Joi.string().required(),
        buyer_id: Joi.number().sign("positive").required(),
        seller_id: Joi.number().sign("positive").required(),
        asset_id: Joi.number().sign("positive").required(),
    })

    static createTransaction(transaction, callback) {
        return new Promise(async (resolve,reject) => {
            // Creating a copy of the transaction object to avoid mutation.
            let newTransaction = {...transaction};
            try { // Validating the new transaction data using Joi schema.
                await Transaction.getValidationSchema().validateAsync(newTransaction);
            } catch (error) {
                return reject(error);// Handling validation error and rejecting the promise.
            }
            // Inserting new transaction into the database.
            db.query("INSERT INTO Transactions SET ?", newTransaction,
                async (err, res) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    return resolve({ id: res.insertId, ...newTransaction });
            })
        })

    }

    static getAllTransactions(user_id,callback) {
        // SQL query string to fetch transactions involving the specified user.
        return new Promise((resolve,reject) => {
            db.query(`SELECT
                    t.transaction_hash,
                    CONCAT(b.first_name,' ',b.last_name) AS buyer_name,
                    CONCAT(s.first_name,' ',s.last_name) AS seller_name,
                    a.name AS asset_name,
                    a.price AS asset_price,
                    t.purchase_date
                FROM
                    Transactions t
                INNER JOIN
                    DigitalAssets a ON t.asset_id = a.asset_id
                INNER JOIN
                    Users s ON t.seller_id = s.user_id
                INNER JOIN
                    Users b ON t.buyer_id = b.user_id
                WHERE
                    b.user_id = ${user_id}
                OR 
                    s.user_id = ${user_id}`,
                (err, res) => {
                    if (err) { // Error handling
                        console.log(err);
                        return reject(null);
                    }
                    return resolve(res);
                })
        })
    }



}

module.exports = Transaction;