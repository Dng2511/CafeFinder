const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Middleware kiểm tra đăng nhập và phân quyền (kết hợp)
 * @param {string|null} role - Role yêu cầu (null = chỉ cần đăng nhập, 'admin'/'customer' = cần đúng role)
 * @returns {Function} Express middleware
 *
 * Ví dụ:
 * - checkLoggedIn() - Chỉ cần đăng nhập
 * - checkLoggedIn('admin') - Phải đăng nhập VÀ là admin
 * - checkLoggedIn('customer') - Phải đăng nhập VÀ là customer
 */
const checkLoggedIn = (role = null) => {
  return (req, res, next) => {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Vui lòng đăng nhập để tiếp tục",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Kiểm tra role nếu có yêu cầu
      if (role && decoded.role !== role) {
        return res.status(403).json({
          status: "error",
          message: "Bạn không có quyền truy cập tài nguyên này",
        });
      }

      // Lưu thông tin user vào request
      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        });
      }
      return res.status(403).json({
        status: "error",
        message: "Token không hợp lệ: " + err.message,
      });
    }
  };
};

module.exports = checkLoggedIn;
