const db = require("../database/pg.database");
const baseResponse = require("../utils/baseResponse.util");

exports.createTransaction = async (transaction) => {
    try {
        console.log(transaction);
        const price = await db.query("SELECT price FROM items WHERE id = $1", [transaction.item_id]);
        console.log(price.rows[0].price);
        
        const res = await db.query(
            "INSERT INTO transactions (item_id, quantity, user_id, total) VALUES ($1, $2, $3, $4) RETURNING *",
            [transaction.item_id, transaction.quantity, transaction.user_id, price.rows[0].price * transaction.quantity]
        );
        console.log(res.rows[0]).total;
        return res.rows[0];
    } catch (error) {
        console.log("Error creating transaction", error);
    }
}

exports.payTransaction = async (transactionId) => {
    try {
        // console.log("dapatkan transaksi");
        const transaksi = await db.query("SELECT * FROM transactions WHERE id = $1", [transactionId]);
        console.log(transaksi.rows[0]);
        console.log("dapatkan user");

        const userBalance = await db.query("SELECT balance FROM users WHERE id = $1", [transaksi.rows[0].user_id]);
        console.log(userBalance.rows[0]);
        console.log("dapatkan item");

        const  item = await db.query("SELECT * FROM items WHERE id = $1", [transaksi.rows[0].item_id]);
        console.log(item.rows[0]);
        
        //cek jika transaksi ada (tidak null)
        //cek jika balance user lebih besar daripada harga total
        //cek jika quantity item lebih besar daripada quantity transaksi
        //cek jika status transaksi adalah pending
        console.log("1:", userBalance.rows[0].balance > transaksi.rows[0].total);
        console.log("2:", item.rows[0].stock > transaksi.rows[0].quantity);
        console.log("3:", transaksi.rows[0].status === "pending");

        if(transaksi.rows[0] !== null && userBalance.rows[0].balance > transaksi.rows[0].total && item.rows[0].stock > transaksi.rows[0].quantity && transaksi.rows[0].status === "pending"){
            //ubah status transaksi
            console.log("Valid");
            const res = await db.query("UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *", [transactionId]);
            console.log(res.rows[0]);

            console.log("kurangi balance");
            //ubah balance user, kurangi dengan total transaksi
            await db.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [transaksi.rows[0].total, transaksi.user_id]);

            //kurangi quantity item, kurangi dengan quantity transaksi
            console.log("kurangi quantity");
            await db.query("UPDATE items SET stock = stock - $1 WHERE id = $2", [transaksi.rows[0].quantity, transaksi.item_id]);
            console.log(res.rows[0]);
            return res.rows[0];
        }

        else{
            return null;
        }

        return res.rows[0];
    } catch (error) {
        console.log("Error paying transaction", error);
    }
}

// exports.deleteTransaction = async (id) => {
//     try {
//         const res = await db.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
//         return res.rows[0];
//     } catch (error) {
//         console.error("Error executing query", error);
//         throw error;
//     }
// }

exports.deleteTransaction = async (req, res) => {
    try {
        console.log(req.params.id);
        if (!req.params.id) {
            return baseResponse(res, false, 400, "Transaction ID is required", null);
        }
        const transaction = await transactionRepository.getTransactionById(req.params.id);
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        const deleted = await transactionRepository.deleteTransaction(req.params.id);
        if (!deleted) {
            return baseResponse(res, false, 400, "Delete failed", null);
        }
        baseResponse(res, true, 200, "Transaction deleted successfully", deleted);
    }
    catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
}

exports.getAllTransactions = async () => {
    try {
        const res = await db.query("SELECT * FROM transactions");
        return res.rows;
    } catch (error) {
        console.log("Error getting all transactions", error);
    }
}
