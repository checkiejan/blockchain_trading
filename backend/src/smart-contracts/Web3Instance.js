/*
filename: Web3Instance.js
Author: Dang Khanh Toan Nguyen
StudentId: 103797499
last date modified: 15/10/2023
*/
const {networks} = require("./../../truffle-config");
const { Web3 } = require('web3');

// Connect to the Ethereum network using the HTTP provider
const ganacheUrl = 'http://' + networks.development.host + ":" + networks.development.port;
const httpProvider = new Web3.providers.HttpProvider(ganacheUrl);
module.exports = new Web3(httpProvider);