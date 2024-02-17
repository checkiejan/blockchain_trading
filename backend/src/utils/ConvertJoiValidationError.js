/*
filename: ConvertJoiValidationError.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
module.exports = (error) => { 
    // Export a function that takes an error object, removes quotes from each error message, 
    // and concatenates them into a single string, separated by commas and spaces.
    return error.details.map(err => err.message.replace(/"/g,'')).join(", "); 
}