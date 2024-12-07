const querystring = require('querystring');

exports.handler = async (event, context) => {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
  const SPOTIFY_SCOPES = "user-top-read playlist-modify-public";

  // Spotify Auth URL
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: SPOTIFY_SCOPES,
  })}`;

  // Rückgabe einer Weiterleitung (302: Temporäre Umleitung)
  return {
    statusCode: 301,
    headers: {
      Location: spotifyAuthUrl,
    },
  };
};

