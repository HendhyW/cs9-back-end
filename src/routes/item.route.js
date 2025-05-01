const itemController = require('../controllers/item.controller');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create', upload.single('image'), itemController.createItem);
router.put('/',upload.single('image'), itemController.updateItem);

router.get('/', itemController.getAllItems);
router.get('/byId/:id', itemController.getById);
router.get('/byStoreId/:store_id', itemController.getByStore);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
