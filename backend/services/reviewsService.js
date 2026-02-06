const Review = require("../models/Review");
const ValidationError = require("../errors/ValidationError");
const ForbiddenError = require("../errors/ForbiddenError");

module.exports = {
  async createReview(payload) {
    if (!payload.userId) {
      throw new ValidationError("User id is required");
    }

    if (!payload.release) {
      throw new ValidationError("Release data is required");
    }

    const { type, artist, title } = payload.release;

    if (!type || !["track", "album"].includes(type)) {
      throw new ValidationError("Release type must be 'track' or 'album'");
    }
    if (!artist) {
      throw new ValidationError("Artist is required");
    }
    if (!title) {
      throw new ValidationError("Title is required");
    }
    if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
      throw new ValidationError("Rating must be a number between 1 and 5");
    }

    return await Review.create(payload);
  },

  async getReviews(params) {
    console.log(params);
    let { page = 1, limit = 30, artist, title } = params;

    page = Math.max(Number(page), 1);
    limit = Math.max(Number(limit), 1);

    const skip = (page - 1) * limit;

    const filter = {};
    if ((artist && !title) || (!artist && title)) {
      throw new ValidationError("Artist and title must be provided together");
    }

    if (artist && title) {
      filter["release.artist"] = {
        $regex: `^${artist}$`,
        $options: "i",
      };
      filter["release.title"] = {
        $regex: `^${title}$`,
        $options: "i",
      };
    }

    const [reviews, total] = await Promise.all([
      Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),

      Review.countDocuments(filter),
    ]);

    return {
      items: reviews,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getReviewById(id) {
    return await Review.findById(id);
  },

  async updateReview(id, payload, userId) {
    delete payload.userId;

    if (payload.release !== undefined)
      throw new ValidationError("You can not update release data");

    const updateFields = {};
    if (payload.rating !== undefined) {
      const rating = Number(payload.rating);
      if (rating < 1 || rating > 5) {
        throw new ValidationError("Rating must be between 1 and 5");
      }
      updateFields.rating = rating;
    }

    if (payload.comment !== undefined) {
      updateFields.comment = payload.comment;
    }

    console.log(updateFields);
    if (Object.keys(updateFields).length === 0) {
      throw new ValidationError("Nothing to update");
    }

    const updatedReview = await Review.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!updatedReview) {
      throw new ForbiddenError("You cannot update this review");
    }

    return updatedReview;
  },

  async deleteReview(id, userId) {
    const deletedReview = await Review.findByIdAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedReview) {
      throw new ForbiddenError();
    }

    return deletedReview;
  },
};
