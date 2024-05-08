const express = require('express');
const router = express.Router();
const usersController = require('../controllers/blogController');
const authMiddleware = require('../config/checkToken')

router.post('/create',authMiddleware, usersController.create);
router.get("/list", usersController.getList);
router.get("/show/:id", usersController.show);
router.put("/update/:id",authMiddleware, usersController.update);
router.delete("/delete/:id", usersController.deleteUser);

module.exports = router;