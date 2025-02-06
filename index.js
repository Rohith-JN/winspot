import express from 'express';
import dotenv from 'dotenv';
import {
  playNextTrack,
  playPreviousTrack,
  togglePlayPause,
  toggleShuffle,
  toggleRepeat,
  makeDeviceActive,
} from './script.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.get('/playPauseTrack', async (_, res) => {
  try {
    const result = await togglePlayPause();
    res.send({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.get('/playNextTrack', async (_, res) => {
  try {
    const result = await playNextTrack();
    res.send({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.get('/playPreviousTrack', async (_, res) => {
  try {
    const result = await playPreviousTrack();
    res.send({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.get('/repeat', async (req, res) => {
  const repeat = req.query.state;
  try {
    const result = await toggleRepeat(repeat);
    res.send({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.get('/shuffle', async (req, res) => {
  const shuffle = req.query.state;
  try {
    const result = await toggleShuffle(shuffle);
    res.send({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port 3000`);
  makeDeviceActive();
});
