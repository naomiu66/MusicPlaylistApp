const ExternalApiError = require("../errors/ExternalApiError");
const musicService = require("../services/musicService");

module.exports = {
  async searchTracks(req, res) {
    try {
      const query = {
        track: req.query.track,
        artist: req.query.artist,
        page: Number(req.query.page),
        limit: Number(req.query.limit),
      };

      if (!query.track)
        return res
          .status(400)
          .json({ message: "Required query params are not provided" });

      const data = await musicService.getTracks(query);

      return res.json(data);
    } catch (err) {
      if (err instanceof ExternalApiError) {
        return res.status(502).json({
          message: err.message,
        });
      }

      console.error("Failed to fetch tracks", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getTrackInfo(req, res) {
    try {
      const query = {
        mbid: req.query.mbid,
        track: req.query.track,
        artist: req.query.artist,
      };
      if ((!query.track || !query.artist) && !query.mbid) {
        return res
          .status(400)
          .json({ message: "Required query params are not provided" });
      }

      const data = await musicService.getTrackInfo(query);

      return res.json(data);
    } catch (err) {
      if (err instanceof ExternalApiError) {
        return res.status(502).json({
          message: err.message,
        });
      }
      console.error("Failed to fetch artists", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async searchArtists(req, res) {
    try {
      const query = {
        artist: req.query.artist ?? "",
        page: Number(req.query.page),
        limit: Number(req.query.limit),
      };

      if (!query.artist)
        return res
          .status(400)
          .json({ message: "Required query params are not provided" });

      const data = await musicService.getArtists(query);
      return res.json(data);
    } catch (err) {
      if (err instanceof ExternalApiError) {
        return res.status(502).json({
          message: err.message,
        });
      }
      console.error("Failed to fetch artists", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async searchAlbums(req, res) {
    try {
      const query = {
        limit: req.query.limit,
        page: req.query.page,
        album: req.query.album,
      };

      if (!query.album)
        return res
          .status(400)
          .json({ message: "Required query params are not provided" });

      const data = await musicService.getAlbums(query);

      return data;
    } catch (err) {
      if (err instanceof ExternalApiError) {
        return res.status(502).json({
          message: err.message,
        });
      }
      console.error("Failed to fetch albums", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAlbumInfo(req, res) {
    try {
      const query = {
        artist: req.query.artist,
        album: req.query.album,
        mbid: req.query.mbid,
      };

      // DEBUG
      console.log(query);

      if ((!query.album || !query.artist) && !query.mbid)
        return res
          .status(400)
          .json({ message: "Required query params are not provided" });

      const data = await musicService.getAlbumInfo(query);

      return data;
    } catch (err) {
      if (err instanceof ExternalApiError) {
        return res.status(502).json({
          message: err.message,
        });
      }
      console.error("Failed to fetch albums", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
