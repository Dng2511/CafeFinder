/**
 * Middleware phân quyền theo role
 * Sử dụng sau middleware verifyToken
 *
 * @param {...string} allowedRoles - Các role được phép truy cập (vd: 'admin', 'customer')
 * @returns {Function} Express middleware
 *
 * Ví dụ sử dụng:
 * - checkRole('admin') - Chỉ admin được truy cập
 * - checkRole('customer') - Chỉ customer được truy cập
 * - checkRole('admin', 'customer') - Cả admin và customer đều được truy cập
 */
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Kiểm tra đã có thông tin user từ verifyToken chưa
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Bạn chưa đăng nhập",
      });
    }

    const userRole = req.user.role;

    // Kiểm tra role của user có nằm trong danh sách được phép không
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        message: "Bạn không có quyền truy cập tài nguyên này",
      });
    }

    next();
  };
};

// Shorthand middlewares cho các role phổ biến
const isAdmin = checkRole("admin");
const isCustomer = checkRole("customer");
const isUser = checkRole("admin", "customer"); // Cả 2 đều OK

module.exports = {
  checkRole,
  isAdmin,
  isCustomer,
  isUser,
};
