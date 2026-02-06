const ExternalApiError = require("../errors/ExternalApiError");
const CacheService = require("../services/cacheService");

const API_URL = process.env.LASTFM_API_URL;
const API_KEY = process.env.LASTFM_API_KEY;

const TTL = 60 * 60 * 4;
const lastfmCacheService = new CacheService("lastfm:", TTL);

const sendRequest = async (params, cacheKey) => {
  const cached = await lastfmCacheService.get(
    cacheKey.namespace,
    cacheKey.params,
  );

  if (cached) return cached;

  const response = await fetch(`${API_URL}/?${params}`);
  if (!response.ok) {
    const body = await response.text();

    throw new ExternalApiError(
      "Last.fm API request failed",
      response.status,
      body,
    );
  }
  const data = await response.json();

  if (data?.error) {
    throw new ExternalApiError(`Last.fm API error: ${data.message}`, 502, data);
  }

  await lastfmCacheService.set(cacheKey.namespace, cacheKey.params, data, TTL);
  return data;
};

module.exports = {
  async searchAlbums(query) {
    const params = new URLSearchParams({
      method: "album.search",
      format: "json",
      api_key: API_KEY,
      album: query.album,
      page: query.page ?? 1,
      limit: query.limit ?? 30,
    });

    const cacheKey = {
      namespace: "album.search",
      params: {
        album: query.album,
        page: query.page ?? 1,
        limit: query.limit ?? 30,
      },
    };

    const response = await sendRequest(params, cacheKey);
    return response;
  },

  async searchTracks(query) {
    const params = new URLSearchParams({
      method: "track.search",
      format: "json",
      api_key: API_KEY,
      track: query.track,
      page: query.page ?? 1,
      limit: query.limit ?? 30,
      artist: query.artist ?? "",
    });

    const cacheKey = {
      namespace: "track.search",
      params: {
        track: query.track,
        page: query.page ?? 1,
        limit: query.limit ?? 30,
        artist: query.artist ?? "",
      },
    };

    const response = await sendRequest(params, cacheKey);
    return response;
  },

  async getTrackInfo(query) {
    const params = new URLSearchParams({
      method: "track.getInfo",
      format: "json",
      api_key: API_KEY,
      mbid: query.mbid,
      track: query.track,
      artist: query.artist,
      autocorrect: 1,
    });

    const cacheKey = {
      namespace: "track.getInfo",
      params: {
        mbid: query.mbid,
        track: query.track,
        artist: query.artist,
      },
    };

    const response = await sendRequest(params, cacheKey);
    return response;
  },

  async getAlbumInfo(query) {
    const params = new URLSearchParams({
      method: "album.getInfo",
      format: "json",
      api_key: API_KEY,
      mbid: query.mbid,
      album: query.album,
      artist: query.artist,
      autocorrect: 1,
    });

    const cacheKey = {
      namespace: "album.getInfo",
      params: {
        mbid: query.mbid,
        album: query.album,
        artist: query.artist,
      },
    };

    const response = await sendRequest(params, cacheKey);
    return response;
  },

  async searchArtists(query) {
    const params = new URLSearchParams({
      method: "artist.search",
      format: "json",
      api_key: API_KEY,
      artist: query.artist,
      page: query.page ?? 1,
      limit: query.limit ?? 30,
    });

    const cacheKey = {
      namespace: "artist.search",
      params: {
        artist: query.artist,
        page: query.page ?? 1,
        limit: query.limit ?? 30,
      },
    };

    const response = await sendRequest(params, cacheKey);
    return response;
  },
};
