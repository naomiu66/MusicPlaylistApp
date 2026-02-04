const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    release: {
      type: { type: String, enum: ["track", "album"], required: true },
      mbid: { type: String, default: null },
      artist: { type: String, required: true },
      title: { type: String, required: true },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      // TODO: need change rating criteria
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true },
);

reviewSchema.index(
  {
    "release.type": 1,
    "release.mbid": 1,
    "release.artist": 1,
    "release.title": 1,
    userId: 1,
  },
  {
    unique: true,
    partialFilterExpression: { "release.mbid": { $exists: true } },
  },
);

reviewSchema.index(
  { "release.type": 1, "release.artist": 1, "release.title": 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: { "release.mbid": null },
  },
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
