const expInst = require("express");
const router = expInst.Router();
const auth = require("../auth");
const Cart = require("../models/cart");
const User = require("../models/users");
const Product = require("../models/products");

//Add Product to cart
router.post("/cart", auth, async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.user.id);

    const { productId, qty } = req.body;
    const userId = user.id;
    const cart = new Cart({
      userId,
      productId,
      qty,
    });

    //Check if the user has already added the product in the cart and increase the quantity
    const productExists = await Cart.exists({
      productId: productId,
      userId: userId,
    });
    if (productExists) {
      await Cart.find(
        { productId: productId, userId: userId },
        function (error, products) {
          if (error) {
            console.error(error);
            res.status(500).send("Error Occurred - " + error);
          }
          products.forEach((doc) => {
            const newQty = qty + doc.qty;
            Cart.updateOne(
              { _id: doc.id },
              { $set: { qty: newQty } },
              function (error, document) {
                if (error) {
                  console.error(error);
                  res.status(500).send("Error Occurred - " + error);
                }
                const message = "Product Quantity Incremented";
                res.status(200).json({
                  message,
                });
              }
            );
          });
        }
      ).clone();
    } else {
      await cart.save(function (error, document) {
        if (error) {
          console.error(error);
          res.status(500).send("Error Occurred - " + error);
        }
        const message = "Product Added to cart";
        res.status(200).json({
          message,
        });
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error " + e,
    });
  }
});

//Increament the quantity of product in cart
router.put("/cart", auth, async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.user.id);

    const { productId, qty } = req.body;
    const userId = user.id;

    //Check if the user has already added the product in the cart and increase the quantity
    const productExists = await Cart.exists({
      productId: productId,
      userId: userId,
    });
    if (productExists) {
      await Cart.find(
        { productId: productId, userId: userId },
        function (error, products) {
          if (error) {
            console.error(error);
            res.status(500).send("Error Occurred - " + error);
          }
          products.forEach((doc) => {
            const newQty = qty + doc.qty;
            Cart.updateOne(
              { _id: doc.id },
              { $set: { qty: newQty } },
              function (error, document) {
                if (error) {
                  console.error(error);
                  res.status(500).send("Error Occurred - " + error);
                }
                const message = "Product Quantity Incremented";
                res.status(200).json({
                  message,
                });
              }
            );
          });
        }
      ).clone();
    } else {
      res.status(500).send("Error Occurred - Product Not in cart");
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error " + e,
    });
  }
});

//Delete Product from cart
router.delete("/cart", auth, async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.user.id);

    const { productId } = req.query;
    const userId = user.id;

    //Check if the user has already added the product in the cart
    const productExists = await Cart.exists({
      productId: productId,
      userId: userId,
    });
    if (productExists) {
      await Cart.deleteOne(
        { productId: productId, userId: userId },
        function (error, response) {
          if (error) {
            console.error(error);
            res.status(500).send("Error Occurred - " + error);
          }
          const message = "Product Removed from cart";
          res.status(200).json({
            message,
          });
        }
      ).clone();
    } else {
      res.status(500).send("Error Occurred - Product Not in cart");
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error " + e,
    });
  }
});

//Get all cart items
router.get("/cart", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userId = user.id;

    await Cart.find({ userId: userId }, async (error, items) => {
      if (error) {
        res.status(500).json({
          message: "Error Occurred finding cart",
        });
      }
      // Waiting for foreach loop
      var products = [];
      var p1 = new Promise((resolve, reject) => {
        console.log("heyy");
        if (items.length <= 0) resolve();
        items.forEach(async (item, index, array) => {
          const productDetails = await Product.findById(item.productId);
          const newItem = {
            id: item.id,
            product: productDetails,
            qty: item.qty,
          };
          products.push(newItem);
          if (index == array.length - 1) resolve();
        });
      });
      p1.then(() => {
        res.status(200).send(products);
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
