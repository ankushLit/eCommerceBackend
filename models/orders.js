const { Decimal128 } = require("mongodb");
const mongoose = require("../database");

const ProductSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  qty: Number,
});

const OrderSchema = mongoose.Schema(
  {
    products: [ProductSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    totalAmount: Decimal128,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema);
