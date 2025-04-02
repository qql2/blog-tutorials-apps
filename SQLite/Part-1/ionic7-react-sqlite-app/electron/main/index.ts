import { BrowserWindow, app, ipcMain, shell } from 'electron'

import { join } from 'node:path'
import { release } from 'node:os'

// 禁用 Windows 7 的 GPU 加速
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// 为 Windows 10+ 通知设置应用程序名称
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// 确保应用程序是单实例的
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')

// 判断是开发环境还是生产环境

if(process.env.NODE_ENV === 'production') {
  console.log("production")
  process.env.VITE_DEV_SERVER_URL = ''
}

const indexHtml = join(__dirname, '../../dist/index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Ionic React SQLite App',
    width: 1200,
    height: 800,
    webPreferences: {
      preload,
      // 启用 contextIsolation 以支持 contextBridge API
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // 测试向 Electron-Renderer 主动推送消息
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // 使所有链接在浏览器中打开，而不是在应用程序中
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // 加载开发服务器 URL 或本地 HTML 文件
  if (process.env.VITE_DEV_SERVER_URL) {
    console.log("dev")
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    console.log("production")
    win.loadFile(indexHtml)
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // 如果用户尝试打开另一个窗口，则聚焦到主窗口
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// 新窗口示例 arg: 新窗口 url
ipcMain.handle('open-win', (_, arg) => {
  console.log("open-win", arg)
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      // 为子窗口也启用 contextIsolation
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
