const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const usersController = require("../controllers/usersController");

router
  .get("/profile", auth.authenticateToken, usersController.getProfile)
  .get("/profile/:id", auth.authenticateToken, usersController.getOtherProfile);

module.exports = router;
