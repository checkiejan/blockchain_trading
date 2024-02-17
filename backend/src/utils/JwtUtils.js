/*
filename: JwtUtils.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const jwt = require('jsonwebtoken');
const TOKEN_SECRET = require("./../configs/JwtConfig").TOKEN_SECRET;
// Generate and return a JWT with the provided user ID and email, expiring in 7 days.
exports.generateAccessToken = (id,email) => {
    return jwt.sign({id: id, email: email}, TOKEN_SECRET, { expiresIn: '7d' });
}

