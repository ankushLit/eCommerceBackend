const expInst = require("express");
const router = expInst.Router();
const Product = require("../models/products");

//Get all products
router.get("/products", async (req, res) => {
  try {
    const searchQuery = req.query.productName;
    const searchQueryId = req.query.id;
    //Searching by productName if passed in query parameters
    if (searchQuery != null && searchQuery.length > 0) {
      const regex = new RegExp(searchQuery, "i"); // i for case insensitive
      await Product.find(
        { productName: { $regex: regex } },
        function (error, products) {
          if (error) {
            res.status(500).json({
              message: "Error Occurred finding products",
            });
          }
          res.status(200).send(products);
        }
      ).clone();
    }
    //Searching by productId if passed in query parameters
    else if (searchQueryId != null && searchQueryId.length > 0) {
      await Product.findById(searchQueryId, function (error, products) {
        if (error) {
          res.status(500).json({
            message: "Error Occurred finding products",
          });
        }
        res.status(200).send(products);
      }).clone();
    } else {
      await Product.find(function (error, products) {
        if (error) {
          res.status(500).json({
            message: "Error Occurred finding products",
          });
        }
        res.status(200).send(products);
      }).clone();
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error " + e,
    });
  }
});

//Add Product
router.post("/products", async (req, res) => {
  console.log(req.body);

  try {
    const {
      productName,
      description,
      price,
      brand,
      seller,
      imgUrl,
      quantityInStock,
      reviews,
    } = req.body;

    const product = new Product({
      productName,
      description,
      price,
      brand,
      seller,
      imgUrl,
      quantityInStock,
      reviews,
    });

    await product.save(function (error, document) {
      if (error) {
        console.error(error);
        res.status(500).send("Error Occurred - " + error);
      }
      const message = "New Product Added";
      res.status(200).json({
        message,
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
