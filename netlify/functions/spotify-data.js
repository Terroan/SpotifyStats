const axios = require("axios");

// fetch data from spotify api
export const handler = async function (event, context) {
  const accessToken = event.queryStringParameters.access_token;
  const limit = 15;

  try {

    // Profile
    const profileRes = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Songs - Recently Played
    const tracksResRecently = await axios.get("https://api.spotify.com/v1/me/player/recently-played", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: limit,
      },
    });

    // Top songs - long term
    const tracksResLong = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        time_range: "long_term", // overall top song
        limit: limit,
      },
    });

    // Top songs - medium term
    const tracksResMedium = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        time_range: "medium_term",
        limit: limit,
      },
    });

    // Top songs - short term
    const tracksResShort = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        time_range: "short_term",
        limit: limit,
      },
    });

    // Top artists - Long term
    const artistsResLong = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        time_range: "long_term", // overall top artists
        limit: limit,
      },
    });

    // Top artists - Medium term
    const artistsResMedium = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        time_range: "medium_term",
        limit: limit,
      },
    });

    // Top artists - Short term
    const artistsResShort = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        time_range: "short_term",
        limit: limit,
      },
    });

    const spotifyData = {
      profile: profileRes.data, // Nur das `data`-Objekt verwenden
      tracksRecentlyPlayed: tracksResRecently.data, // Nur das `data`-Objekt verwenden
      topTracksLong: tracksResLong.data, // Nur das `data`-Objekt verwenden
      topTracksMedium: tracksResMedium.data, // Nur das `data`-Objekt verwenden
      topTracksShort: tracksResShort.data, // Nur das `data`-Objekt verwenden
      topArtistsLong: artistsResLong.data, // Nur das `data`-Objekt verwenden
      topArtistsMedium: artistsResMedium.data, // Nur das `data`-Objekt verwenden
      topArtistsShort: artistsResShort.data, // Nur das `data`-Objekt verwenden
    };

    return {
      statusCode: 200,
      body: JSON.stringify(spotifyData),
    };
  } catch (error) {
    console.error("Error fetching spotify data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching spotify data" }),
    };
  }
};
