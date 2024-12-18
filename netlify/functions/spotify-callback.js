const querystring = require('querystring');
const axios = require('axios');

export const handler = async function (event, context) {
  // Spotify API Schlüssel und Konfigurationsparameter aus Umgebungsvariablen
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
  const BASE_URI = process.env.BASE_URI;

  // Extrahiere Code und State aus der Anfrage
  const { code, state } = event.queryStringParameters;

  // State enthält die ausgewählten Tracks
  const selectedTracks = JSON.parse(state).selectedTracks;

  // Fehlerbehandlung: Kein Code gefunden
  if (!code) {
    return {
      statusCode: 302,
      headers: {
        Location: `${BASE_URI}`,
      },
      body: JSON.stringify({ message: 'Kein Authentifizierungscode gefunden' }),
    };
  }

  // Fehlerbehandlung: Keine Tracks ausgewählt
  if (!selectedTracks || selectedTracks.length < 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Keine Songs gefunden' }),
    };
  } else {
    console.log('---------- Ausgewählte Tracks:', selectedTracks, '----------');
  }

  try {
    // Basis-Authentifizierung für den Token-Endpunkt (client_id + client_secret Base64-kodiert)
    const authHeader = `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`;
    console.log('Authorization Header:', authHeader); // Debugging

    // 1. Tausche den Authentifizierungscode gegen ein Access Token aus
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Access Token aus der Antwort extrahieren
    if (tokenResponse.data && tokenResponse.data.access_token) {
      const accessToken = tokenResponse.data.access_token;
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };

      // 2. Hol das Benutzerprofil
      const profileResponse = await axios.get('https://api.spotify.com/v1/me', { headers });
      const userID = profileResponse.data.id;

      // 3. Erstelle eine neue Playlist
      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          name: 'Danis Tracks', // Name der neuen Playlist
          description: 'Eine automatisch erstellte Playlist',
          public: false, // Playlist als privat markieren
        },
        { headers }
      );
      const playlistID = playlistResponse.data.id;

      // 4. Füge Tracks zur Playlist hinzu
      const trackResponse = await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
        {
          uris: selectedTracks, // Die Track-URIs werden hier übergeben
        },
        { headers }
      );

      // Überprüfen, ob die Tracks erfolgreich hinzugefügt wurden
      if (trackResponse.status === 201) {
        console.log('Tracks erfolgreich hinzugefügt');
        return {
          statusCode: 302,
          headers: {
            Location: `${BASE_URI}/playlist-created?playlistId=${playlistID}`,
          },
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Fehler beim Hinzufügen der Tracks zur Playlist' }),
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Fehler bei der Token-Anforderung' }),
      };
    }
  } catch (error) {
    console.error('Fehler:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Ein Fehler ist aufgetreten',
        error: error.message,
        details: error.response?.data,
      }),
    };
  }
};
