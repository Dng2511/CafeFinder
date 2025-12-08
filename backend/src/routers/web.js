const express = require("express");
const CafeController = require("../apps/controllers/apis/cafe");
const FavoriteController = require("../apps/controllers/apis/favorite");
const router = express.Router();

// Cafe routes
router.get("/cafes", CafeController.index);
router.get("/cafes/:id", CafeController.searchById);

// Favorite routes
router.get("/favorites/:user_id", FavoriteController.getFavorites);
router.post("/favorites", FavoriteController.addFavorite);
router.delete("/favorites/:cafe_id", FavoriteController.removeFavorite);

module.exports = router;
