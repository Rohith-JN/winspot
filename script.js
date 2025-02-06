import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

let accessToken = '';
let expiresAt = 0;

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
    console.log('Skipped to the next track!');
    return {
      message: 'Skipped to the next track!',
    };
  } else {
    const bodyText = await response.text();
    try {
      const error = JSON.parse(bodyText);
      console.error('Error skipping track:', error);
      return {
        message: `Error skipping track: ${error}`,
      };
    } catch (e) {
      console.error('Unexpected response format:', bodyText);
      return {
        message: `Unexpected response format: ${bodyText}`,
      };
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
    console.log('Skipped to the previous track!');
    return {
      message: 'Skipped to the previous track',
    };
  } else {
    const bodyText = await response.text();
    try {
      const error = JSON.parse(bodyText);
      console.error('Error skipping track:', error);
      return {
        message: `Error skipping track: ${error}`,
      };
    } catch (e) {
      console.error('Unexpected response format:', bodyText);
      return {
        message: `Unexpected response format: ${bodyText}`,
      };
    }
  }
}

export async function togglePlayPause() {
  const access_token = await getAccessToken();
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
        console.log('Music paused.');
        return {
          message: 'Music paused',
        };
      } else {
        console.error('Error pausing music.');
        return {
          message: 'Error pausing music',
        };
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
        console.log('Music playing.');
        return {
          message: 'Music playing',
        };
      } else {
        console.error('Error starting music.');
        return {
          message: 'Error starting music',
        };
      }
    }
  } else {
    console.error('Unable to retrieve player status.');
    return {
      message: 'Unable to retrieve player status',
    };
  }
}

async function getAccessToken() {
  const currentTime = Date.now();
  if (!accessToken || currentTime >= expiresAt) {
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

export async function toggleShuffle(shuffle) {
  const access_token = await getAccessToken();
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/shuffle?state=${shuffle}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return `HTTP error! Status: ${response.status}`;
    }
    console.log(`Set playback shuffle to ${shuffle}`);
    return `Set playback shuffle to ${shuffle}`;
  } catch (error) {
    console.error('Error setting playback shuffle:', error);
    return `Error setting playback shuffle:, ${error}`;
  }
}

export async function toggleRepeat(repeat) {
  const access_token = await getAccessToken();
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/repeat?state=${repeat}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return `HTTP error! Status: ${response.status}`;
    }
    console.log(`Set repeat to ${repeat}`);
    return `Set repeat to ${repeat}`;
  } catch (error) {
    console.error('Error setting repeat:', error);
    return `Error setting repeat:, ${error}`;
  }
}

export async function makeDeviceActive() {
  const access_token = await getAccessToken();

  const devicesResponse = await fetch(
    'https://api.spotify.com/v1/me/player/devices',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const devicesData = await devicesResponse.json();
  const deviceId = devicesData.devices[0].id;

  const response = await fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      device_ids: [deviceId],
      play: false,
    }),
  });

  console.log('Device activated!');
}
