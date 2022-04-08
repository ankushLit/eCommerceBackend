const { Decimal128 } = require("mongodb");
const mongoose = require("../database");

const ProductSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Decimal128,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  seller: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: false,
  },
  quantityInStock: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
