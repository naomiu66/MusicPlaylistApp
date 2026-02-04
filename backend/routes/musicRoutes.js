const express = require("express");
const router = express.Router();
const musicController = require("../controllers/musicController");

router
  .get("/tracks", musicController.searchTracks)
  .get("/artists", musicController.searchArtists);

module.exports = router;
