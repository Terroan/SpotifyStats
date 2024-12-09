const querystring = require('querystring');
const axios = require('axios');

export const handler = async function (event, context) {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
  const BASE_URI = process.env.BASE_URI;

  const { code, state } = event.queryStringParameters;

  const selectedTracks = JSON.parse(state).selectedTracks;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Kein Authentifizierungscode gefunden' }),
    };
  }

  if (!selectedTracks || selectedTracks.length < 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Keine Songs gefunden' }),
    };
  } else {
    console.log('----------', selectedTracks[0],'----------');
  }

  try {
    // Überprüfe die Base64-kodierte Autorisierung (client_id und client_secret zusammen)
    const authHeader = `Basic ${Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')}`;
    console.log('Authorization Header:', authHeader);  // Debugging der Auth-Header

    // 1. get access token
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        code: code, // Der von Spotify zurückgegebene Authentifizierungscode
        redirect_uri: SPOTIFY_REDIRECT_URI, // Die gleiche Redirect URI wie bei der Authentifizierung
        grant_type: 'authorization_code', // Der Grant-Typ für den Token-Austausch
      }),
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (tokenResponse.data && tokenResponse.data.access_token) {
      const accessToken = tokenResponse.data.access_token;
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };

      // 2. get user profile
      const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: headers,
      });
      const userID = profileResponse.data.id;

      // 3. create new playlist
      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          name: 'Danis tracks', // Playlist-Name
        },
        { headers: headers }
      );
      const playlistID = playlistResponse.data.id;

      // 4. add tracks to playlist
      const trackResponse = await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
        {
          uris: selectedTracks, // Die Track-URIs werden hier übergeben
        },
        { headers: headers }
      );

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
    console.error('Fehler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ein unerwarteter Fehler ist aufgetreten', error: error.message }),
    };
  }
};
