const express = require("express");
const CafeController = require("../apps/controllers/apis/cafe");
const ReviewController = require("../apps/controllers/apis/review");
const FavoriteController = require("../apps/controllers/apis/favorite");
const UserController = require("../apps/controllers/apis/user");
const verifyToken = require("../apps/middlewares/verifyToken");
const upload = require("../apps/middlewares/upload");
const { isAdmin } = require("../apps/middlewares/checkRole");

const router = express.Router();

// ==================== AUTH ROUTES ====================
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/me", verifyToken, UserController.getMe);

// ==================== CAFE ROUTES (PUBLIC) ====================
router.get("/cafes", CafeController.index);
router.get("/cafes/:id", CafeController.searchById);

// ==================== CAFE ROUTES (USER - QUAN TRỌNG) ====================
// 1. Lấy danh sách quán của tôi (Route bạn đang thiếu)
router.get(
  "/my-cafes", 
  verifyToken, 
  CafeController.getMyCafes
);

// 2. Tạo yêu cầu thêm quán
router.post(
  "/requests", 
  verifyToken, 
  upload.array("images", 5), 
  CafeController.createRequest
);

// 3. Cập nhật quán (Route bạn đang thiếu để sửa quán)
router.put(
  "/cafes/:id",
  verifyToken,
  upload.array("images", 5), 
  CafeController.updateCafe
);

// ==================== ADMIN ROUTES ====================
router.get("/admin/requests", verifyToken, isAdmin, CafeController.listRequests);
router.post("/admin/requests/:id", verifyToken, isAdmin, CafeController.processRequest);

// ==================== FAVORITE ROUTES ====================
router.get("/favorites", verifyToken, FavoriteController.getFavorites);
router.post("/favorites", verifyToken, FavoriteController.addFavorite);
router.delete("/favorites/:cafe_id", verifyToken, FavoriteController.removeFavorite);

// ==================== REVIEW ROUTES ====================
router.get("/reviews/:cafe_id", ReviewController.index);
router.post("/reviews", verifyToken, ReviewController.store);

module.exports = router;