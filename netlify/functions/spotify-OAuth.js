const querystring = require('querystring');

export const handler = async function (event, context) {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI; // Diese URI sollte bereits korrekt in deiner .env-Datei oder Umgebungsvariable definiert sein
  const SPOTIFY_SCOPES = "user-top-read playlist-modify-public";

  // Spotify Auth URL
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI, // Achte darauf, dass du hier keinen encodeURIComponent verwendest
    scope: SPOTIFY_SCOPES,
  })}`;

  // Weiterleitung an die Auth-URL
  return {
    statusCode: 301,
    headers: {
      Location: spotifyAuthUrl,
    },
  };
};
