const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    showOption() {
      // ipcRenderer.send('option-window', 'show');
    },
    closeWindow() {
      ipcRenderer.send('window', 'close');
    },
    minimizeWindow() {
      ipcRenderer.send('window', 'minimize');
    },
    connectVpn(server) {
      ipcRenderer.send('vpnConnection', { action: 'connect', server });
    },
    disconnectVpn() {
      ipcRenderer.send('vpnConnection', { action: 'disconnect' });
    },
    on(channel, func) {
      const validChannels = ['option-window', 'vpnConnection', 'vpnUsage'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['option-window'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    removeListener(channel, listener) {
      ipcRenderer.removeListener(channel, listener);
    },
    removeAllListeners(channel) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
});
