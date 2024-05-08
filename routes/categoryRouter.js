const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../config/checkToken')

router.get('/lists', categoryController.getLists);
router.post('/store', categoryController.create);
// router.post('store', usersController.create);
// router.get("/show/:id", authMiddleware, categoryController.show);

module.exports = router;