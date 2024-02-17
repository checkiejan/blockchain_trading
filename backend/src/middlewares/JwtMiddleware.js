/*
filename: JwtMiddleware.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const jwt = require('jsonwebtoken');
const TOKEN_SECRET = require("./../configs/JwtConfig").TOKEN_SECRET;

exports.authenticateToken = (req, res, next) => {
    // Purpose: To authenticate a JWT token contained in the request's Authorization header,
    // thereby verifying the legitimacy of the requesting user and facilitating secure access control.
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Extract token from 'authorization' header and verify its validity. 

    if (token == null) return res.status(401).json({  // Reject if token is absent.
        status: "fail",
        message: "Access token is missing"
    })

    jwt.verify(token, TOKEN_SECRET, (err, user) => { 
        console.log(err)
        if (err) return res.status(403).json({ // Reject if token is invalid.
            status: "fail",
            message: "Invalid access token"
        })
// Attach user to request object and proceed to next middleware.
        req.user = user
        console.log(req.user)
        next()
    })
}

