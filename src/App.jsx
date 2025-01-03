import React, { useState, useEffect } from "react";
import { FaSpotify } from "react-icons/fa";
import { SpotifyData } from "./constants";
import { Images } from "./assets";

const App = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("Long");
  const [spotifyAuthUrl, setAuthURL] = useState();
  const [profile, setProfile] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null); // Für die Vollbildansicht

  const fetchData = async (timeRange) => {
    setIsLoading(true);
    try {
      if (SpotifyData) {
        const tracks = SpotifyData[`topTracks${timeRange}`]?.items || [];
        const artists = SpotifyData[`topArtists${timeRange}`]?.items || [];
        const profileData = SpotifyData.profile || null;

        setTopTracks(tracks);
        setTopArtists(artists);
        setProfile(profileData);

        const trackUris = tracks.map((track) => track.uri);
        const encodedUris = JSON.stringify(trackUris);
        setAuthURL(`/.netlify/functions/spotify-OAuth?selectedTracks=${encodedUris}`);
      } else {
        console.error("Error fetching from spotify: SpotifyData is null or undefined.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedTimeRange);
  }, [selectedTimeRange]);

  const renderPlaceholder = (type) => (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-4 hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className="w-16 h-16 bg-gray-600 rounded-md animate-pulse"></div>
      <div>
        <h3 className="font-semibold text-gray-400">No {type} available</h3>
        <p className="text-sm text-gray-500">No {type} to show.</p>
      </div>
    </div>
  );

  const handleImageClick = (image) => {
    setFullScreenImage(image);
  };

  const handleCloseFullScreen = () => {
    setFullScreenImage(null);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white app-container">
      <header className="p-6 bg-green-500 flex items-center justify-center shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
          <FaSpotify className="text-white text-4xl" /> Spotify Stats
        </h1>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-4xl animate-spin">🎵</div>
        </div>
      ) : (
        <main className="p-6 max-w-4xl mx-auto">
          {/* Profilbereich */}
          {profile ? (
            <section className="mb-8 flex items-center gap-6">
              <a
                href={profile.external_urls?.spotify || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={profile.images?.[0]?.url || "default-profile-image.jpg"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full shadow-md hover:scale-110 transition-transform duration-300"
                />
              </a>
              <div>
                <h2 className="text-2xl font-semibold text-gray-300">{profile.display_name || "Unknown User"}</h2>
                <p className="text-gray-400">Music enjoyer with passion</p>
              </div>
            </section>
          ) : (
            <div>No profile data available</div>
          )}

          {/* Recently Played Songs */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">Recently played songs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SpotifyData?.tracksRecentlyPlayed?.items?.length > 0
                ? SpotifyData.tracksRecentlyPlayed.items.slice(0, 6).map((track) => (
                    <a
                      key={track.track.id}
                      href={track.track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-4 rounded-lg flex items-center gap-4 hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg"
                    >
                      <img
                        src={track.track.album.images?.[0]?.url || "default-image.jpg"}
                        alt={track.track.name}
                        className="w-16 h-16 rounded-md shadow-md"
                      />
                      <div>
                        <h3 className="font-semibold">{track.track.name || "Unknown Track"}</h3>
                        <p className="text-sm text-gray-400">
                          {track.track.artists?.map((artist) => artist.name).join(", ") || "Unknown Artist"}
                        </p>
                      </div>
                    </a>
                  ))
                : renderPlaceholder("Recently Played Songs")}
            </div>
          </section>

          {/* Auswahl des Zeitbereichs */}
          <section className="mb-8 flex justify-center gap-4">
            <button
              onClick={() => setSelectedTimeRange("Long")}
              className={`px-4 py-2 rounded-lg ${selectedTimeRange === "Long" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-400"} hover:bg-green-600 transition duration-300`}
            >
              Long Term
            </button>
            <button
              onClick={() => setSelectedTimeRange("Medium")}
              className={`px-4 py-2 rounded-lg ${selectedTimeRange === "Medium" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-400"} hover:bg-green-600 transition duration-300`}
            >
              Medium Term
            </button>
            <button
              onClick={() => setSelectedTimeRange("Short")}
              className={`px-4 py-2 rounded-lg ${selectedTimeRange === "Short" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-400"} hover:bg-green-600 transition duration-300`}
            >
              Short Term
            </button>
          </section>

          {/* Top Songs Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">My Top-Songs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topTracks?.length > 0
                ? topTracks.slice(0, 6).map((track) => (
                    <a
                      key={track.id}
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-4 rounded-lg flex items-center gap-4 hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg"
                    >
                      <img
                        src={track.album.images?.[0]?.url || "default-image.jpg"}
                        alt={track.name}
                        className="w-16 h-16 rounded-md shadow-md"
                      />
                      <div>
                        <h3 className="font-semibold">{track.name || "Unknown Track"}</h3>
                        <p className="text-sm text-gray-400">
                          {track.artists?.map((artist) => artist.name).join(", ") || "Unknown Artist"}
                        </p>
                      </div>
                    </a>
                  ))
                : renderPlaceholder("Songs")}
            </div>
          </section>

          {/* Spotify Login Button */}
          <section className="mb-8 flex justify-center">
            <a href={spotifyAuthUrl}>
              <button disabled className="px-6 py-3 bg-green-500 rounded-full text-white flex items-center gap-2 hover:bg-green-600 transition duration-300">
                <FaSpotify className="text-white text-2xl" />
                Create Playlist
              </button>
            </a>
          </section>

          {/* Top Artists Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">My Top-Artists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topArtists?.length > 0
                ? topArtists.slice(0, 10).map((artist) => (
                    <a
                      key={artist.id}
                      href={artist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-4 rounded-lg flex items-center gap-4 hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg"
                    >
                      <img
                        src={artist.images?.[0]?.url || "default-image.jpg"}
                        alt={artist.name}
                        className="w-16 h-16 rounded-full shadow-md"
                      />
                      <div>
                        <h3 className="font-semibold">{artist.name || "Unknown Artist"}</h3>
                        <p className="text-sm text-gray-400">
                          Genre: {artist.genres?.slice(0, 2).join(", ") || "Unknown Genre"}
                        </p>
                      </div>
                    </a>
                  ))
                : renderPlaceholder("Artists")}
            </div>
          </section>

          {/* Wrapped Section */}
          <section className="mt-16 mb-16">
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">Wrapped</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {Images.map((image) => (
                <div
                  key={image.src}
                  className="bg-gray-800 p-6 rounded-lg flex flex-col items-center gap-4 hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg"
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image.src}
                    alt={image.name}
                    className="w-56 h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-md shadow-md"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-300 text-lg">{image.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Vollbildansicht */}
          {fullScreenImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
              onClick={handleCloseFullScreen}
            >
              <img
                src={fullScreenImage.src}
                alt={fullScreenImage.name}
                className="max-w-full max-h-full rounded-lg shadow-lg"
              />
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default App;
