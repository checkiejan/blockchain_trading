/*
filename: DB.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const mysql = require("mysql");
const dbConfig = require("../configs/DBConfig");
// Creating a connection to the MySQL database using the configuration.
const dbConnection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    dateStrings: dbConfig.DATE_STRINGS
});
// Establishing the connection to the database.
dbConnection.connect(err => {
    if (err) throw err; //throw error if there is one
    console.log("Successfully connected to the database.");
});

// Exposing the database connection to be utilized by other modules in the application.
module.exports = dbConnection;