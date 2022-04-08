const mongoose = require("../database");

const CartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  qty: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
