const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// Caminhos para armazenar dados
const favoritesPath = path.join(app.getPath('userData'), 'favorites.json');
const savedUrlsPath = path.join(app.getPath('userData'), 'saved-urls.json');

// Ignorar erros de certificado SSL (necessário para streams IPTV)
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('disable-web-security');

// Permitir protocolos inseguros
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Necessário para carregar streams externos
      allowRunningInsecureContent: true,
      experimentalFeatures: true
    },
    backgroundColor: '#1a1a1a',
    title: 'IPTV Player',
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  // Criar menu da aplicação
  const menuTemplate = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Carregar M3U...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('trigger-load-m3u');
          }
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Desfazer' },
        { role: 'redo', label: 'Refazer' },
        { type: 'separator' },
        { role: 'cut', label: 'Recortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Colar' },
        { role: 'selectAll', label: 'Selecionar Tudo' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload', label: 'Recarregar' },
        { role: 'toggleDevTools', label: 'Ferramentas do Desenvolvedor' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Padrão' },
        { role: 'zoomIn', label: 'Ampliar' },
        { role: 'zoomOut', label: 'Reduzir' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tela Cheia' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.loadFile('index.html');

  // Descomentar para debug
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers para gerenciar favoritos
ipcMain.handle('load-favorites', async () => {
  try {
    if (fs.existsSync(favoritesPath)) {
      const data = fs.readFileSync(favoritesPath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    return [];
  }
});

ipcMain.handle('save-favorites', async (event, favorites) => {
  try {
    fs.writeFileSync(favoritesPath, JSON.stringify(favorites, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar favoritos:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'M3U Playlist', extensions: ['m3u', 'm3u8'] },
      { name: 'Todos os arquivos', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    try {
      const content = fs.readFileSync(result.filePaths[0], 'utf-8');
      return { success: true, content, path: result.filePaths[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: false, canceled: true };
});

// IPC Handlers para gerenciar URLs salvas
ipcMain.handle('load-saved-urls', async () => {
  try {
    if (fs.existsSync(savedUrlsPath)) {
      const data = fs.readFileSync(savedUrlsPath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar URLs:', error);
    return [];
  }
});

ipcMain.handle('save-url', async (event, urlData) => {
  try {
    let urls = [];
    if (fs.existsSync(savedUrlsPath)) {
      const data = fs.readFileSync(savedUrlsPath, 'utf-8');
      urls = JSON.parse(data);
    }
    
    // Verificar se URL já existe
    const exists = urls.some(u => u.url === urlData.url);
    if (!exists) {
      urls.unshift(urlData);
      fs.writeFileSync(savedUrlsPath, JSON.stringify(urls, null, 2));
    }
    
    return { success: true, urls };
  } catch (error) {
    console.error('Erro ao salvar URL:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-saved-url', async (event, url) => {
  try {
    if (fs.existsSync(savedUrlsPath)) {
      const data = fs.readFileSync(savedUrlsPath, 'utf-8');
      let urls = JSON.parse(data);
      urls = urls.filter(u => u.url !== url);
      fs.writeFileSync(savedUrlsPath, JSON.stringify(urls, null, 2));
      return { success: true, urls };
    }
    return { success: true, urls: [] };
  } catch (error) {
    console.error('Erro ao deletar URL:', error);
    return { success: false, error: error.message };
  }
});
