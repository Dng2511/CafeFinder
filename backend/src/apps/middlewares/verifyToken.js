const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Middleware xác thực JWT token
 * Kiểm tra user đã đăng nhập hay chưa
 */
const verifyToken = (req, res, next) => {
  // Lấy token từ header Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Không có token xác thực. Vui lòng đăng nhập.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Lưu thông tin user vào request để controller sử dụng
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token đã hết hạn. Vui lòng đăng nhập lại.",
      });
    }
    return res.status(403).json({
      status: "error",
      message: "Token không hợp lệ",
    });
  }
};

module.exports = verifyToken;
