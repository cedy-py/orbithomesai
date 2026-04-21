const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    titleBarStyle: 'default',
    icon: path.join(__dirname, 'icon.ico'),
    show: false,
    backgroundColor: '#0f0f1a'
  });

  mainWindow.loadFile('orbit-homes.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Print Report',
          accelerator: 'CmdOrCtrl+P',
          click: () => mainWindow.webContents.executeJavaScript('window.print()')
        },
        { type: 'separator' },
        { role: 'quit', label: 'Exit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn', accelerator: 'CmdOrCtrl+=' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Orbit Homes',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Orbit Homes',
              message: 'Orbit Homes v1.0.0',
              detail: 'Property Management System for Landlords and Real Estate Agencies in Africa.\n\nAll data is stored locally on your device.\nNo internet connection required.'
            });
          }
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
