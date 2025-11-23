const { Sequelize } = require('sequelize');
const Cafe = require('../../models/Cafe');

exports.index = async (req, res) => {
    try {
        if (!req.query.search) {
            const cafes = await Cafe.findAll();
            return res.status(200).json({
                status: "success",
                data: cafes
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
        `)
                },
                order: Sequelize.literal(`
        similarity(unaccent(lower(name)), unaccent(lower('${keyword}'))) DESC
      `)
            });

            res.json({ status: "success", data: cafes });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

exports.searchById = async (req, res) => {
    return res.status(200).json({
        status: "success"
    });
}
