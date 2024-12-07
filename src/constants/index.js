// Fetch data from spotify API and export 
const fetchAccessToken = async () => {
    try {
      const response = await fetch("/.netlify/functions/spotify-token");  
      if (response.ok) {
        const data = await response.json(); 
        return data.access_token;
      } else {
        console.error("Error fetching access token:", response.statusText);
        return null;
      }
    } catch(error) {
      if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
        console.error("Netlify Functions not running!");
      } else {
        console.error("Error fetching access token:", error.message);
      }
      return null;
    }
  };

  const fetchSpotifyData = async (accessToken) => {
    try {
      const response = await fetch(`/.netlify/functions/spotify-data?access_token=${accessToken}`);
      if(response.ok) {
        const song = await response.json();
        return song;
      } else {
        console.error("Error fetching data:", response.statusText);
        return null;
      }
    } catch(error) {
      if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
        console.error("Netlify Functions not running!");
      } else {
        console.error("Error fetching data:", error.message);
      }
      return null;
    }
  };
  
  const tmpToken = await fetchAccessToken();
  export const SpotifyData = await fetchSpotifyData(tmpToken); 

  