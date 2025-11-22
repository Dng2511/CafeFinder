const express = require('express');
const CafeController = require('../apps/controllers/apis/cafe');
const router = express.Router();




router.get('/cafes', CafeController.index);
router.get('/cafes/:id', CafeController.searchById);

module.exports = router;