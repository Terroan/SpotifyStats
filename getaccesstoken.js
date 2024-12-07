const axios = require('axios');
const querystring = require('querystring');

// Spotify Token URL
const tokenUrl = 'https://accounts.spotify.com/api/token';

// Deine Client ID und Client Secret
const clientId = '93b7870373b8438f8f0b68863e04a26a';
const clientSecret = 'f376a87ae20940b8b463f5d18524eaa4';

// Der Authorization Code, den du aus der Redirect-URL erhalten hast
const authorizationCode = 'AQCW1H72wbzo37AzZe_HVdQcnnBSWL1J5kmujSIZVHQolhohk4Jx3gMwQxVosRpUmqqQdWidim_hc_PCo9y8uebxq-iu4RfMQOXN4ZgWWSf8-HmA-dI1ZuJoYPURnaEN4vxIJn-xY8f_2YQ3ZfrbPs3JJU7WkJryyKsjuR2ucwhO0d9dwmyChpjS8eB6y_XYj1Tv5tbtGF-SQiKC2fIBKqQpo6kwpHhyxwl7U7bKrnrT5jsXOHZiZvGtRRelnnwwflgJl1SOCSeFkU_9C5olfg'; // Hier ersetzt du 'AQD-XYZ-ExampleCode' mit deinem tatsächlichen Authorization Code

// Deine Redirect URI
const redirectUri = 'http://localhost:3001/callback'; // Muss mit der Redirect URI übereinstimmen, die du bei der App-Erstellung definiert hast

// Erstelle die Anfrage-Daten
const data = querystring.stringify({
  grant_type: 'authorization_code',
  code: authorizationCode,
  redirect_uri: redirectUri,
});

// Spotify Basic Authentication Header (Base64 codierte Client ID und Client Secret)
const authHeader = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');

// Sende die Anfrage, um das Access Token und Refresh Token zu erhalten
async function getTokens() {
  try {
    const response = await axios.post(tokenUrl, data, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Das Access Token und Refresh Token
    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    // Return access and refresh token
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error getting access and refresh tokens:', error);
  }
}

getTokens();
