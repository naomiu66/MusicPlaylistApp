const musicService = require('../services/musicService');

module.exports = {
  async searchTracks(req, res) {
    try {
      const query = {
        text: req.query.text ?? "",
        artist: req.query.artist ?? "",
        page: Number(req.query.page),
        limit: Number(req.query.limit),
      };
      const tracksData = await musicService.getTracks(query);

      res.json(tracksData);
    } catch (err) {
      console.error("Failed to fetch tracks", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async searchArtists(req, res) {
    try {
      const query = {
        text: req.query.text ?? "",
        page: Number(req.query.page),
        limit: Number(req.query.limit),
      };
      const tracksData = await musicService.getArtists(query);
      res.json(tracksData);
    } catch (err) {
      console.error("Failed to fetch artists", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
