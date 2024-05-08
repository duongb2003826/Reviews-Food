const express = require('express');
const router = express.Router();
const authMiddleware = require('../config/checkToken')
const staticBuilder = require('../controllers/Static.controller');
router.get("/all", staticBuilder.monthlyStatistics);

module.exports = router;