const Favorite = require("../../models/Favorite");
const Cafe = require("../../models/Cafe");
const { addHours } = require("../../../common/time");


// Mock data for demo purposes
const mockFavorites = [
  {
    id: 1,
    user_id: 1,
    cafe_id: 1,
    created_at: "2025-10-15T08:30:00Z",
    cafe: {
      id: 1,
      name: "ブルースカイ珈琲",
      address: "千代田1-2-3 / 8:00-20:00 / 電源あり",
      phone_number: "03-1234-5678",
      open_time: "08:00:00",
      close_time: "20:00:00",
      main_image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80",
      rating: 4.8,
      rating_count: 156,
      has_wifi: true,
      has_parking: true,
      has_air_conditioning: true,
    },
  },
  {
    id: 2,
    user_id: 1,
    cafe_id: 2,
    created_at: "2025-09-22T14:20:00Z",
    cafe: {
      id: 2,
      name: "駅前カフェ",
      address: "渋谷1-4-5 / 9:00-22:00 / Wi-Fi◎",
      phone_number: "03-2345-6789",
      open_time: "09:00:00",
      close_time: "22:00:00",
      main_image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
      rating: 4.2,
      rating_count: 89,
      has_wifi: true,
      has_parking: false,
      has_air_conditioning: true,
    },
  },
  {
    id: 3,
    user_id: 1,
    cafe_id: 3,
    created_at: "2025-08-30T10:15:00Z",
    cafe: {
      id: 3,
      name: "森のロースター",
      address: "渋谷4-8-3 / 7:00-19:00 / テラス席",
      phone_number: "03-3456-7890",
      open_time: "07:00:00",
      close_time: "19:00:00",
      main_image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80",
      rating: 4.5,
      rating_count: 124,
      has_wifi: true,
      has_parking: true,
      has_air_conditioning: false,
    },
  },
];

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
        created_at: addHours(favorite.created_at, 14),
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

    // Mock delete for demo (user_id = 1)
    if (user_id == 1) {
      const index = mockFavorites.findIndex((fav) => fav.cafe_id == cafe_id);
      if (index !== -1) {
        mockFavorites.splice(index, 1);
        return res.status(200).json({
          status: "success",
          message: "Cafe removed from favorites successfully",
          data: null,
        });
      } else {
        return res.status(404).json({
          status: "error",
          message: "Favorite not found",
          data: null,
        });
      }
    }

    // Find and delete favorite from database
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
    // Get favorites with cafe details from database
    const favorites = await Favorite.findAll({
      where: { user_id: 2 },
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
        created_at: addHours(fav.created_at, 7),
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

