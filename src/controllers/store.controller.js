const storeRepository = require("../repository/store.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllstores();
        baseResponse(res, true, 200, "Stores retrieved successfully", stores);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while fetching stores", error);
    }
};

exports.createStore = async (req, res) => {
    if(!req.body.name || !req.body.address){
        baseResponse(res, false, 400, "Name and address are required");
    }
    try{    
        const store = await storeRepository.createStore(req.body);
        baseResponse(res, true, 201, "Store created successfully", store);
    } catch (error){
        baseResponse(res, false, 500, error.message || "server error", error);
    }
}

exports.getStoreById = async (req, res) => {
    try {
        const store = await storeRepository.getStoreById(req.params.id);
        if (!store) {
            baseResponse(res, false, 404, "Store not found");
        }
        baseResponse(res, true, 200, "Store found", store);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while fetching store", error);
    }
}

exports.updateStore = async (req, res) => {
    if(!req.body.name || !req.body.address){
        baseResponse(res, false, 400, "Name and address are required");
    }
    try {
        const store = await storeRepository.updateStore(req.body);
        if (!store) {
            baseResponse(res, false, 404, "Store not found");
        }
        baseResponse(res, true, 200, "Store updated", store);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while updating store", error);
    }
}

exports.deleteStore = async (req, res) => {
    try {
        const store = await storeRepository.deleteStore(req.params.id);
        if (!store) {
            baseResponse(res, false, 404, "Store not found");
        }
        baseResponse(res, true, 200, "Store deleted", store);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while deleting store", error);
    }
}