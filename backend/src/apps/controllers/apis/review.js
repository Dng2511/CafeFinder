const Review = require("../../models/Review");
const sequelize = require("../../../common/database");
const { QueryTypes } = require('sequelize');

exports.store = async (req, res) => {
    try {
        const { user_id, cafe_id, rating, comment } = req.body;

        // Validation
        if (!user_id || !cafe_id || rating === undefined) {
            return res.status(400).json({ code: 400, message: "Missing required fields" });
        }
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ code: 400, message: "Rating must be between 0 and 5" });
        }
        if (comment && comment.length > 500) {
            return res.status(400).json({ code: 400, message: "Comment too long" });
        }

        const review = await Review.create({
            user_id,
            cafe_id,
            rating,
            comment
        });

        return res.status(201).json({
            code: 201,
            message: "Review submitted successfully",
            data: review
        });
    } catch (error) {
        console.error("Error submitting review:", error);
        return res.status(500).json({ code: 500, message: "Internal server error", error: error.message });
    }
};

exports.index = async (req, res) => {
    try {
        const { cafe_id } = req.params;

        const reviews = await sequelize.query(
            `SELECT r.id, r.user_id, r.cafe_id, r.rating, r.comment, r.created_at, u.username 
             FROM reviews r 
             LEFT JOIN users u ON r.user_id = u.id 
             WHERE r.cafe_id = :cafe_id 
             ORDER BY r.created_at DESC`,
            {
                replacements: { cafe_id },
                type: QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            code: 200,
            data: reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ code: 500, message: "Internal server error" });
    }
};
