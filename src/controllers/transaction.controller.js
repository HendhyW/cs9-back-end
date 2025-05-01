const transactionRepository = require('../repository/transaction.repository');
const express = require('express');
const baseResponse = require('../utils/baseResponse.util');

exports.createTransaction = async (req, res) => {
    try{
        if(req.body.quantity< 1){
            console.log("quantity kurang");
            baseResponse(res, false, 400, "Quantity must be greater than 0");
        }else{
            console.log("menunggu query");
            const transaction = await transactionRepository.createTransaction(req.body);
            console.log("setelah query");
            console.log(transaction);
            baseResponse(res, true, 200, "Transaction created successfully", transaction);
        }
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while creating transaction", error);
    }
}

exports.payTransaction = async (req, res) => {
    try{
        // console.log("menunggu query");
        // console.log(req.params.id);
        const paid = await transactionRepository.payTransaction(req.params.id);
        if(!paid){
            console.log("TIdak ketemu");
            baseResponse(res, false, 400, "Transaction failed");
        } else{
        baseResponse(res, true, 200, "Transaction paid successfully", paid);
        }
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while creating transaction", error);
    }
}

exports.getAllTransactuisons = async (req, res) => {
    try {
        const transactions = await transactionRepository.getAllTransactions();
        if (!transactions) {
            baseResponse(res, false, 404, "No transactions found");
        } else {
            baseResponse(res, true, 200, "Transactions retrieved successfully", transactions);
        }
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving transactions", error);
    }
}

exports.deleteTransaction = async (req, res) => {
    try {
        console.log(req.params.id);
        const transaction = await transactionRepository.deleteTransaction(req.params.id);
        
        if (!transaction) {
            baseResponse(res, false, 404, "Transaction not found");
        }
        baseResponse(res, true, 200, "Transaction deleted", transaction);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while deleting transaction", error);
    }
}
