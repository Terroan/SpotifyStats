import React from 'react';
import { FaSpotify } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

const PlaylistCreated = () => {
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get('playlistId');

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col justify-center items-center px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-green-400 mb-6 animate__animated animate__fadeIn animate__delay-1s">
          🎉 Playlist created successfully
        </h1>
        {playlistId && (
          <div className="animate__animated animate__fadeIn animate__delay-2s flex items-center justify-center">
            <a
              href={`https://open.spotify.com/playlist/${playlistId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform transform hover:scale-125"
            >
              <FaSpotify
                size={80} // Größe des Icons
                color="#1DB954" // Spotify Grün
                className="hover:scale-125"
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistCreated;
