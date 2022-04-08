const mongoose = require("mongoose");
const url =
  "mongodb+srv://eveganfashion:Aa.123456789@cluster0.h7nxp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(url, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", url);
});

db.on("error", (err) => {
  console.error("connection error:", err);
});

module.exports = mongoose;
