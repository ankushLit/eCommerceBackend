const mongoose = require("../database");

const ReviewSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    comment: String,
    rating: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reviews", ReviewSchema);
