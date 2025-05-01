const e = require('express');
const itemRepostiory = require('../repository/item.repository');
const baseResponse = require('../utils/baseResponse.util');



exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepostiory.getAllItems();
        if(!items){
            baseResponse(res, false, 404, "There are no items in the database");
        }
        else{
            baseResponse(res, true, 200, "Items retrieved successfully", items);
        }
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while fetching items", error);
    }
}

exports.getById = async (req, res) => {
    try {
        const items = await itemRepostiory.getById(req.params.id);
        if (!items) {
            baseResponse(res, false, 404, "Item not found");
        }
        baseResponse(res, true, 200, "Item found", items);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while fetching item", error);
    }
} 

exports.getByStore = async (req, res) => {
    try {
        const items = await itemRepostiory.getByStore(req.params.store_id);
        if (!items) {
            baseResponse(res, false, 404, "Store doesn't exist");
        }else{
        baseResponse(res, true, 200, "Items found", items);}
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while fetching items", error);
    }
}

exports.deleteItem = async (req, res) => {
    try {
        const items = await itemRepostiory.deleteItem(req.params.id);
        if (!items) {
            baseResponse(res, false, 404, "Item not found");
        }
        baseResponse(res, true, 200, "Item deleted", items);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while deleting item", error);
    }
}


exports.createItem = async (req, res) => {
    try{
        const item = await itemRepostiory.createItem(req.body, req.file);
        if(!item){
            baseResponse(res, false, 400, "Gagal memasukkan item");
        } else{
            baseResponse(res, true, 201, "Item created", item);
        }

    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while creating item", error);
    }
}

exports.updateItem = async (req, res) => {
    try{
        const item = await itemRepostiory.updateItem(req.body, req.file);
        console.log(item);
        if(!item){
            baseResponse(res, false, 404, "Item not found");
        } 
        else{
            baseResponse(res, true, 200, "Item updated", item);
        }
    }catch(error){
        baseResponse(res, false, 500, "An error occurred while updating item", error);
    }
}