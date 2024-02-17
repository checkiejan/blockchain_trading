/*
filename: SmartContract.js
Author: Dang Khanh Toan Nguyen
StudentId: 103797499
last date modified: 15/10/2023
*/
const web3 = require("./Web3Instance");
const fs = require("fs");
const path = require("path");
const details = path.resolve(__dirname, 'ContractDetails.json');

const {abi,address} = JSON.parse(fs.readFileSync(details, 'utf8')); // Parse and destructure contract ABI and address from file
module.exports = new web3.eth.Contract(abi,address); // Export a new contract instance with parsed ABI and address

