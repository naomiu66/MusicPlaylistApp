const provider = require("../providers/lastfmProvider");

module.exports = {
  async getTracks(query) {
    return await provider.searchTracks(query);
  },

  async getArtists(query) {
    return await provider.searchArtists(query);
  },
};
