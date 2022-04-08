const expInst = require("express");
const router = expInst.Router();
const auth = require("../auth");
const Order = require("../models/orders");
const User = require("../models/users");
const Review = require("../models/review");

// Add reviews
router.post("/review", auth, async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.user.id);

    const { productId, comment, rating } = req.body;
    const userId = user.id;

    const orderExists = await Order.exists({
      "products.productId": productId,
      userId: userId,
    });

    if (orderExists) {
      const review = new Review({
        productId,
        userId,
        comment,
        rating,
      });

      await review.save(function (error, document) {
        if (error) {
          console.error(error);
          res.status(500).send("Error Occurred - " + error);
        }

        const message = "Comment Added successfully";
        res.status(200).json({
          message,
        });
      });
    } else {
      res.status(500).json({
        message: "You Haven't purchased the product",
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error " + e,
    });
  }
});

//get Reviews based on product
router.get("/review", async (req, res) => {
  try {
    const searchQuery = req.query.productId;
    await Review.find({ productId: searchQuery }, function (error, reviews) {
      if (error) {
        res.status(500).json({
          message: "Error Occurred finding products",
        });
      }
      res.status(200).send(reviews);
    }).clone();
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error " + e,
    });
  }
});
module.exports = router;
