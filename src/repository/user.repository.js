const db = require("../database/pg.database");
const baseResponse = require("../utils/baseResponse.util");

exports.registerUser = async (user, hash) => {
    try {
        const res = await db.query(
        "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *",
        [user.email, hash, user.name]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error creating user", error);
    }
};

exports.loginUser = async (user) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [user.email]);
        return res.rows[0];
    } catch (error) {
        console.log("Error logging in", error);
    }
};

exports.findUser = async (email) => {
    try{
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows[0];
    }catch(error){
        console.log("Error getting user", error);
    }
};

exports.updateUser = async (user, hash) => {
    try {
        const res = await db.query(
        "UPDATE users SET email = $1, password = $2, name = $3 WHERE id = $4 RETURNING *",
        [user.email, hash, user.name, user.id]
        );
        return res.rows[0];
    } catch (error) {
        console.log("Error updating user", error);
    }
};

exports.deleteUser = async (id) => {
    try{
        const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    } catch(error){
        console.log("Error deleting user", error);
    }
}


exports.topUp = async (id, amount) => {
    try{
        const res = await db.query("UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *", [amount, id]);
        return res.rows[0];
    } catch(error){
        console.log("Error topping up user balance", error);
    }
}