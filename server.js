const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));

const users = require("./controllers/users");
app.use("/", users);
const products = require("./controllers/products");
app.use("/", products);
const cart = require("./controllers/cart");
app.use("/", cart);
const orders = require("./controllers/orders");
app.use("/", orders);
const reviews = require("./controllers/review");
app.use("/", reviews);
app.listen(3000, function () {
  console.log("listening on 3000");
});

module.exports = app;
