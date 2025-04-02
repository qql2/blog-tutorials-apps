/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_DEV_SERVER_URL: string;
    DIST: string;
    DIST_ELECTRON: string;
    PUBLIC: string;
  }
}

interface Window {
  ipcRenderer: import('electron').IpcRenderer
}
