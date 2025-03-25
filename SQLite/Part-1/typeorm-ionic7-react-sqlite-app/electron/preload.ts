// 有关如何使用预加载脚本的详细信息，请参阅Electron文档：
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

// 安全地将Electron API暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件系统示例
  getFiles: () => ipcRenderer.invoke('get-files'),
  
  // 可以添加更多的API，以便与主进程通信
  // 例如对于SQLite操作
  getAppPath: () => ipcRenderer.invoke('get-app-path')
}); 