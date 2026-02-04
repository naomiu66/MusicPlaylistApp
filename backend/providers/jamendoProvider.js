const API_URL = process.env.JAMENDO_API_URL;
const CLIENT_ID = process.env.JAMENDO_API_CLIENT_ID;

module.exports = {
  async searchTracks(query) {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      format: "json",
      search: query,
      limit: "20",
    });

    const response = await fetch(`${API_URL}/tracks?${params}`);

    if (!response.ok) {
      console.error("Jamendo API error: ", response.status);
    }

    const data = await response.json();

    return data;
  },

  async searchArtists(query) {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      format: "json",
      namesearch: query,
      limit: "20",
    });

    const response = await fetch(`${API_URL}/artists?${params}`);

    if (!response.ok) {
      console.error("Jamendo API error: ", response.status);
    }

    const data = await response.json();

    return data;
  },
};
