const Review = require("../../models/Review");
const User = require("../../models/User");

exports.store = async (req, res) => {
    try {
        const { user_id, guest_name, cafe_id, rating, comment } = req.body;

        // Validation
        if (!cafe_id || rating === undefined) {
            return res.status(400).json({ code: 400, message: "Missing required fields" });
        }
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ code: 400, message: "Rating must be between 0 and 5" });
        }
        if (comment && comment.length > 500) {
            return res.status(400).json({ code: 400, message: "Comment too long" });
        }

        const review = await Review.create({
            user_id: user_id || null,
            cafe_id,
            rating,
            comment
        });

        console.log(review);
        

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
        if (!cafe_id) {
            return res.status(400).json({ code: 400, message: "Cafe ID is required" });
        }
        const reviews = await Review.findAll({
            where: { cafe_id: cafe_id },
            attributes: ["id", "rating", "comment", "created_at"],
            include: [
                {
                    model: User,
                    attributes: ["id", "username"],
                    as: "user"
                }
            ],
            order: [["created_at", "DESC"]]
        });

        return res.status(200).json({
            code: 200,
            data: reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ code: 500, message: "Internal server error" });
    }
};
