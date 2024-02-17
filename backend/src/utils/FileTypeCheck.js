/*
filename: FileTypeCheck.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const path = require('path');

// Validates whether a provided file is an image based on its extension and MIME type.
// If valid, invokes the callback (cb) with null and true, otherwise invokes cb with an error message.
module.exports = function (file, cb) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;

    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("The provided file is not an image");
    }
};

