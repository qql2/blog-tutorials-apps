import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import electronSquirrelStartup from 'electron-squirrel-startup';

// 检查Windows安装/卸载时是否需要处理快捷方式
if (electronSquirrelStartup) {
  app.quit();
}

const createWindow = () => {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // 加载应用的index.html
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // 打开开发工具（可在生产环境中移除）
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

// Electron完成初始化并准备创建浏览器窗口时将调用此方法
// 某些API只能在此事件发生后使用
app.whenReady().then(() => {
  // 初始化应用程序数据目录
  const userDataPath = app.getPath('userData');
  console.log('User Data Path:', userDataPath);
  
  // 创建窗口
  createWindow();
  
  app.on('activate', () => {
    // 在macOS上，当点击dock图标且没有其他窗口打开时，
    // 通常会在应用程序中重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 当所有窗口关闭时退出应用，除了在macOS上
// 在macOS上，应用程序及其菜单栏通常会保持活动状态，
// 直到用户使用Cmd + Q明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC通信示例 - 获取文件列表
ipcMain.handle('get-files', async () => {
  return fs.readdirSync(path.join(app.getAppPath(), 'resources'));
});

// 获取应用路径
ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
}); 