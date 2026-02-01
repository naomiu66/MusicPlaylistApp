const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router
  .post("/register", authController.register)
  .post("/login", authController.login)
  .post("/refresh", auth.verifyRefreshToken, authController.refresh)
  .post("/logout", auth.authenticateToken, authController.logout)

module.exports = router;
