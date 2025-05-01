const db = require("../database/pg.database");
const baseResponse = require("../utils/baseResponse.util");

exports.getAllstores = async () => {
    try {
        const res = await db.query("SELECT * FROM stores");
        return res.rows;
    } catch (error) {
        console.log("Error getting stores", error);
    }
};

exports.createStore = async (store) => {
    try {
        const res = await db.query(
        "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
        [store.name, store.address]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error creating store", error);
    }
};

exports.getStoreById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM stores WHERE id = $1", [id]);
        return res.rows;
    } catch (error) {
        console.log("Error getting store", error);
    }
}

exports.updateStore = async (store) => {
    try {
        const res = await db.query(
        "UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *",
        [store.name, store.address, store.id]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error updating store", error);
    }
}

exports.deleteStore = async (id) => {
    try {
        const res = await db.query("DELETE FROM stores WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    } catch (error) {
        console.log("Error deleting store", error);
    }
}