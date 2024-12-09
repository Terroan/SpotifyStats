const querystring = require("querystring");

export const handler = async function (event, context) {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
  const SPOTIFY_SCOPES = "user-read-private,playlist-modify-public";

  // Query-Parameter auslesen
  const queryParams = event.queryStringParameters;
  console.log("Event: " + queryParams.selectedTracks  + " EVENt");
  const selectedTracks = queryParams.selectedTracks
    ? JSON.parse(queryParams.selectedTracks)
    : null;

  // Spotify Auth-URL erstellen
  let spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&scope=${SPOTIFY_SCOPES}&show_dialog=true&redirect_uri=${SPOTIFY_REDIRECT_URI}`;
  
  // Zustand (State) mit Track-URIs hinzufügen
  if (selectedTracks) {
    const state = { selectedTracks };
    spotifyAuthUrl += `&state=${encodeURIComponent(JSON.stringify(state))}`;
  }


  // Weiterleitung an Spotify
  return {
    statusCode: 301,
    headers: {
      Location: spotifyAuthUrl,
    },
  };
};
