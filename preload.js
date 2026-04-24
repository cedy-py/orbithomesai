const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  version: '1.2.0',
  installUpdate: () => ipcRenderer.invoke('install-update'),
});
