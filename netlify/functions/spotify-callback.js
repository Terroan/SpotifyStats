const axios = require('axios');
const querystring = require('querystring');

export const handler = async function (event, context) {
  console.log('Eingehender Event:', event);  // Logge den Event, um zu prüfen, ob die Anfrage ankommt 
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

  console.log("1111111111111111111111111111111111111111111111111S");
  // Extrahiere den Code aus der URL
  const code = event.queryStringParameters.code;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Fehlender Autorisierungscode!' }),
    };
  }

  // Hole die Track-URIs von der Anfrage (die vom Frontend übergeben werden)
  const trackUris = event.body ? JSON.parse(event.body).trackUris : [];

  if (!trackUris || trackUris.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Keine Tracks übergeben!' }),
    };
  }

  try {
    // Base64-Encoded Authorization-Header für den Token-Austausch
    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    
    // Tausche den Autorisierungscode gegen ein Access Token aus
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Hole die Top-Songs des Benutzers
    const topTracksResponse = await axios.get(
      'https://api.spotify.com/v1/me/top/tracks',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Extrahiere die Track-URIs
    const trackUris = topTracksResponse.data.items.map(track => track.uri);

    // Erstelle die Playlist
    const playlistResponse = await axios.post(
      'https://api.spotify.com/v1/me/playlists',
      {
        name: 'Meine Benutzerdefinierte Playlist',
        description: 'Playlist basierend auf den übergebenen Tracks!',
        public: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const playlistId = playlistResponse.data.id;

    // Füge die übergebenen Tracks zur Playlist hinzu
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: trackUris, // Track-URIs, die vom Frontend übergeben wurden
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Erfolgreiche Erstellung der Playlist und Weiterleitung
    return {
      statusCode: 302,
      headers: {
        Location: '/qeS', // Redirect zur Homepage nach erfolgreicher Erstellung
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Fehler beim Erstellen der Playlist', error: error.message }),
    };
  }
};
