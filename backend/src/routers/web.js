
const express = require('express');
const CafeController = require('../apps/controllers/apis/cafe');
const ReviewController = require('../apps/controllers/apis/review');
const FavoriteController = require("../apps/controllers/apis/favorite");
const UserController = require("../apps/controllers/apis/user");
const checkLoggedIn = require('../apps/middlewares/checkLoggedIn');

const router = express.Router();

// Cafe routes
router.get("/cafes", CafeController.index);
router.get("/cafes/:id", CafeController.searchById);

// Favorite routes
router.get("/favorites", checkLoggedIn("customer"), FavoriteController.getFavorites);
router.post("/favorites", checkLoggedIn("customer"), FavoriteController.addFavorite);
router.delete("/favorites/:cafe_id", checkLoggedIn("customer"), FavoriteController.removeFavorite);


// Reviews routes
router.post('/reviews', checkLoggedIn("customer"), ReviewController.store);
router.get('/reviews/:cafe_id', ReviewController.index);

router.post('/register', UserController.register);
router.post('/login/:role?', UserController.login);



module.exports = router;

