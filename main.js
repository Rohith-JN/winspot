import { app, BrowserWindow, screen } from 'electron';

app.whenReady().then(() => {
  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;

  let win = new BrowserWindow({
    width: 240,
    x: width - 240 - 10,
    y: 10,
    height: 220,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    webPreferences: { nodeIntegration: true },
  });

  win
    .loadURL('D://Projects//TypeScript//spotify//index.html')
    .catch((err) => console.error('Failed to load URL:', err));
});
