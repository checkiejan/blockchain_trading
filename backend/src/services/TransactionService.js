/*
filename: TransactionService.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const Transaction = require("./../models/Transaction")
exports.createTransaction = async (transaction_hash,buyer_id,seller_id,asset_id) => {
     // Create a new Transaction object with provided parameters.
    let transaction = new Transaction(transaction_hash,buyer_id,seller_id,asset_id); 

     // Invoke a model function to insert the new transaction into the database.
    let newTransaction = await Transaction.createTransaction(transaction);

    // Return the transaction object
    return newTransaction;
}
//a function to retrieve transactions associated with a specific user.
exports.findTransactionsByUserId = async (user_id) => {
    // Use a model function to retrieve all transactions related to the given user from the database.
    let transactions = await Transaction.getAllTransactions(user_id);
     // Return the array of transaction objects
    return transactions;
}