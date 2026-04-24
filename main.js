const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const APP_VERSION = '1.2.0';

let mainWindow;

function getHtmlTargetPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'app', 'orbit-homes.html');
  }
  return path.join(__dirname, 'orbit-homes.html');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    show: false,
    backgroundColor: '#0f0f1a',
    icon: path.join(__dirname, 'icon.ico'),
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
          click: () => mainWindow.webContents.executeJavaScript('window.print()'),
        },
        { type: 'separator' },
        { role: 'quit', label: 'Exit' },
      ],
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
        { role: 'togglefullscreen' },
      ],
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
              message: `Orbit Homes v${APP_VERSION}`,
              detail:
                'Property Management System for Landlords and Real Estate Agencies in Africa.\n\nAll data is stored locally on your device.\nNo internet connection required.',
            });
          },
        },
        { type: 'separator' },
        {
          label: 'Install Update from File…',
          click: () => triggerInstallUpdate(),
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}

async function triggerInstallUpdate() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Orbit Homes Update File',
    filters: [{ name: 'Orbit Homes HTML', extensions: ['html'] }],
    properties: ['openFile'],
  });

  if (canceled || !filePaths.length) return;

  const selected = filePaths[0];

  const confirm = dialog.showMessageBoxSync(mainWindow, {
    type: 'question',
    buttons: ['Install & Reload', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
    title: 'Install Update',
    message: 'Install this update?',
    detail: `File: ${path.basename(selected)}\n\nThe app will reload after installing. All your data will be preserved.`,
  });

  if (confirm !== 0) return;

  try {
    const target = getHtmlTargetPath();
    fs.copyFileSync(selected, target);
    mainWindow.reload();
  } catch (err) {
    dialog.showErrorBox(
      'Update Failed',
      `Could not install the update:\n\n${err.message}\n\nTry running the app as administrator.`
    );
  }
}

ipcMain.handle('install-update', async () => {
  await triggerInstallUpdate();
  return { success: true };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
