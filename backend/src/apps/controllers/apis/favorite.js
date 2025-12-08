const Favorite = require("../../models/Favorite");
const Cafe = require("../../models/Cafe");

/**
 * POST /favorites
 * Add a cafe to user's favorites list
 * Body: { user_id, cafe_id }
 */
exports.addFavorite = async (req, res) => {
  try {
    const { user_id, cafe_id } = req.body;

    // Validate input
    if (!user_id || !cafe_id) {
      return res.status(400).json({
        status: "error",
        message: "user_id and cafe_id are required",
        data: null,
      });
    }

    // Check if cafe exists
    const cafe = await Cafe.findByPk(cafe_id);
    if (!cafe) {
      return res.status(404).json({
        status: "error",
        message: "Cafe not found",
        data: null,
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      where: { user_id, cafe_id },
    });

    if (existingFavorite) {
      return res.status(409).json({
        status: "error",
        message: "Cafe is already in favorites",
        data: null,
      });
    }

    // Create favorite
    const favorite = await Favorite.create({ user_id, cafe_id });

    return res.status(201).json({
      status: "success",
      message: "Cafe added to favorites successfully",
      data: {
        id: favorite.id,
        user_id: favorite.user_id,
        cafe_id: favorite.cafe_id,
        created_at: favorite.created_at,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
      data: null,
    });
  }
};

/**
 * DELETE /favorites/:cafe_id
 * Remove a cafe from user's favorites list
 * Query: ?user_id=xxx
 */
exports.removeFavorite = async (req, res) => {
  try {
    const { cafe_id } = req.params;
    const { user_id } = req.query;

    // Validate input
    if (!user_id) {
      return res.status(400).json({
        status: "error",
        message: "user_id query parameter is required",
        data: null,
      });
    }

    if (!cafe_id || isNaN(cafe_id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid cafe_id",
        data: null,
      });
    }

    // Find and delete favorite
    const favorite = await Favorite.findOne({
      where: { user_id, cafe_id },
    });

    if (!favorite) {
      return res.status(404).json({
        status: "error",
        message: "Favorite not found",
        data: null,
      });
    }

    await favorite.destroy();

    return res.status(200).json({
      status: "success",
      message: "Cafe removed from favorites successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
      data: null,
    });
  }
};

/**
 * GET /favorites/:user_id
 * Get user's favorites list with cafe details
 */
exports.getFavorites = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate input
    if (!user_id || isNaN(user_id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user_id",
        data: null,
      });
    }

    // Get favorites with cafe details
    const favorites = await Favorite.findAll({
      where: { user_id },
      include: [
        {
          model: Cafe,
          attributes: [
            "id",
            "name",
            "address",
            "phone_number",
            "open_time",
            "close_time",
            "main_image",
            "rating",
            "rating_count",
            "has_wifi",
            "has_parking",
            "has_air_conditioning",
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      status: "success",
      message: "Favorites retrieved successfully",
      count: favorites.length,
      data: favorites.map((fav) => ({
        id: fav.id,
        user_id: fav.user_id,
        cafe_id: fav.cafe_id,
        created_at: fav.created_at,
        cafe: fav.Cafe,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
      data: null,
    });
  }
};

