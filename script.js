import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

let accessToken = '';
let expiresAt = 0;

export async function getCurrentlyPlayingTrack() {
  const access_token = await getAccessToken();
  const url = 'https://api.spotify.com/v1/me/player/currently-playing';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
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

export async function playNextTrack() {
  const access_token = await getAccessToken();

  const url = 'https://api.spotify.com/v1/me/player/next';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    console.log('⏭️ Skipped to the next track!');
  } else {
    const bodyText = await response.text();
    try {
      const error = JSON.parse(bodyText);
      console.error('⚠️ Error skipping track:', error);
    } catch (e) {
      console.error('⚠️ Unexpected response format:', bodyText);
    }
  }
}

export async function playPreviousTrack() {
  const access_token = await getAccessToken();

  const url = 'https://api.spotify.com/v1/me/player/previous';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    console.log('⏭️ Skipped to the previous track!');
  } else {
    const bodyText = await response.text();
    try {
      const error = JSON.parse(bodyText);
      console.error('⚠️ Error skipping track:', error);
    } catch (e) {
      console.error('⚠️ Unexpected response format:', bodyText);
    }
  }
}

export async function togglePlayPause() {
  const access_token = await getAccessToken();
  let isError = false;
  const url = 'https://api.spotify.com/v1/me/player/play';
  const pauseUrl = 'https://api.spotify.com/v1/me/player/pause';

  const statusResponse = await fetch('https://api.spotify.com/v1/me/player', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (statusResponse.ok) {
    const statusData = await statusResponse.json();

    if (statusData.is_playing) {
      const pauseResponse = await fetch(pauseUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (pauseResponse.status === 200) {
        console.log('⏸️ Music paused.');
        isError = false;
      } else {
        console.error('⚠️ Error pausing music.');
        isError = true;
      }
    } else {
      const playResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (playResponse.status === 200) {
        console.log('▶️ Music playing.');
        isError = false;
      } else {
        console.error('⚠️ Error starting music.');
        isError = true;
      }
    }
  } else {
    console.error('⚠️ Unable to retrieve player status.');
    isError = true;
  }
  return {
    message: isError ? 'Error' : 'No Error',
  };
}

async function getAccessToken() {
  const currentTime = Date.now();
  if (!accessToken || currentTime >= expiresAt) {
    console.log('Access token expired. Refreshing...');
    await getRefreshToken();
  }
  return accessToken;
}

async function getRefreshToken() {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    expiresAt = Date.now() + data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    console.error('Error fetching refresh token:', error);
    return null;
  }
}

// when initialising application run this initially
async function makeDeviceActive() {
  const access_token = getAccessToken();

  const devicesResponse = await fetch(
    'https://api.spotify.com/v1/me/player/devices',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const devicesData = await devicesResponse.json();
  if (!devicesData.devices.length) {
    console.log('No devices found. Open Spotify on any device.');
    return;
  }

  const deviceId = devicesData.devices[0].id;

  await fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      device_ids: [deviceId],
      play: true,
    }),
  });

  console.log('Device activated and playback started!');
}
