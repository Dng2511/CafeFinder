const { Sequelize } = require("sequelize");
const Cafe = require("../../models/Cafe");

exports.index = async (req, res) => {
  try {
    if (!req.query.search) {
      const cafes = await Cafe.findAll();
      return res.status(200).json({
        status: "success",
        message: "Cafes retrieved successfully",
        count: cafes.length,
        data: cafes,
      });
    } else {
      const keyword = (req.query.search || "").toLowerCase();

      // Map keyword sang filter boolean
      const filters = {};
      if (keyword.includes("do-xe") || keyword.includes("parking")) {
        filters.has_parking = true;
      }
      if (keyword.includes("wifi")) {
        filters.has_wifi = true;
      }
      if (keyword.includes("may-lanh") || keyword.includes("air")) {
        filters.has_air_conditioning = true;
      }

      // Query
      const cafes = await Cafe.findAll({
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
      });

      res.json({
        status: "success",
        message: "Search completed successfully",
        count: cafes.length,
        data: cafes,
      });
    }
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
        main_image: cafe.main_image,
        amenities: {
          has_wifi: cafe.has_wifi,
          has_parking: cafe.has_parking,
          has_air_conditioning: cafe.has_air_conditioning,
        },
        created_at: cafe.createdAt,
        updated_at: cafe.updatedAt,
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
