const db = require("../database/pg.database");
const baseResponse = require("../utils/baseResponse.util");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

exports.getAllItems = async () => {
    try {
        const res = await db.query("SELECT * FROM items");
        return res.rows;
    } catch (error) {
        console.log("Error getting items", error);
    }
}

exports.getById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.log("Error getting item", error);
    }
}

exports.getByStore = async (store_id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE store_id = $1", [store_id]);
        return res.rows;
    } catch (error) {
        console.log("Error getting items", error);
    }
}

exports.deleteItem = async (id) => {
    try {
        const res = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    } catch (error) {
        console.log("Error deleting item", error);
    }
}

exports.createItem = async (item, image) => {
    try {
        let imageB64 = null;
        if(image){
            imageB64 = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
        }
        const url = await cloudinary.uploader.upload(imageB64, {
            resource_type: "image",
            public_id: "image",
            notification_url: "http:/localhost:3000/item/create"
        });       
        const res = await db.query(
            "INSERT INTO items (name, price, store_id, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [item.name, item.price, item.store_id, item.stock, url.secure_url]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error creating item", error);
    }
}

exports.updateItem = async (item, image) => {
    try {
        let imageB64 = null;
        if(image){
            imageB64 = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
        }
        const url = await cloudinary.uploader.upload(imageB64, {
            resource_type: "image",
            public_id: "image",
            notification_url: "http:/localhost:3000/item"
        });       
        const res = await db.query(
            "UPDATE items SET name = $1, price = $2, store_id = $3, stock = $4, image_url = $5 WHERE id = $6 RETURNING *",
            [item.name, item.price, item.store_id, item.stock, url.secure_url, item.id]
        );
        console.log(res.rows[0]);
        return res.rows[0];
    } catch (error) {
        console.log("Error updating item", error);
    }
}