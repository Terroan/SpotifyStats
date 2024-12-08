const axios = require("axios");

//fetch new access token from spotify api
export const handler = async function (event, context) {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {
    const response = await axios.post("https://accounts.spotify.com/api/token", null, {
      params: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Überprüfe, ob die Antwort ein access_token enthält
    if (response.data.access_token) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          access_token: response.data.access_token,
        }),
      };
    } else {
      console.error("No access token received");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No access token received" }),
      };
    }
  } catch (error) {
    console.error("Error fetching access token:", error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching access token:" }),
    };
  }
};
