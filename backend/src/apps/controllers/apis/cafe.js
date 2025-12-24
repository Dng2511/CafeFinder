const sequelize = require("../../../common/database");
const Cafe = require("../../models/Cafe");
const { addHours } = require("../../../common/time");
const MenuItem = require("../../models/MenuItem");
const CafeImage = require("../../models/CafeImage");
const openai = require("../../../libs/openai");
const findByDistance = require("../../../libs/findByDistance");

// === HELPER: Khai báo hàm này ở đầu file để dùng chung ===
const parseBool = (val) => val === 'true' || val === true;

// 1. Lấy danh sách quán (Public - Chỉ hiện quán Active)
exports.index = async (req, res) => {
  try {
    let returnedCafes = [];
    if (!req.query.search) {
      const cafes = await Cafe.findAll({ where: { status: 'active' } });
      returnedCafes = cafes.map(cafe => cafe.toJSON());
    } else {
      const keyword = (req.query.search || "").toLowerCase();
      const sql = await openai.generateCafeSearchSQL(keyword);
      // console.log("Generated SQL:", sql);
      const cafes = await sequelize.query(sql);
      // Lọc lại kết quả search chỉ lấy active
      returnedCafes = cafes[0].filter(c => c.status === 'active');
    }
    
    if (req.query.distance){
      const {lat, lon} = req.query;
      if (!lat || !lon) return res.status(400).json({ message: "Missing coordinates" });
      returnedCafes = findByDistance.findNearbyCafes(returnedCafes, parseFloat(lat), parseFloat(lon), parseFloat(req.query.distance));
    }

    // Time adjustment
    returnedCafes = returnedCafes.map(c => {
      if (c.createdAt) c.createdAt = addHours(c.createdAt, 14);
      if (c.updatedAt) c.updatedAt = addHours(c.updatedAt, 14);
      return c;
    });

    return res.json({ status: "success", count: returnedCafes.length, data: returnedCafes });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// 2. Chi tiết quán (Public)
exports.searchById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const cafe = await Cafe.findByPk(id);
    if (!cafe) return res.status(404).json({ message: "Cafe not found" });

    const menuItems = await MenuItem.findAll({ where: { cafe_id: id } });
    const cafeImages = await CafeImage.findAll({ where: { cafe_id: id } });

    return res.status(200).json({
      status: "success",
      data: {
        ...cafe.toJSON(),
        menu: menuItems,
        images: { main_image: cafe.main_image, additional_images: cafeImages },
        created_at: addHours(cafe.createdAt, 14),
        updated_at: addHours(cafe.updatedAt, 14),
      },
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// ==================== USER FUNCTIONS ====================

// 3. User tạo request
exports.createRequest = async (req, res) => {
    try {
        const { name, address, lat, lon } = req.body;
        const owner_id = req.user.id;
        
        if (!name || !address) {
            return res.status(400).json({ status: "error", message: "Tên quán và địa chỉ là bắt buộc" });
        }

        let mainImage = null;
        const files = req.files || (req.file ? [req.file] : []);
        if (files.length > 0) mainImage = '/uploads/' + files[0].filename;

        const newCafe = await Cafe.create({
            ...req.body,
            main_image: mainImage,
            has_wifi: parseBool(req.body.has_wifi),
            has_parking: parseBool(req.body.has_parking),
            has_air_conditioning: parseBool(req.body.has_air_conditioning),
            has_power_outlet: parseBool(req.body.has_power_outlet),
            is_quiet: parseBool(req.body.is_quiet),
            no_smoking: parseBool(req.body.no_smoking),
            lat: lat ? parseFloat(lat) : null,
            lon: lon ? parseFloat(lon) : null,
            owner_id,
            status: 'pending'
        });
        return res.status(201).json({ status: "success", data: newCafe });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: "error", message: error.message });
    }
};

// 4. Lấy danh sách quán của tôi (User)
exports.getMyCafes = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const cafes = await Cafe.findAll({
      where: { owner_id },
      order: [['createdAt', 'DESC']]
    });

    return res.json({ status: "success", data: cafes });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// 5. Cập nhật quán (User - Reset về Pending)
exports.updateCafe = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.user.id;
    const { name, address, lat, lon } = req.body;

    const cafe = await Cafe.findOne({ where: { id, owner_id } });
    if (!cafe) {
      return res.status(404).json({ status: "error", message: "Không tìm thấy quán hoặc không có quyền sửa" });
    }

    let mainImage = cafe.main_image;
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length > 0) mainImage = '/uploads/' + files[0].filename;

    await cafe.update({
      name, address, 
      phone_number: req.body.phone_number,
      open_time: req.body.open_time,
      close_time: req.body.close_time,
      main_image: mainImage,
      has_wifi: parseBool(req.body.has_wifi),
      has_parking: parseBool(req.body.has_parking),
      has_air_conditioning: parseBool(req.body.has_air_conditioning),
      has_power_outlet: parseBool(req.body.has_power_outlet),
      is_quiet: parseBool(req.body.is_quiet),
      no_smoking: parseBool(req.body.no_smoking),
      lat: lat ? parseFloat(lat) : cafe.lat,
      lon: lon ? parseFloat(lon) : cafe.lon,
      status: 'pending' // Reset về pending
    });

    return res.json({ status: "success", message: "Cập nhật thành công!", data: cafe });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// ==================== ADMIN FUNCTIONS ====================

// 6. Admin lấy danh sách Pending
exports.listRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = { status: status || 'pending' };

    const cafes = await Cafe.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    return res.json({ status: "success", data: cafes });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// 7. Admin duyệt/từ chối
exports.processRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const cafe = await Cafe.findByPk(id);
    if (!cafe) return res.status(404).json({ message: "Not found" });

    if (action === 'approve') cafe.status = 'active';
    else if (action === 'reject') cafe.status = 'rejected';
    
    await cafe.save();
    return res.json({ status: "success", message: `Đã ${action}`, data: cafe });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};