interface ElectronAPI {
  getFiles: () => Promise<string[]>;
  getAppPath: () => Promise<string>;
  // 可以根据需要添加更多API
}

declare interface Window {
  electronAPI: ElectronAPI;
} 