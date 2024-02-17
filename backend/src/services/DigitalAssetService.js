/*
filename: DigitalAssetService.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const DigitalAsset = require("../models/DigitalAsset");
const Joi = require("joi").extend(require("@joi/date"));
const DigitalAssetMarketContract = require("../smart-contracts/SmartContract");
const web3 = require("../smart-contracts/Web3Instance");
const User = require("../models/User");
const TransactionService = require("../services/TransactionService");
const {InvalidCredentialsError} = require("./UserService")

// Define a validation schema using Joi to validate query parameters.
const queryValidationSchema = Joi.object({
    max: Joi.number(),
    min: Joi.number(),
    start: Joi.date().format("YYYY-MM-DD").raw(),
    end: Joi.date().format("YYYY-MM-DD").raw(),
    category: Joi.string().max(255).truncate().trim(),
    name: Joi.string().max(255).truncate().trim(),
    owner_id: Joi.number(),
    availability: Joi.boolean()
});
// Custom error classes to handle specific error scenarios related to digital assets.
class DigitalAssetsNotFoundError extends Error {
    constructor() {
        super("Digital Assets not found");
        this.name = "DigitalAssetsNotFound";
    }
}

class DigitalAssetNotAvailableError extends Error {
    constructor() {
        super("Digital Assets not available");
        this.name = "DigitalAssetNotAvailableError";
    }
}

class DigitalAssetIsOwnedByUserError extends Error {
    constructor() {
        super("You already own the asset");
        this.name = "DigitalAssetIsOwnedByUserError";
    }
}

exports.createDigitalAsset = async (name, description, category, price, owner_id, image_name) => {
// Initialize a new DigitalAsset instance
    const digitalAsset = new DigitalAsset(name, description, category, price, owner_id, image_name);
// Store the asset in the database and retrieve it back to gain any additional properties  set upon creation.
    let newAsset = await DigitalAsset.createDigitalAsset(digitalAsset);

 // Register the asset on the blockchain
    await DigitalAssetMarketContract.methods
        .createDigitalAsset(
            newAsset.asset_id,
            newAsset.owner_id,
            newAsset.name,
            newAsset.description,
            web3.utils.toWei(newAsset.price, "ether"),
            newAsset.category,
        )
        .send({ from: (await web3.eth.getAccounts())[0], gas: 1000000 });

    return newAsset;
}

exports.findDigitalAssetById = async (digitalAssetId) => {
 // Fetch the asset from the database using its ID
    let assets = await DigitalAsset.findDigitalAssetById(digitalAssetId);

 // Check if the asset was found, throw an error otherwise
    if (assets.length === 0) {
        throw new DigitalAssetsNotFoundError();
    }
 // Return the found asset
    return assets[0];
}

exports.findDigitalAssets = async (query) => {
    let validatedQuery = await queryValidationSchema.validateAsync(query);// Validate the query against a predefined schema

    let assets = await DigitalAsset.getAllDigitalAssets(validatedQuery); // Retrieve digital assets based on the validated query.

    if (assets.length === 0) { // Check if any assets are found, otherwise throw a custom error
        throw new DigitalAssetsNotFoundError();
    }

    for (const row of assets) {
        row.is_available = Boolean(Number(row.is_available));// Ensure 'is_available' field is a boolean
    }

    return assets;
}
exports.purchaseDigitalAsset = async (buyer_id,asset_id) => {
    // Attempt to find the desired asset in the database using its ID.
    let assets = await DigitalAsset.findDigitalAssetById(asset_id);

    if (assets.length === 0) { // Check if asset exists, if not, throw an error.
        throw new DigitalAssetsNotFoundError();
    }

    let asset = assets[0];

    let users = await User.findUserById(buyer_id);  // Validate the buyer's existence in the database.

    if (users.length === 0) { // Check if user exists, if not, throw an error.
        throw new InvalidCredentialsError();
    }

    let user = users[0];

    let seller_id = asset.owner_id;
    let userWallet = user.wallet_address;

    if (buyer_id === seller_id) { // Ensure that the buyer does not already own the asset.
        throw new DigitalAssetIsOwnedByUserError();
    }

    if (!asset.is_available) { // Check if the asset is available for purchase.
        throw new DigitalAssetNotAvailableError();
    }
// Create a transaction object to handle the purchase of the digital asset on the blockchain.
    let tx = {
        from: userWallet,
        to: DigitalAssetMarketContract.options.address,
        data: await DigitalAssetMarketContract.methods
            .purchaseDigitalAsset(asset_id)
            .encodeABI(),
        value: web3.utils.toWei(asset.price, "ether"),
        gasLimit: 600000,
        gasPrice: await web3.eth.getGasPrice(),
    };

 // Sign the transaction with the buyer's private key, ensuring they have authorized the purchase.
    let signedTx = await web3.eth.accounts.signTransaction(
        tx,
        user.private_key,
    );
    // Execute the transaction on the blockchain and retrieve its hash for record-keeping.
    let transaction_hash = (await web3.eth.sendSignedTransaction(signedTx.rawTransaction)).transactionHash;

    await DigitalAsset.updateOwnership(asset_id,buyer_id); // Update the ownership of the digital asset in the database to reflect the new owner.
// Record the transaction details in the database 
    await TransactionService.createTransaction(
        transaction_hash,
        buyer_id,
        seller_id,
        asset_id,
    );
}
// Export custom errors to allow them to be used in other modules.
exports.DigitalAssetsNotFoundError = DigitalAssetsNotFoundError;
exports.DigitalAssetNotAvailableError = DigitalAssetNotAvailableError;
exports.DigitalAssetIsOwnedByUserError = DigitalAssetIsOwnedByUserError;