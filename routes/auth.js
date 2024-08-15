const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "SandeepKumar@136";

//Route 1 Create a user using POST: '/api/auth/signup' Doesn't require login
router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      });

      const payload = {
        user: {
          id: user.id
        },
      };

      const Authtoken = jwt.sign(payload, JWT_SECRET);

      res.json({Authtoken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route 2 Authenticate a user using POST: '/api/auth/login' Doesn't require login

router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password Cannot be blank").exists(),
  ],
  async (req, res) => {
   let success=false;
    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct Credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct Credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      const Authtoken = jwt.sign(payload, JWT_SECRET);
      success=true;
      res.json({success, Authtoken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Get loggedin User Details using: POST 'api/auth/getuser' login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
