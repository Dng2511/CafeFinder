const sequelize = require("../../../common/database")
const Cafe = require("../../models/Cafe");
const { addHours } = require("../../../common/time");
const MenuItem = require("../../models/MenuItem");
const CafeImage = require("../../models/CafeImage");
const EditRequest = require("../../models/EditRequest");
const openai = require("../../../libs/openai");
const findByDistance = require("../../../libs/findByDistance");

exports.index = async (req, res) => {
  try {
    let returnedCafes = [];
    if (!req.query.search) {
      const cafes = await Cafe.findAll();
      returnedCafes = cafes.map(cafe => cafe.toJSON());
    } else {
      const keyword = (req.query.search || "").toLowerCase();

      // Map keyword sang filter boolean
      /* const filters = {};
      if (keyword.includes("do-xe") || keyword.includes("parking")) {
        filters.has_parking = true;
      }
      if (keyword.includes("wifi")) {
        filters.has_wifi = true;
      }
      if (keyword.includes("may-lanh") || keyword.includes("air")) {
        filters.has_air_conditioning = true;
      } */

      // Query
      /* const cafes = await Cafe.findAll({
        where: {
          ...filters,
          [Sequelize.Op.or]: Sequelize.literal(`
          unaccent(lower(name)) ILIKE unaccent(lower('%${keyword}%'))
          OR
          similarity(unaccent(lower(name)), unaccent(lower('${keyword}'))) > 0.3
        `),
        },
        order: Sequelize.literal(`
        similarity(unaccent(lower(name)), unaccent(lower('${keyword}'))) DESC
      `),
      }); */
      const sql = await openai.generateCafeSearchSQL(keyword);
      console.log("Generated SQL:", sql);
      const cafes = await sequelize.query(sql);
      returnedCafes = cafes[0];
      
    }
    if (req.query.distance){
      const {lat, lon} = req.query;
      if (!lat || !lon){
        return res.status(400).json({
          status: "error",
          message: "Latitude and longitude are required for distance filtering",
          data: null,
        });
      }
      returnedCafes = findByDistance.findNearbyCafes(returnedCafes, parseFloat(lat), parseFloat(lon), parseFloat(req.query.distance));
    }

    // Apply +14 hours to any timestamp fields
    returnedCafes = returnedCafes.map(c => {
      if (c.created_at) c.created_at = addHours(c.created_at, 14);
      if (c.updated_at) c.updated_at = addHours(c.updated_at, 14);
      if (c.createdAt) c.createdAt = addHours(c.createdAt, 14);
      if (c.updatedAt) c.updatedAt = addHours(c.updatedAt, 14);
      return c;
    });

    return res.json({
        status: "success",
        message: "Search completed successfully",
        count: returnedCafes.length,
        data: returnedCafes,
      });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
      data: null,
    });
  }
};

exports.searchById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid cafe ID",
        data: null,
      });
    }

    // Find cafe by ID
    const cafe = await Cafe.findByPk(id);

    if (!cafe) {
      return res.status(404).json({
        status: "error",
        message: "Cafe not found",
        data: null,
      });
    }

    const menuItems = await MenuItem.findAll({ where: { cafe_id: id } });
    const cafeImages = await CafeImage.findAll({ where: { cafe_id: id } });

    // Success response with standardized format
    return res.status(200).json({
      status: "success",
      message: "Cafe details retrieved successfully",
      data: {
        id: cafe.id,
        name: cafe.name,
        address: cafe.address,
        phone_number: cafe.phone_number,
        opening_hours: {
          open_time: cafe.open_time,
          close_time: cafe.close_time,
        },
        amenities: {
          has_wifi: cafe.has_wifi,
          has_parking: cafe.has_parking,
          has_air_conditioning: cafe.has_air_conditioning,
        },
        menu: menuItems,
        images: {
          main_image: cafe.main_image,
          additional_images: cafeImages,
        },
        created_at: addHours(cafe.createdAt, 14),
        updated_at: addHours(cafe.updatedAt, 14),
      },
    });
  } catch (error) {
    console.error("Error in searchById:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      data: null,
    });
  }
};

/**
 * Create a cafe edit request
 * POST /cafes/:id/edit-requests
 * Body: {
 *   name?: string,
 *   address?: string,
 *   phone_number?: string,
 *   open_time?: string,
 *   close_time?: string,
 *   has_wifi?: boolean,
 *   has_parking?: boolean,
 *   has_air_conditioning?: boolean,
 *   has_power_outlet?: boolean,
 *   is_quiet?: boolean,
 *   no_smoking?: boolean,
 *   menu_items?: [{id?, item_name, price, image?}, ...],
 *   cafe_images?: [url1, url2, ...]
 * }
 * File: main_image (optional)
 */
exports.createEditRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Validate cafe ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid cafe ID",
        data: null,
      });
    }

    // Verify user is logged in
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User must be logged in to create edit requests",
        data: null,
      });
    }

    // Verify cafe exists
    const cafe = await Cafe.findByPk(id);
    if (!cafe) {
      return res.status(404).json({
        status: "error",
        message: "Cafe not found",
        data: null,
      });
    }

    // Prepare edit data from request body
    const editData = {};
    const allowedFields = [
      'name', 'address', 'phone_number', 'open_time', 'close_time',
      'has_wifi', 'has_parking', 'has_air_conditioning', 'has_power_outlet',
      'is_quiet', 'no_smoking', 'menu_items', 'cafe_images'
    ];

    // Collect only provided fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        editData[field] = req.body[field];
      }
    });

    // Validate that at least one field is being edited
    if (Object.keys(editData).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No fields provided for editing",
        data: null,
      });
    }

    // Validate data format
    if (editData.name && (typeof editData.name !== 'string' || editData.name.trim().length === 0)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid cafe name format",
        data: null,
      });
    }

    if (editData.phone_number && (typeof editData.phone_number !== 'string' || editData.phone_number.trim().length === 0)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid phone number format",
        data: null,
      });
    }

    if (editData.open_time && !/^\d{2}:\d{2}(:\d{2})?$/.test(editData.open_time)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid open_time format. Expected HH:MM or HH:MM:SS",
        data: null,
      });
    }

    if (editData.close_time && !/^\d{2}:\d{2}(:\d{2})?$/.test(editData.close_time)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid close_time format. Expected HH:MM or HH:MM:SS",
        data: null,
      });
    }

    // Validate menu_items if provided
    if (editData.menu_items) {
      if (!Array.isArray(editData.menu_items)) {
        return res.status(400).json({
          status: "error",
          message: "menu_items must be an array",
          data: null,
        });
      }

      for (let item of editData.menu_items) {
        if (!item.item_name || typeof item.item_name !== 'string') {
          return res.status(400).json({
            status: "error",
            message: "Each menu item must have a valid item_name",
            data: null,
          });
        }

        if (item.price === undefined || isNaN(parseFloat(item.price))) {
          return res.status(400).json({
            status: "error",
            message: "Each menu item must have a valid price",
            data: null,
          });
        }
      }
    }

    // Validate cafe_images if provided
    if (editData.cafe_images) {
      if (!Array.isArray(editData.cafe_images)) {
        return res.status(400).json({
          status: "error",
          message: "cafe_images must be an array of URLs",
          data: null,
        });
      }

      for (let image of editData.cafe_images) {
        if (typeof image !== 'string' || image.trim().length === 0) {
          return res.status(400).json({
            status: "error",
            message: "All cafe_images must be non-empty strings",
            data: null,
          });
        }
      }
    }

    // Handle main_image file upload if provided
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      editData.main_image = imageUrl;
    }

    // Create edit request in database
    const editRequest = await EditRequest.create({
      cafe_id: id,
      user_id: userId,
      data: editData,
      image_url: imageUrl,
      status: 'PENDING'
    });

    return res.status(201).json({
      status: "success",
      message: "Edit request created successfully. Awaiting admin approval.",
      data: {
        id: editRequest.id,
        cafe_id: editRequest.cafe_id,
        status: editRequest.status,
        created_at: addHours(editRequest.created_at, 14),
        request_fields: Object.keys(editData)
      },
    });
  } catch (error) {
    console.error("Error in createEditRequest:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      data: null,
    });
  }
};

