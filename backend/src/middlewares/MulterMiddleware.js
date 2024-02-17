/*
filename: MulterMiddleware.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const multer = require("multer");
const {v4: uuidv4} = require("uuid");
const path = require("path");
const checkFileType = require("../utils/FileTypeCheck");

const storageEngine = multer.diskStorage({
    // Configure file storage: path and filename using current time and UUID.
    destination: "./upload",
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}--${uuidv4()}`+path.extname(file.originalname);
        req.fileName = fileName; // Store filename in request object.
        cb(null, fileName);
    },
});



const upload = multer({
    storage: storageEngine,
    fileFilter: (req, file, cb) => { // Validate file type during upload using a custom utility.
        checkFileType(file, cb);
    },
}).single("image"); // Allow upload of a single file with field name 'image'.


module.exports = (req, res, next) => {
 // Utilize configured 'upload' to manage incoming file and handle errors.
    upload(req, res, function (err) {
        if (err) {
            res.status(400).json({ // If an error occurs, respond with error message.
                status: "fail",
                message: err
            })
        } else { // On successful file upload, move to next middleware.
            next();
        }

    })
}