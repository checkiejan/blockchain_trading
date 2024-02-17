/*
filename: DigitalAsset.js
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 15/10/2023
*/
const Joi = require("joi").extend(require("@joi/date"));
const db = require("./DB");
// Defining the `DigitalAsset` class to encapsulate details and operations related to a digital asset.
class DigitalAsset {
    constructor(  // Constructor defines the properties of a digital asset.
        name,
        description,
        category,
        price,
        owner_id,
        image_name = null,
    ) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.owner_id = owner_id;
        this.image_name = image_name;
    }

    static getValidationSchema() { // Method defining a schema for data validation using Joi.
        return Joi.object({
            // Various schema rules defined for validating each property of a digital asset.
            // Includes type, length, and presence validations.
            name: Joi.string().min(1).max(255).truncate().trim().required(),
            description: Joi.string()
                .min(1)
                .max(255)
                .truncate()
                .trim()
                .required(),
            category: Joi.string().min(1).max(50).truncate().trim().required(),
            price: Joi.number()
                .precision(2)
                .sign("positive")
                .less(1000000)
                .required(),
            owner_id: Joi.number().sign("positive").required(),
            image_name: Joi.string().allow(null)
        });
    }
//method to create a new digital asset in the database.
    static createDigitalAsset(digitalAsset) {
        return new Promise(async (resolve, reject) => {
            try {
                await DigitalAsset.getValidationSchema().validateAsync( // Validating the provided `digitalAsset` object against the defined schema.
                    digitalAsset,
                );
            } catch (validationError) {
                // Rejecting the promise and returning validation error when validation fails.
                return reject(validationError);
            }
            console.log(digitalAsset);
            db.query(  // Performing an INSERT SQL operation to add the digital asset into the database.
                "INSERT INTO DigitalAssets SET ?",
                digitalAsset,
                (err, res) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    return resolve({ asset_id: res.insertId, ...digitalAsset });
                },
            );
        });
    }

    static getAllDigitalAssets(query) {
        // TODO: sanitise input
        // Constructing dynamic query conditions based on the input `query` object.
        // If conditions are present, they're concatenated to form the WHERE clause.
        // ...additional code and condition generation...

        return new Promise(async (resolve, reject) => {
            let filter = [];
            if (query.name !== undefined) {
                filter.push(`name LIKE '%${query.name}%'`);
            }
            if (query.min !== undefined) {
                filter.push(`price >= ${query.min}`);
            }
            if (query.max !== undefined) {
                filter.push(`price <= ${query.max}`);
            }
            if (query.start !== undefined) {
                filter.push(`creation_date >= '${query.start}'`);
            }
            if (query.end !== undefined) {
                filter.push(`creation_date <= '${query.end}'`);
            }
            if (query.category !== undefined) {
                filter.push(`category LIKE '%${query.category}%'`);
            }
            if (query.owner_id !== undefined) {
                filter.push(`owner_id = ${query.owner_id}`);
            }

            if (query.availability !== undefined) {
                filter.push(`is_available = ${query.availability}`)
            }

            let querySQL = filter.length === 0 ? "" : "WHERE " + filter.join(" AND ");

            console.log(querySQL);

            db.query( // Performing the SELECT SQL operation with the dynamically constructed query.
                `Select asset_id,name,price,description,category,owner_id,CONCAT(first_name,' ',last_name) as owner_name, creation_date,image_name, is_available 
                FROM DigitalAssets 
                INNER JOIN
                Users ON DigitalAssets.owner_id = Users.user_id
                ${querySQL}
                `,
                (queryError, res) => { // Handling any potential error during the database operation.
                    if (queryError) {
                        console.log(queryError);
                        return reject(queryError);
                    }
 // If successful, resolving the promise with the retrieved asset data.
                    return resolve(res);
                },
            );
        });
    }

    static findDigitalAssetById(digitalAssetId) {
        return new Promise((resolve, reject) => {
            db.query( // SQL query string to fetch asset and its owner details from the database.
                `Select asset_id,name,price,description,category,owner_id,CONCAT(first_name,' ',last_name) as owner_name, creation_date, image_name, is_available 
                FROM DigitalAssets 
                INNER JOIN
                    Users ON DigitalAssets.owner_id = Users.user_id
                WHERE asset_id='${digitalAssetId}'`,
                (err, res) => {
                    if (err) { // Error handling
                        console.log(err);
                        return reject(err);
                    }
                    for (const row of res) { // Converting the is_available column from number to boolean for every retrieved row.
                        row.is_available = Boolean(Number(row.is_available));
                    }
                    return resolve(res);
                },
            );
        });
    }
    static updateOwnership(digitalAssetId, newOwnerId) {
          // SQL query string to update the ownership and availability status of an asset in the database.
        return new Promise((resolve, reject) => {
            db.query(
                "UPDATE DigitalAssets SET is_available = 0, owner_id = ? WHERE asset_id = ?",
                [newOwnerId, digitalAssetId],
                (err, res) => {
                    if (err) { // Error handling
                        console.log(err);
                        return reject(err);
                    }
                    return resolve(res);
                },
            );
        });
    }
}
// Exporting the DigitalAsset class to be utilized in other modules.
module.exports = DigitalAsset;
