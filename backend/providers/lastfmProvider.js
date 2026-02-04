const API_URL = process.env.LASTFM_API_URL;
const API_KEY = process.env.LASTFM_API_KEY;

module.exports = {
  async searchTracks(query) {
    const params = new URLSearchParams({
      method: "track.search",
      format: "json",
      api_key: API_KEY,
      track: query.text,
      page: query.page,
      limit: query.limit,
      artist: query.artist ?? query.text,
    });

    const response = await fetch(`${API_URL}/?${params}`);

    if (!response.ok) {
      console.error("Failed to fetch data from Last FM", response.status);
    }

    const data = await response.json();

    return data;
  },

  async getTrackInfo (query) {
    const params = new URLSearchParams({
        method: "track.getInfo",
        format: "json",
        api_key: API_KEY,
        mbid: query.mbid,
        track: query.track,
        artist: query.artist,
        autocorrect: 1,
    })
  },

  async searchArtists(query) {
    const params = new URLSearchParams({
      method: "artist.search",
      format: "json",
      api_key: API_KEY,
      artist: query.text,
      page: query.page,
      limit: query.limit,
    });

    const response = await fetch(`${API_URL}/?${params}`);

    if (!response.ok) {
      console.error("Failed to fetch data from Last FM", response.status);
    }

    const data = await response.json();

    return data;
  },
};
