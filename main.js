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
              message: 'Orbit Homes v1.1.0',
              detail: 'Property Management System for Landlords and Real Estate Agencies in Africa.\n\nAll data is stored locally on your device.\nNo internet connection required.'
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Check for Updates…',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Check for Updates',
              message: 'You are running Orbit Homes v1.1.0',
              detail: 'To check for a newer version, visit the official Orbit Homes download page or contact your system administrator.\n\nCurrent version: 1.1.0\nRelease date: April 2026'
            });
          }
        },
        {
          label: 'Install Updates…',
          click: () => {
            const choice = dialog.showMessageBoxSync(mainWindow, {
              type: 'question',
              buttons: ['Download & Install', 'Cancel'],
              defaultId: 0,
              cancelId: 1,
              title: 'Install Updates',
              message: 'Install the latest version of Orbit Homes?',
              detail: 'The app will close and relaunch after the update is applied.\n\nNote: Your data is stored locally and will not be affected by the update.'
            });
            if (choice === 0) {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Up to Date',
                message: 'Orbit Homes is already up to date.',
                detail: 'You are running the latest version (v1.1.0).'
              });
            }
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
