const reviewsService = require("../services/reviewsService");
const ValidationError = require("../errors/ValidationError");
const ForbiddenError = require("../errors/ForbiddenError");
const ConflictError = require("../errors/ConflictError");

module.exports = {
  async createReview(req, res) {
    try {
      req.body.userId = req.userId;
      const review = await reviewsService.createReview(req.body);
      return res.status(201).json(review);
    } catch (err) {
      console.error("Failed to create review", err);
      if (err instanceof ValidationError) {
        return res.status(400).json({ message: err.message });
      }
      if (err instanceof ConflictError) {
        return res.status(409).json({ message: err.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getReviews(req, res) {
    try {
      console.log(req.query);
      const params = {
        page: req.query.page,
        limit: req.query.limit,
        artist: req.query.artist,
        title: req.query.title,
      };
      const data = await reviewsService.getReviews(params);
      return res.json(data);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ message: err.message });
      }

      console.error("Failed to fetch reviews", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getReviewById(req, res) {
    try {
      const id = req.params.id;
      if (!id)
        return res
          .status(400)
          .json({ message: "Required params are not provided" });
      const data = await reviewsService.getReviewById(id);

      if (!data) return res.status(404).json({ message: "Not found" });

      return res.json(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async updateReview(req, res) {
    try {
      const id = req.params.id;
      const payload = req.body;
      const userId = req.userId;

      console.log(req.body);

      const updatedData = await reviewsService.updateReview(
        id,
        payload,
        userId,
      );

      if (!updatedData) return res.status(404).json({ message: "Not found" });

      return res.json(updatedData);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ message: err.message });
      }
      if (err instanceof ForbiddenError) {
        return res.status(403).json({ message: err.message });
      }

      console.error("Failed to update review", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async deleteReview(req, res) {
    try {
      const id = req.params.id;
      const userId = req.userId;
      const deletedData = await reviewsService.deleteReview(id, userId);

      if (!deletedData) return res.status(404).json({ message: "Not found" });

      return res.status(204).json({ message: "Successfully deleted" });
    } catch (err) {
      console.error("Failed to delete review", err);
      if (err instanceof ForbiddenError) {
        return res.status(403).json({ message: err.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
