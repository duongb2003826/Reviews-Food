const express = require("express");
const reviewsController = require("../controllers/reviewsController");
const router = express.Router();
const authMiddleware = require('../config/checkToken')

router.post('/:id', authMiddleware, reviewsController.createReview)
router.delete('/:reviewId', authMiddleware, reviewsController.deleteReview)

module.exports = router;