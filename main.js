import { app, BrowserWindow, screen } from 'electron';

app.whenReady().then(() => {
  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;
  win = new BrowserWindow({
    width: 280,
    x: width - 280 - 10,
    y: 10,
    height: 300,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    webPreferences: { nodeIntegration: true },
  }).loadURL('D://Projects//TypeScript//spotify//index.html');
});
