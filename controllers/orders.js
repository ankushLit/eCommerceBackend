const expInst = require("express");
const router = expInst.Router();
const auth = require("../auth");
const Order = require("../models/orders");
const User = require("../models/users");
const Product = require("../models/products");

//Add to orders
router.post("/order", auth, async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.user.id);

    const { products, totalAmount } = req.body;
    const userId = user.id;
    const order = new Order({
      products,
      userId,
      totalAmount,
    });

    await order.save(function (error, document) {
      if (error) {
        console.error(error);
        res.status(500).send("Error Occurred - " + error);
      }

      const message = "SuccessFully Ordered";
      res.status(200).json({
        message,
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error " + e,
    });
  }
});

//Get all orders
router.get("/orders", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userId = user.id;
    var allOrders = [];
    await Order.find({ userId: userId }, async (error, orders) => {
      if (error) {
        res.status(500).json({
          message: "Error Occurred finding products",
        });
      }
      // Waiting for foreach loop
      var p1 = new Promise((resolve, reject) => {
        if (orders.length <= 0) resolve();
        orders.forEach(async (order, index, array) => {
          var products = [];
          const neworder = {
            id: order.id,
            products: products,
            userId: userId,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          };
          // Waiting for foreach loop
          var p2 = new Promise((resolve, reject) => {
            order.products.forEach(async (pro, index, array) => {
              console.log();
              const productDetails = await Product.findById(pro.productId);
              qtyBought = pro.qty;
              const productDetailsWithQty = {
                productDetails,
                qtyBought,
              };
              neworder.products.push(productDetailsWithQty);
              if (index == array.length - 1) resolve();
            });
          });
          p2.then(() => {
            allOrders.push(neworder);
            if (index == array.length - 1) resolve();
          });
        });
      });
      p1.then(() => {
        res.status(200).send(allOrders);
      });
    }).clone();
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error " + e,
    });
  }
});

module.exports = router;
