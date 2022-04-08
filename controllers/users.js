const expInst = require("express");
const router = expInst.Router();
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const jwt = require("jsonwebtoken");

//NOTE(UI):This path should be similar to action in form

//Sign up API
router.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const userExists = await User.exists({ username: req.body.username });

    if (userExists) {
      res.send("Username Already Exists");
    } else {
      const { username, name, password, shippingAddress, phoneNumber } =
        req.body;
      const user = new User({
        username,
        name,
        password,
        shippingAddress,
        phoneNumber,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save(function (error, document) {
        if (error) {
          console.error(error);
          res.status(500).send("Error Occurred - " + error);
        } else {
          const payload = {
            user: {
              id: user.id,
            },
          };

          // Creating authentication for user
          jwt.sign(
            payload,
            "tokenCheck",
            {
              expiresIn: 3600,
            },
            (err, token) => {
              if (err) throw err;
              const message = "New User Created";
              res.status(200).json({
                message,
                token,
              });
            }
          );
        }
        console.log(document);
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

//Login Api
router.post("/login", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  try {
    let user = await User.findOne({
      username,
    });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password!",
        });
      const payload = {
        user: {
          id: user.id,
        },
      };
      // Generating token authentication for user
      jwt.sign(
        payload,
        "tokenCheck",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          const message = "Logged-in Successfully";
          res.status(200).json({
            message,
            token,
          });
        }
      );
    } else {
      res.status(400).send("Username Does not Exists");
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

//Updating User address
router.put("/updateAddress", auth, async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.user.id);

    const { shippingAddress } = req.body;
    const userId = user.id;
    User.updateOne(
      { _id: userId },
      { $set: { shippingAddress: shippingAddress } },
      function (error, document) {
        if (error) {
          console.error(error);
          res.status(500).send("Error Occurred - " + error);
        }
        const message = "Address Updated succesfully";
        res.status(200).json({
          message,
        });
      }
    ).clone;
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error " + e,
    });
  }
});

module.exports = router;
