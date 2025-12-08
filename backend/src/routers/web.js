const express = require('express');
const CafeController = require('../apps/controllers/apis/cafe');
//const FavoriteController = require('../apps/controllers/apis/favorite');
const router = express.Router();




router.get('/cafes', CafeController.index);
router.get('/cafes/:id', CafeController.searchById);

// Favorites routes
//router.post('/favorites', FavoriteController.addFavorite);
//router.delete('/favorites/:cafe_id', FavoriteController.removeFavorite);
//router.get('/favorites/:user_id', FavoriteController.getFavorites);

module.exports = router;