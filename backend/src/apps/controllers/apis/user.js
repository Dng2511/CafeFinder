const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pagination = require("../../../libs/Pagination");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { username, email, password} = req.body;
    const role = "customer";

    const existing = await UserModel.findOne({ email, role });
    if (existing) {
        return res.status(400).json({ status: "error", message: "Email already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, email, password: hashed, role });
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ status: "success", data: { user, token } });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const role = req.params.role || "customer";
    const user = await UserModel.findOne({ email, role });
    if (!user) {
        return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ status: "success", data: { user, token } });
}

