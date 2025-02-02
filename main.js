import { app, BrowserWindow, screen } from 'electron';

app.whenReady().then(() => {
  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;
  win = new BrowserWindow({
    width: 500,
    x: width - 500,
    y: 0,
    height: 360,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    webPreferences: { nodeIntegration: true },
  }).loadURL('D://Projects//TypeScript//spotify//index.html');
});
