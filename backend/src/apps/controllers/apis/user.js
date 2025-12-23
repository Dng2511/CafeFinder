const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/User");
const pagination = require("../../../libs/Pagination");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * POST /register
 * Đăng ký tài khoản mới
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await UserModel.findOne({ where: { email, role } });
    if (existing) {
        return res.status(400).json({ status: "error", message: "Email already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
        username,
        email,
        password_hash: hashed,
        role
    });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.json({
        status: "success",
        data: {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        }
    });
};

/**
 * POST /login
 * Đăng nhập và trả về JWT
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const role = req.params.role || "customer";
    const user = await UserModel.findOne({ where: { email, role } });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Email hoặc mật khẩu không đúng",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Email hoặc mật khẩu không đúng",
      });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "30d" });
    res.json({
        status: "success",
        data: {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        }
    });
}

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Trả về response
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.json({
      status: "success",
      message: "Đăng nhập thành công",
      data: { user: userResponse, token },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi đăng nhập",
    });
  }
};

/**
 * GET /me
 * Lấy thông tin user hiện tại (cần verifyToken)
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User không tồn tại",
      });
    }

    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server",
    });
  }
};
