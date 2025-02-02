import dotenv from 'dotenv';

dotenv.config();

import fetch from 'node-fetch';

async function getCurrentlyPlayingTrack(accessToken) {
  const url = 'https://api.spotify.com/v1/me/player/currently-playing';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 204 || response.status > 400) {
    console.log('No track is currently playing.');
    console.log(response.status);
    return null;
  }

  const data = await response.json();

  if (!data.item) {
    console.log('No track data found.');
    return null;
  }

  return {
    name: data.item.name,
    artist: data.item.artists.map((artist) => artist.name).join(', '),
    album: data.item.album.name,
    albumArt: data.item.album.images[0]?.url,
    progress: data.progress_ms,
    duration: data.item.duration_ms,
    isPlaying: data.is_playing,
  };
}

// Example usage
const accessToken = process.env.SPOTIFY_ACCESS_TOKEN; // Replace with your actual access token

getCurrentlyPlayingTrack(accessToken).then((track) => {
  if (track) {
    console.log(`🎵 Now Playing: ${track.name} by ${track.artist}`);
  }
});

async function playNextTrack(accessToken) {
  const url = 'https://api.spotify.com/v1/me/player/next';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    console.log('⏭️ Skipped to the next track!');
  } else {
    // Handle errors safely, only consuming the body once
    const bodyText = await response.text(); // Read the body as text
    try {
      const error = JSON.parse(bodyText); // Try parsing as JSON if possible
      console.error('⚠️ Error skipping track:', error);
    } catch (e) {
      console.error('⚠️ Unexpected response format:', bodyText);
    }
  }
}

async function playPreviousTrack(accessToken) {
  const url = 'https://api.spotify.com/v1/me/player/previous';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    console.log('⏭️ Skipped to the previous track!');
  } else {
    // Handle errors safely, only consuming the body once
    const bodyText = await response.text(); // Read the body as text
    try {
      const error = JSON.parse(bodyText); // Try parsing as JSON if possible
      console.error('⚠️ Error skipping track:', error);
    } catch (e) {
      console.error('⚠️ Unexpected response format:', bodyText);
    }
  }
}

async function togglePlayPause(accessToken) {
  const url = 'https://api.spotify.com/v1/me/player/play';
  const pauseUrl = 'https://api.spotify.com/v1/me/player/pause';

  // Fetch player status once
  const statusResponse = await fetch('https://api.spotify.com/v1/me/player', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (statusResponse.ok) {
    const statusData = await statusResponse.json(); // Parse once here

    // If music is playing, pause it
    if (statusData.is_playing) {
      const pauseResponse = await fetch(pauseUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (pauseResponse.status === 200) {
        console.log('⏸️ Music paused.');
      } else {
        console.error('⚠️ Error pausing music.');
      }
    } else {
      // If music is not playing, start playback
      const playResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (playResponse.status === 200) {
        console.log('▶️ Music playing.');
      } else {
        console.error('⚠️ Error starting music.');
      }
    }
  } else {
    console.error('⚠️ Unable to retrieve player status.');
  }
}
