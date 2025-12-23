const express = require('express');
const CafeController = require('../apps/controllers/apis/cafe');
const ReviewController = require('../apps/controllers/apis/review');
const FavoriteController = require("../apps/controllers/apis/favorite");
const UserController = require("../apps/controllers/apis/user");
const checkLoggedIn = require('../apps/middlewares/checkLoggedIn');
const verifyToken = require('../apps/middlewares/verifyToken');
const upload = require('../apps/middlewares/upload');

const router = express.Router();

// Cafe routes
router.get("/cafes", CafeController.index);
router.get("/cafes/:id", CafeController.searchById);
router.post("/cafes/:id/edit-requests", verifyToken, upload.single('main_image'), CafeController.createEditRequest);

// Favorite routes
router.get("/favorites", FavoriteController.getFavorites);
router.post("/favorites",  FavoriteController.addFavorite);
router.delete("/favorites/:cafe_id", FavoriteController.removeFavorite);


// Reviews routes
router.post('/reviews',  ReviewController.store);
router.get('/reviews/:cafe_id', ReviewController.index);

router.post('/register', UserController.register);
router.post('/login/:role', UserController.login);
router.post('/login', UserController.login);



module.exports = router;

