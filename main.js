const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const os = require('os');
const Bonjour = require('bonjour-hap');
const Client = require('castv2').Client;
const DefaultMediaReceiver = require('castv2').DefaultMediaReceiver;

let mainWindow;
let httpServer = null;
let serverApp = null;
let serverRunning = false;
const SERVER_PORT = 2323;

// Estado do Chromecast
let chromecastClient = null;
let chromecastPlayer = null;
let bonjourBrowser = null;

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
        {
          label: 'Abrir Vídeo...',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: () => {
            mainWindow.webContents.send('trigger-open-video');
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
    },
    {
      label: 'Servidor',
      submenu: [
        {
          label: 'Ativar Modo Servidor',
          id: 'toggle-server',
          click: () => {
            mainWindow.webContents.send('toggle-server');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.loadFile('app.html');

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

// IPC Handler para abrir vídeos locais
ipcMain.handle('open-video-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Abrir Vídeo',
    filters: [
      { name: 'Vídeos', extensions: ['mp4', 'ogv', 'webm', 'mkv', 'avi', 'mov'] },
      { name: 'Todos os arquivos', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  const filePath = result.filePaths[0];
  const fileName = path.basename(filePath);
  
  return {
    success: true,
    filePath: filePath,
    fileName: fileName
  };
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

// IPC Handler para exportar favoritos
ipcMain.handle('export-favorites', async () => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Exportar Favoritos',
      defaultPath: `favoritos-opentv-${new Date().toISOString().split('T')[0]}.json`,
      filters: [
        { name: 'JSON', extensions: ['json'] },
        { name: 'Todos os arquivos', extensions: ['*'] }
      ]
    });

    if (!result.canceled && result.filePath) {
      // Ler favoritos atuais
      let favorites = [];
      if (fs.existsSync(favoritesPath)) {
        const data = fs.readFileSync(favoritesPath, 'utf-8');
        favorites = JSON.parse(data);
      }

      // Criar estrutura de exportação com metadados
      const exportData = {
        version: '1.0',
        app: 'OpenTV Player',
        exportDate: new Date().toISOString(),
        totalChannels: favorites.length,
        favorites: favorites
      };

      // Salvar no arquivo escolhido
      fs.writeFileSync(result.filePath, JSON.stringify(exportData, null, 2));
      return { success: true, path: result.filePath, count: favorites.length };
    }

    return { success: false, canceled: true };
  } catch (error) {
    console.error('Erro ao exportar favoritos:', error);
    return { success: false, error: error.message };
  }
});

// IPC Handler para importar favoritos
ipcMain.handle('import-favorites', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Importar Favoritos',
      properties: ['openFile'],
      filters: [
        { name: 'JSON', extensions: ['json'] },
        { name: 'Todos os arquivos', extensions: ['*'] }
      ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const content = fs.readFileSync(result.filePaths[0], 'utf-8');
      const importData = JSON.parse(content);

      // Verificar se é um arquivo válido de favoritos
      let importedFavorites = [];
      
      if (importData.favorites && Array.isArray(importData.favorites)) {
        // Formato novo com metadados
        importedFavorites = importData.favorites;
      } else if (Array.isArray(importData)) {
        // Formato antigo (apenas array de canais)
        importedFavorites = importData;
      } else {
        return { success: false, error: 'Formato de arquivo inválido' };
      }

      // Carregar favoritos existentes
      let currentFavorites = [];
      if (fs.existsSync(favoritesPath)) {
        const data = fs.readFileSync(favoritesPath, 'utf-8');
        currentFavorites = JSON.parse(data);
      }

      // Mesclar favoritos (evitar duplicatas por URL)
      const mergedFavorites = [...currentFavorites];
      let addedCount = 0;

      importedFavorites.forEach(importedFav => {
        const exists = mergedFavorites.some(fav => fav.url === importedFav.url);
        if (!exists) {
          mergedFavorites.push(importedFav);
          addedCount++;
        }
      });

      // Salvar favoritos mesclados
      fs.writeFileSync(favoritesPath, JSON.stringify(mergedFavorites, null, 2));

      return { 
        success: true, 
        favorites: mergedFavorites,
        imported: importedFavorites.length,
        added: addedCount,
        total: mergedFavorites.length
      };
    }

    return { success: false, canceled: true };
  } catch (error) {
    console.error('Erro ao importar favoritos:', error);
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
    let urls = [];
    if (fs.existsSync(savedUrlsPath)) {
      const data = fs.readFileSync(savedUrlsPath, 'utf-8');
      urls = JSON.parse(data);
    }
    
    // Adicionar URL padrão se não existir
    const defaultUrl = 'https://iptv-org.github.io/iptv/index.m3u';
    const defaultExists = urls.some(u => u.url === defaultUrl);
    
    if (!defaultExists) {
      const defaultUrlData = {
        url: defaultUrl,
        name: 'IPTV-ORG - Canais Globais',
        date: new Date().toISOString()
      };
      urls.push(defaultUrlData);
      fs.writeFileSync(savedUrlsPath, JSON.stringify(urls, null, 2));
    }
    
    return urls;
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

// Função para obter IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Pular endereços internos e não IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Função para criar servidor HTTP
function createHttpServer() {
  if (serverApp) return;

  serverApp = express();
  serverApp.use(cors());
  serverApp.use(express.json());

  // Servir página web pública
  serverApp.use(express.static(path.join(__dirname, 'public')));

  // API: Obter lista de canais
  serverApp.get('/api/channels', (req, res) => {
    try {
      const channelsData = global.sharedChannels || [];
      res.json({ success: true, channels: channelsData });
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });

  // API: Obter favoritos
  serverApp.get('/api/favorites', async (req, res) => {
    try {
      if (fs.existsSync(favoritesPath)) {
        const data = fs.readFileSync(favoritesPath, 'utf-8');
        res.json({ success: true, favorites: JSON.parse(data) });
      } else {
        res.json({ success: true, favorites: [] });
      }
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });

  // API: Adicionar/remover favorito
  serverApp.post('/api/favorites', async (req, res) => {
    try {
      const { channel, action } = req.body;
      let favorites = [];
      
      if (fs.existsSync(favoritesPath)) {
        const data = fs.readFileSync(favoritesPath, 'utf-8');
        favorites = JSON.parse(data);
      }

      if (action === 'add') {
        const exists = favorites.some(fav => fav.url === channel.url);
        if (!exists) {
          favorites.push(channel);
        }
      } else if (action === 'remove') {
        favorites = favorites.filter(fav => fav.url !== channel.url);
      }

      fs.writeFileSync(favoritesPath, JSON.stringify(favorites, null, 2));
      res.json({ success: true, favorites });
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });

  // API: Status do servidor
  serverApp.get('/api/status', (req, res) => {
    res.json({
      success: true,
      status: 'running',
      version: '1.0.1',
      ip: getLocalIP(),
      port: SERVER_PORT
    });
  });
}

// Iniciar servidor HTTP
function startHttpServer() {
  if (serverRunning) {
    return { success: false, message: 'Servidor já está rodando' };
  }

  try {
    createHttpServer();
    httpServer = serverApp.listen(SERVER_PORT, '0.0.0.0', () => {
      const ip = getLocalIP();
      serverRunning = true;
      console.log(`Servidor HTTP rodando em http://${ip}:${SERVER_PORT}`);
      
      // Notificar janela principal
      if (mainWindow) {
        mainWindow.webContents.send('server-status-changed', {
          running: true,
          ip,
          port: SERVER_PORT
        });
      }
    });

    return { success: true, ip: getLocalIP(), port: SERVER_PORT };
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    return { success: false, error: error.message };
  }
}

// Parar servidor HTTP
function stopHttpServer() {
  if (!serverRunning || !httpServer) {
    return { success: false, message: 'Servidor não está rodando' };
  }

  try {
    httpServer.close(() => {
      serverRunning = false;
      console.log('Servidor HTTP parado');
      
      // Notificar janela principal
      if (mainWindow) {
        mainWindow.webContents.send('server-status-changed', {
          running: false
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao parar servidor:', error);
    return { success: false, error: error.message };
  }
}

// IPC Handlers para controlar servidor
ipcMain.handle('start-server', async () => {
  return startHttpServer();
});

ipcMain.handle('stop-server', async () => {
  return stopHttpServer();
});

ipcMain.handle('get-server-status', async () => {
  return {
    running: serverRunning,
    ip: getLocalIP(),
    port: SERVER_PORT
  };
});

// Parar servidor ao fechar app
app.on('before-quit', () => {
  // Parar servidor HTTP
  if (httpServer) {
    httpServer.close();
  }
  
  // Limpar conexões do Chromecast
  if (chromecastClient) {
    chromecastClient.close();
  }
  if (bonjourBrowser) {
    bonjourBrowser.stop();
  }
});

// IPC Handler para compartilhar canais com servidor
ipcMain.handle('share-channels', async (event, channelsData) => {
  // Armazenar canais em memória global para o servidor
  global.sharedChannels = channelsData;
  return { success: true };
});

// ============ CHROMECAST FUNCTIONS ============

// Descobrir dispositivos Chromecast na rede
ipcMain.handle('discover-chromecast', async () => {
  return new Promise((resolve) => {
    const devices = [];
    const timeout = 5000; // 5 segundos para descoberta
    
    try {
      // Criar instância do Bonjour
      const bonjour = new Bonjour();
      
      // Buscar dispositivos Chromecast (_googlecast._tcp)
      bonjourBrowser = bonjour.find({ type: 'googlecast' }, (service) => {
        console.log('Chromecast encontrado:', service.name);
        
        // Adicionar dispositivo à lista
        if (service.addresses && service.addresses.length > 0) {
          devices.push({
            name: service.name || service.host,
            host: service.addresses[0],
            port: service.port || 8009
          });
        }
      });
      
      // Parar busca após timeout
      setTimeout(() => {
        if (bonjourBrowser) {
          bonjourBrowser.stop();
          bonjour.destroy();
        }
        console.log(`Descoberta finalizada. ${devices.length} dispositivo(s) encontrado(s)`);
        resolve(devices);
      }, timeout);
      
    } catch (error) {
      console.error('Erro ao descobrir Chromecast:', error);
      resolve([]);
    }
  });
});

// Conectar ao Chromecast e transmitir
ipcMain.handle('connect-chromecast', async (event, data) => {
  const { host, name, streamUrl, title, subtitle } = data;
  
  return new Promise((resolve) => {
    try {
      // Criar cliente Chromecast
      chromecastClient = new Client();
      
      chromecastClient.connect(host, () => {
        console.log('Conectado ao Chromecast:', name);
        
        // Lançar aplicação de mídia padrão
        chromecastClient.launch(DefaultMediaReceiver, (err, player) => {
          if (err) {
            console.error('Erro ao lançar player:', err);
            resolve({ success: false, error: err.message });
            return;
          }
          
          chromecastPlayer = player;
          
          // Configurar mídia para transmissão
          const media = {
            contentId: streamUrl,
            contentType: 'application/x-mpegURL', // HLS stream
            streamType: 'LIVE',
            metadata: {
              type: 0,
              metadataType: 0,
              title: title,
              subtitle: subtitle
            }
          };
          
          // Carregar e reproduzir mídia
          player.load(media, { autoplay: true }, (err, status) => {
            if (err) {
              console.error('Erro ao carregar mídia:', err);
              resolve({ success: false, error: err.message });
              return;
            }
            
            console.log('Mídia carregada com sucesso:', status);
            resolve({ success: true, status });
          });
        });
      });
      
      chromecastClient.on('error', (err) => {
        console.error('Erro no cliente Chromecast:', err);
        resolve({ success: false, error: err.message });
      });
      
    } catch (error) {
      console.error('Erro ao conectar ao Chromecast:', error);
      resolve({ success: false, error: error.message });
    }
  });
});

// Parar transmissão do Chromecast
ipcMain.handle('stop-chromecast', async () => {
  return new Promise((resolve) => {
    try {
      if (chromecastPlayer) {
        chromecastPlayer.stop(() => {
          console.log('Transmissão parada');
          
          if (chromecastClient) {
            chromecastClient.close();
            chromecastClient = null;
          }
          
          chromecastPlayer = null;
          resolve({ success: true });
        });
      } else if (chromecastClient) {
        chromecastClient.close();
        chromecastClient = null;
        resolve({ success: true });
      } else {
        resolve({ success: true, message: 'Nenhuma transmissão ativa' });
      }
    } catch (error) {
      console.error('Erro ao parar Chromecast:', error);
      resolve({ success: false, error: error.message });
    }
  });
});


