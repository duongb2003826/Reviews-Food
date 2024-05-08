const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../config/checkToken')

router.post('/signup', usersController.create);
router.post("/login", usersController.login);
router.get("/list",authMiddleware, usersController.getList);
router.put("/update/:id", usersController.update);
router.delete("/delete/:id", usersController.deleteUser);
router.get("/:id/bookmarks", authMiddleware, usersController.showBookmarks);

module.exports = router;