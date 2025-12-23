const express = require("express");
const CafeController = require("../apps/controllers/apis/cafe");
const ReviewController = require("../apps/controllers/apis/review");
const FavoriteController = require("../apps/controllers/apis/favorite");
const UserController = require("../apps/controllers/apis/user");
const verifyToken = require("../apps/middlewares/verifyToken");
const checkLoggedIn = require("../apps/middlewares/checkLoggedIn");
const {
  checkRole,
  isAdmin,
  isCustomer,
} = require("../apps/middlewares/checkRole");
const verifyToken = require('../apps/middlewares/verifyToken');
const upload = require('../apps/middlewares/upload');

const router = express.Router();

// ==================== AUTH ROUTES ====================
// Đăng ký tài khoản mới
router.post("/register", UserController.register);

// Đăng nhập
router.post("/login", UserController.login);

// Lấy thông tin user hiện tại (cần đăng nhập)
router.get("/me", verifyToken, UserController.getMe);

// ==================== CAFE ROUTES ====================
// Public: Xem danh sách quán cafe
router.get("/cafes", CafeController.index);

// Public: Xem chi tiết quán cafe
router.get("/cafes/:id", CafeController.searchById);
router.post("/cafes/:id/edit-requests", verifyToken, upload.single('main_image'), CafeController.createEditRequest);

// ==================== FAVORITE ROUTES ====================
// Cần đăng nhập để sử dụng
router.get("/favorites", verifyToken, FavoriteController.getFavorites);
router.post("/favorites", verifyToken, FavoriteController.addFavorite);
router.delete(
  "/favorites/:cafe_id",
  verifyToken,
  FavoriteController.removeFavorite
);

// ==================== REVIEW ROUTES ====================
// Public: Xem reviews
router.get("/reviews/:cafe_id", ReviewController.index);

// Cần đăng nhập để đánh giá (User/Customer)
router.post("/reviews", verifyToken, ReviewController.store);

// ==================== ADMIN ROUTES ====================
// Ví dụ routes chỉ dành cho Admin (quản lý quán)
// router.post('/admin/cafes', verifyToken, isAdmin, CafeController.create);
// router.put('/admin/cafes/:id', verifyToken, isAdmin, CafeController.update);
// router.delete('/admin/cafes/:id', verifyToken, isAdmin, CafeController.delete);

module.exports = router;
