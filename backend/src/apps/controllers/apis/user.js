const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * POST /register
 * Đăng ký tài khoản mới
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Username, email và password là bắt buộc",
      });
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        status: "error",
        message: "Email đã được sử dụng",
      });
    }

    // Kiểm tra username đã tồn tại
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({
        status: "error",
        message: "Username đã được sử dụng",
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Tạo user mới (mặc định role là customer)
    const user = await User.create({
      username,
      email,
      password_hash,
      role: "customer",
    });

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Trả về response (không bao gồm password_hash)
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      status: "success",
      message: "Đăng ký thành công",
      data: { user: userResponse, token },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi đăng ký",
    });
  }
};

/**
 * POST /login
 * Đăng nhập và trả về JWT
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email và password là bắt buộc",
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Email hoặc mật khẩu không đúng",
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
