/*
filename: UserService.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const web3 = require("../smart-contracts/Web3Instance");
const User = require("../models/User");
const Joi = require("joi").extend(require('@joi/date'));
const DigitalAssetMarketContract = require("../smart-contracts/SmartContract");
const jwtUtils = require("../utils/JwtUtils");
const DigitalAssetService = require("../services/DigitalAssetService");

// Defining Joi validation schema for credit card information.
const creditCardValidation = Joi.object().keys({
    amount: Joi.number().precision(2).sign('positive').max(10).required(),
    card_number: Joi.string().creditCard().required().messages({
        'string.creditCard': 'Invalid credit card number',
    }),
    card_holder: Joi.string().min(3).required(),
    expiry_date: Joi.date().format('MM-YYYY').raw().required(),
    cvv: Joi.string().length(3).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'CVV must be 3 digits long',
        'string.pattern.base': 'CVV must contain only numbers',
    })
});


class CoinLimitReached extends Error {
    constructor() {
        super("Maximum coin limit reached. You must redeploy the project to reset the limit");
        this.name = "CoinLimitReached";
    }
}


class InvalidCredentialsError extends Error {
    constructor() {
        super("Invalid credentials"); // Providing a default error message.
        this.name = "InvalidCredentialsError"; // Specifying the error name, useful for error identification.
    }
}

class UserNotFound extends Error {
    constructor() {
        super("User Not Found"); // Providing a default error message.
        this.name = "UserNotFound"; // Specifying the error name, useful for error identification.
    }
}

// Creating a new user in the application and on the blockchain.
exports.createUser = async (first_name,last_name,email,password) => {
    const web3Account = web3.eth.accounts.create();  // Generating a new Web3 account for the user.
    // Create a new User object with provided data
    const user = new User(first_name,last_name,email,password,web3Account.privateKey,web3Account.address);

    let newUser = await User.createUser(user);// Adding the new user to the database and receiving the created user data.
    const accounts = await web3.eth.getAccounts();  // Getting Ethereum accounts from the Web3 instance.

    // Interacting with the blockchain to create a new user using the smart contract method, 
    // and sending the transaction from the first account available in the Web3 instance.
    await DigitalAssetMarketContract.methods.createUser(newUser.user_id, newUser.last_name, newUser.email, newUser.wallet_address).send({
        from: accounts[0],
        gas: 1000000
    });
// Returning the created user data and an access token for authenticating subsequent requests.
    return {
        user: newUser,
        access_token: jwtUtils.generateAccessToken(newUser.user_id,newUser.email)
    }
}

exports.login = async (email,password) => { // Authenticating a user with email and password.
    let credentials = {email,password}
 // Validating the credentials: ensuring the email format is correct and the password has a minimum length of 8 characters
    await Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
    }).validateAsync(credentials);
 // Fetching user data from the database using the provided email.
    let users = await User.findUserByEmail(email)

    if (users.length === 0 || users[0].password !== password) { // If no user is found, or the password is incorrect, throw an error.
        throw new InvalidCredentialsError();
    }
// If authentication is successful, generate and return an access token.
    const user = users[0];
    return jwtUtils.generateAccessToken(user.user_id, user.email)

}
// Fetching a user by ID from the database.
exports.findUserById = async (id) => {

    let users = await User.findUserById(id);

    if (users.length === 0) { // If no user is found, throw a user not found error.
        throw new UserNotFound();
    }
// Return the found user data.
    return users[0];
}
// Retrieving a user profile by ID and masking sensitive information.
exports.findProfileById = async (id) => {
    let user = await exports.findUserById(id);// Utilizing the previously defined function to get user data.
    user.private_key = undefined;
    try {  // Attempting to retrieve the digital assets owned by the user.
        user.digital_assets = await DigitalAssetService.findDigitalAssets({"owner_id": id})
    } catch (error) { // Handling no digital assets found scenario
        if (error instanceof DigitalAssetService.DigitalAssetsNotFoundError) {
            user.digital_assets = []
        } else { //other errors
            throw error;
        }
    }

    return user;
}

exports.getBalanceByUserId = async (id) => { // Fetching the Ethereum balance of a user by ID.
    const user = await exports.findUserById(id);
     // Retrieving and converting the balance from Wei to Ether, then returning it.
    return Number(web3.utils.fromWei(await web3.eth.getBalance(user.wallet_address),"ether"));
}
// Depositing cryptocurrency to a user’s wallet after validating their credit card information.
exports.depositCoinsToUserBalance = async (user_id,creditCardData) => {
    await creditCardValidation.validateAsync(creditCardData); // Validate credit card data
    const user = await exports.findUserById(user_id); // Retrieve user by ID
    const accounts = await web3.eth.getAccounts(); // Get blockchain accounts
    let account_number = 0;
    while (true) {
        if (account_number === 10) {
            throw new CoinLimitReached(); // Limit accounts used to 10
        }
        try {
            await web3.eth.sendTransaction({
                from: accounts[account_number],
                to: user.wallet_address, // Send to user wallet
                value: web3.utils.toWei(creditCardData.amount,"ether"),  // Convert to Wei and send
            });
            return;
        } catch (error) {
            if (error.reason.includes("insufficient balance")) {
                account_number++; // Try next account on insufficient balance
            } else {
                throw error;// Throw on other errors
            }
        }
    }

}

// Exposing errors to be utilized in other modules.
exports.InvalidCredentialsError = InvalidCredentialsError;
exports.UserNotFound = UserNotFound;
exports.CoinLimitReached = CoinLimitReached;

