import express from 'express';
import dotenv from 'dotenv';
import {
  playNextTrack,
  playPreviousTrack,
  togglePlayPause,
  getCurrentlyPlayingTrack,
} from './script.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.get('/playPauseTrack', async (req, res) => {
  await togglePlayPause();
});

app.get('/playNextTrack', async (req, res) => {
  await playNextTrack();
});

app.get('/playPreviousTrack', async (req, res) => {
  await playPreviousTrack();
});

app.get('/getCurrentlyPlayingTrack', async (req, res) => {
  await getCurrentlyPlayingTrack().then((track) => {
    if (track) {
      res.send({
        track: track.name,
        artist: track.artist,
      });
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port 3000`));
