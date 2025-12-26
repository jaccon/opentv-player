const { ipcRenderer } = require('electron');

// Estado da aplicação
let channels = [];
let favorites = [];
let currentChannel = null;
let currentTab = 'all';
let retryCount = 0;
const MAX_RETRIES = 3;
let hls = null; // Instância do HLS.js
let savedUrls = []; // URLs salvas
let lastLoadedUrl = ''; // Última URL carregada

// Elementos DOM
const elements = {
    loadUrlBtn: document.getElementById('loadUrlBtn'),
    savedUrlsBtn: document.getElementById('savedUrlsBtn'),
    serverToggleBtn: document.getElementById('serverToggleBtn'),
    urlInput: document.getElementById('urlInput'),
    savedUrlsModal: document.getElementById('savedUrlsModal'),
    savedUrlsList: document.getElementById('savedUrlsList'),
    closeModal: document.getElementById('closeModal'),
    serverModal: document.getElementById('serverModal'),
    closeServerModal: document.getElementById('closeServerModal'),
    toggleServerBtn: document.getElementById('toggleServerBtn'),
    serverStatusInfo: document.getElementById('serverStatusInfo'),
    serverInfo: document.getElementById('serverInfo'),
    serverBadge: document.getElementById('serverBadge'),
    statusText: document.getElementById('statusText'),
    serverUrl: document.getElementById('serverUrl'),
    serverIp: document.getElementById('serverIp'),
    serverPort: document.getElementById('serverPort'),
    serverStatus: document.getElementById('serverStatus'),
    searchInput: document.getElementById('searchInput'),
    channelsList: document.getElementById('channelsList'),
    videoPlayer: document.getElementById('videoPlayer'),
    playerOverlay: document.getElementById('playerOverlay'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    errorIndicator: document.getElementById('errorIndicator'),
    errorMessage: document.getElementById('errorMessage'),
    retryBtn: document.getElementById('retryBtn'),
    currentChannelInfo: document.getElementById('currentChannelInfo'),
    currentChannelName: document.getElementById('currentChannelName'),
    currentChannelGroup: document.getElementById('currentChannelGroup'),
    toggleFavoriteBtn: document.getElementById('toggleFavoriteBtn'),
    favoriteIcon: document.getElementById('favoriteIcon'),
    allCount: document.getElementById('allCount'),
    favCount: document.getElementById('favCount'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    exportFavoritesBtn: document.getElementById('exportFavoritesBtn'),
    importFavoritesBtn: document.getElementById('importFavoritesBtn'),
    favoritesActions: document.getElementById('favoritesActions')
};

// Estado do servidor
let serverRunning = false;

// Inicialização
async function init() {
    await loadFavorites();
    await loadSavedUrls();
    await loadServerStatus();
    setupEventListeners();
    updateCounts();
    
    // Listener para menu
    ipcRenderer.on('trigger-load-m3u', () => {
        loadM3uFile();
    });
    
    // Listener para toggle de servidor via menu
    ipcRenderer.on('toggle-server', () => {
        showServerModal();
    });
    
    // Listener para mudanças no status do servidor
    ipcRenderer.on('server-status-changed', (event, status) => {
        updateServerStatus(status);
    });
}

// Carregar favoritos
async function loadFavorites() {
    try {
        favorites = await ipcRenderer.invoke('load-favorites');
        console.log('Favoritos carregados:', favorites.length);
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        favorites = [];
    }
}

// Carregar URLs salvas
async function loadSavedUrls() {
    try {
        savedUrls = await ipcRenderer.invoke('load-saved-urls');
        console.log('URLs carregadas:', savedUrls.length);
    } catch (error) {
        console.error('Erro ao carregar URLs:', error);
        savedUrls = [];
    }
}

// Salvar URL automaticamente
async function autoSaveUrl(url) {
    if (!url) return;
    
    // Verificar se URL já existe
    const exists = savedUrls.some(u => u.url === url);
    if (exists) {
        console.log('URL já salva anteriormente');
        return;
    }
    
    // Gerar nome automático baseado na data/hora
    const now = new Date();
    const name = `Lista IPTV ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    
    const urlData = {
        url: url,
        name: name,
        date: now.toISOString()
    };
    
    try {
        const result = await ipcRenderer.invoke('save-url', urlData);
        if (result.success) {
            savedUrls = result.urls;
            console.log('URL salva automaticamente:', name);
        }
    } catch (error) {
        console.error('Erro ao salvar URL automaticamente:', error);
    }
}

// Mostrar modal de URLs salvas
function showSavedUrlsModal() {
    renderSavedUrls();
    elements.savedUrlsModal.style.display = 'flex';
}

// Fechar modal
function closeSavedUrlsModal() {
    elements.savedUrlsModal.style.display = 'none';
}

// Renderizar URLs salvas
function renderSavedUrls() {
    if (savedUrls.length === 0) {
        elements.savedUrlsList.innerHTML = `
            <div class="empty-state">
                <p>😕 Nenhuma URL salva ainda</p>
                <p class="empty-hint">Carregue uma URL e ela será salva automaticamente</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    savedUrls.forEach((urlData, index) => {
        const date = new Date(urlData.date).toLocaleDateString('pt-BR');
        html += `
            <div class="saved-url-item">
                <div class="saved-url-info">
                    <div class="saved-url-name">${escapeHtml(urlData.name)}</div>
                    <div class="saved-url-url">${escapeHtml(urlData.url.substring(0, 60))}${urlData.url.length > 60 ? '...' : ''}</div>
                    <div class="saved-url-date">Salva em: ${date}</div>
                </div>
                <div class="saved-url-actions">
                    <button class="btn-small btn-primary" onclick="loadSavedUrl(${index})" title="Carregar playlist">
                        <span>▶</span> Carregar
                    </button>
                    <button class="btn-small btn-secondary" onclick="renameSavedUrl(${index})" title="Renomear">
                        <span>✏️</span>
                    </button>
                    <button class="btn-small btn-danger" onclick="deleteSavedUrl('${escapeHtml(urlData.url)}')" title="Deletar">
                        <span>🗑️</span>
                    </button>
                </div>
            </div>
        `;
    });
    
    elements.savedUrlsList.innerHTML = html;
}

// Carregar URL salva
function loadSavedUrl(index) {
    const urlData = savedUrls[index];
    if (urlData) {
        elements.urlInput.value = urlData.url;
        closeSavedUrlsModal();
        loadM3uFromUrl();
    }
}

// Renomear URL salva
async function renameSavedUrl(index) {
    const urlData = savedUrls[index];
    if (!urlData) return;
    
    const newName = prompt('Digite o novo nome:', urlData.name);
    if (!newName || newName === urlData.name) return;
    
    try {
        // Deletar e recriar com novo nome
        await ipcRenderer.invoke('delete-saved-url', urlData.url);
        
        const updatedUrlData = {
            ...urlData,
            name: newName
        };
        
        const result = await ipcRenderer.invoke('save-url', updatedUrlData);
        if (result.success) {
            savedUrls = result.urls;
            renderSavedUrls();
            showNotification('URL renomeada com sucesso', 'success');
        }
    } catch (error) {
        showNotification('Erro ao renomear URL: ' + error.message, 'error');
    }
}

// Deletar URL salva
async function deleteSavedUrl(url) {
    if (!confirm('Deseja realmente deletar esta URL?')) return;
    
    try {
        const result = await ipcRenderer.invoke('delete-saved-url', url);
        if (result.success) {
            savedUrls = result.urls;
            renderSavedUrls();
            showNotification('URL deletada com sucesso', 'success');
        }
    } catch (error) {
        showNotification('Erro ao deletar URL: ' + error.message, 'error');
    }
}

// Salvar favoritos
async function saveFavorites() {
    try {
        await ipcRenderer.invoke('save-favorites', favorites);
    } catch (error) {
        console.error('Erro ao salvar favoritos:', error);
    }
}

// Exportar favoritos
async function exportFavorites() {
    if (favorites.length === 0) {
        showNotification('Nenhum favorito para exportar', 'warning');
        return;
    }

    try {
        const result = await ipcRenderer.invoke('export-favorites');
        
        if (result.success) {
            showNotification(`✅ ${result.count} favoritos exportados com sucesso!`, 'success');
        } else if (!result.canceled) {
            showNotification('Erro ao exportar favoritos: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Erro ao exportar favoritos:', error);
        showNotification('Erro ao exportar favoritos: ' + error.message, 'error');
    }
}

// Importar favoritos
async function importFavorites() {
    try {
        const result = await ipcRenderer.invoke('import-favorites');
        
        if (result.success) {
            favorites = result.favorites;
            updateCounts();
            
            if (currentTab === 'favorites') {
                renderChannels();
            }
            
            const message = result.added > 0 
                ? `✅ ${result.added} novos favoritos adicionados! Total: ${result.total}`
                : `ℹ️ ${result.imported} favoritos já existiam. Total: ${result.total}`;
            
            showNotification(message, 'success');
        } else if (!result.canceled) {
            showNotification('Erro ao importar favoritos: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Erro ao importar favoritos:', error);
        showNotification('Erro ao importar favoritos: ' + error.message, 'error');
    }
}

// Event Listeners
function setupEventListeners() {
    elements.loadUrlBtn.addEventListener('click', loadM3uFromUrl);
    elements.savedUrlsBtn.addEventListener('click', showSavedUrlsModal);
    elements.serverToggleBtn.addEventListener('click', showServerModal);
    elements.closeModal.addEventListener('click', closeSavedUrlsModal);
    elements.closeServerModal.addEventListener('click', closeServerModal);
    elements.toggleServerBtn.addEventListener('click', toggleServer);
    elements.exportFavoritesBtn.addEventListener('click', exportFavorites);
    elements.importFavoritesBtn.addEventListener('click', importFavorites);
    elements.urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadM3uFromUrl();
    });
    elements.searchInput.addEventListener('input', filterChannels);
    elements.retryBtn.addEventListener('click', retryCurrentChannel);
    elements.toggleFavoriteBtn.addEventListener('click', toggleFavorite);
    
    // Fechar modal ao clicar fora
    elements.savedUrlsModal.addEventListener('click', (e) => {
        if (e.target === elements.savedUrlsModal) {
            closeSavedUrlsModal();
        }
    });
    
    elements.serverModal.addEventListener('click', (e) => {
        if (e.target === elements.serverModal) {
            closeServerModal();
        }
    });
    
    // Tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Video player events
    elements.videoPlayer.addEventListener('loadstart', handleLoadStart);
    elements.videoPlayer.addEventListener('loadeddata', handleLoadSuccess);
    elements.videoPlayer.addEventListener('error', handleLoadError);
    elements.videoPlayer.addEventListener('stalled', handleStalled);
    elements.videoPlayer.addEventListener('waiting', handleWaiting);
    elements.videoPlayer.addEventListener('playing', handlePlaying);
}

// Carregar M3U do arquivo
async function loadM3uFile() {
    const result = await ipcRenderer.invoke('select-file');
    
    if (result.success) {
        parseM3u(result.content);
    } else if (!result.canceled) {
        showNotification('Erro ao carregar arquivo: ' + result.error, 'error');
    }
}

// Carregar M3U da URL
async function loadM3uFromUrl() {
    const url = elements.urlInput.value.trim();
    
    if (!url) {
        showNotification('Por favor, insira uma URL válida', 'warning');
        return;
    }

    try {
        showNotification('Carregando playlist...', 'info');
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const content = await response.text();
        lastLoadedUrl = url; // Salvar última URL carregada
        parseM3u(content);
        elements.urlInput.value = '';
    } catch (error) {
        showNotification('Erro ao carregar URL: ' + error.message, 'error');
    }
}

// Parser de arquivo M3U
function parseM3u(content) {
    const lines = content.split('\n');
    const parsedChannels = [];
    let currentChannel = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('#EXTINF:')) {
            // Parse channel info
            const match = line.match(/#EXTINF:-?\d+\s*(.*?),(.+)$/);
            if (match) {
                const attributes = match[1];
                const name = match[2].trim();
                
                // Extract group
                const groupMatch = attributes.match(/group-title="([^"]+)"/);
                const group = groupMatch ? groupMatch[1] : 'Sem Grupo';
                
                // Extract logo
                const logoMatch = attributes.match(/tvg-logo="([^"]+)"/);
                const logo = logoMatch ? logoMatch[1] : '';

                currentChannel = {
                    id: parsedChannels.length,
                    name,
                    group,
                    logo
                };
            }
        } else if (line && !line.startsWith('#') && currentChannel.name) {
            // URL do canal
            currentChannel.url = line;
            parsedChannels.push(currentChannel);
            currentChannel = {};
        }
    }

    if (parsedChannels.length > 0) {
        channels = parsedChannels;
        showNotification(`${channels.length} canais carregados com sucesso!`, 'success');
        
        // Salvar URL automaticamente se foi carregada via URL
        if (lastLoadedUrl) {
            autoSaveUrl(lastLoadedUrl);
        }
        
        // Compartilhar canais com servidor
        shareChannelsWithServer();
        
        renderChannels();
        updateCounts();
    } else {
        showNotification('Nenhum canal encontrado no arquivo', 'warning');
    }
}

// Renderizar lista de canais
function renderChannels() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    let filteredChannels = channels;

    // Filtrar por busca
    if (searchTerm) {
        filteredChannels = channels.filter(ch => 
            ch.name.toLowerCase().includes(searchTerm) ||
            ch.group.toLowerCase().includes(searchTerm)
        );
    }

    // Filtrar por favoritos
    if (currentTab === 'favorites') {
        filteredChannels = filteredChannels.filter(ch => 
            favorites.some(fav => fav.url === ch.url)
        );
    }

    if (filteredChannels.length === 0) {
        elements.channelsList.innerHTML = `
            <div class="empty-state">
                <p>😕 Nenhum canal encontrado</p>
                ${searchTerm ? '<p class="empty-hint">Tente outro termo de busca</p>' : ''}
            </div>
        `;
        return;
    }

    // Agrupar por categoria
    const grouped = filteredChannels.reduce((acc, channel) => {
        if (!acc[channel.group]) {
            acc[channel.group] = [];
        }
        acc[channel.group].push(channel);
        return acc;
    }, {});

    let html = '';
    Object.keys(grouped).sort().forEach(group => {
        html += `<div class="channel-group">
            <div class="group-header">${group} (${grouped[group].length})</div>`;
        
        grouped[group].forEach(channel => {
            const isFavorite = favorites.some(fav => fav.url === channel.url);
            const isActive = currentChannel && currentChannel.url === channel.url;
            
            html += `
                <div class="channel-item ${isActive ? 'active' : ''}" data-id="${channel.id}">
                    ${channel.logo ? `<img src="${channel.logo}" alt="" class="channel-logo" onerror="this.style.display='none'">` : '<div class="channel-logo-placeholder">📺</div>'}
                    <div class="channel-info">
                        <div class="channel-name">${escapeHtml(channel.name)}</div>
                    </div>
                    <button class="btn-fav-mini ${isFavorite ? 'active' : ''}" data-id="${channel.id}" onclick="toggleChannelFavorite(${channel.id}, event)">
                        ${isFavorite ? '⭐' : '☆'}
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
    });

    elements.channelsList.innerHTML = html;

    // Adicionar event listeners aos canais
    document.querySelectorAll('.channel-item').forEach(item => {
        item.addEventListener('click', () => {
            const channelId = parseInt(item.dataset.id);
            playChannel(channels[channelId]);
        });
    });
}

// Reproduzir canal
function playChannel(channel) {
    console.log('Playing channel:', channel.name, channel.url);
    currentChannel = channel;
    retryCount = 0;
    
    showLoadingState();
    
    // Limpar player anterior
    if (hls) {
        hls.destroy();
        hls = null;
    }
    elements.videoPlayer.pause();
    elements.videoPlayer.removeAttribute('src');
    elements.videoPlayer.load();
    
    // Usar HLS.js para streams M3U8 se suportado
    if (typeof Hls !== 'undefined' && (channel.url.includes('.m3u8') || channel.url.includes('m3u8'))) {
        if (Hls.isSupported()) {
            console.log('Using HLS.js for playback');
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                maxBufferLength: 30,
                maxMaxBufferLength: 60,
                manifestLoadingTimeOut: 20000,
                manifestLoadingMaxRetry: 4,
                manifestLoadingRetryDelay: 1000,
                levelLoadingTimeOut: 20000,
                levelLoadingMaxRetry: 4,
                fragLoadingTimeOut: 20000,
                fragLoadingMaxRetry: 6
            });
            
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                console.log('HLS: Media attached');
            });
            
            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                console.log('HLS: Manifest parsed, levels:', data.levels.length);
                elements.videoPlayer.play().catch(err => {
                    console.error('Play error:', err);
                });
            });
            
            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS Error:', data);
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log('HLS: Network error, attempting recovery...');
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('HLS: Media error, attempting recovery...');
                            hls.recoverMediaError();
                            break;
                        default:
                            console.log('HLS: Fatal error, destroying instance');
                            handleLoadError(new Event('error'));
                            break;
                    }
                }
            });
            
            hls.loadSource(channel.url);
            hls.attachMedia(elements.videoPlayer);
        } else if (elements.videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            // Fallback para Safari ou navegadores com suporte nativo
            console.log('Using native HLS support');
            elements.videoPlayer.src = channel.url;
            elements.videoPlayer.addEventListener('loadedmetadata', () => {
                elements.videoPlayer.play().catch(err => {
                    console.error('Play error:', err);
                });
            });
        }
    } else {
        // Para streams não-HLS
        console.log('Using native video player');
        setTimeout(() => {
            elements.videoPlayer.src = channel.url;
            elements.videoPlayer.load();
            elements.videoPlayer.play().catch(err => {
                console.error('Play error:', err);
            });
        }, 100);
    }
    
    updateChannelInfo();
    updateActiveChannel();
}

// Retry do canal atual
function retryCurrentChannel() {
    if (currentChannel && retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`Tentativa ${retryCount} de ${MAX_RETRIES}`);
        playChannel(currentChannel);
    } else if (retryCount >= MAX_RETRIES) {
        showNotification('Número máximo de tentativas atingido', 'error');
    }
}

// Estados do player
function showLoadingState() {
    elements.playerOverlay.style.display = 'none';
    elements.loadingIndicator.style.display = 'flex';
    elements.errorIndicator.style.display = 'none';
}

function showPlayingState() {
    elements.playerOverlay.style.display = 'none';
    elements.loadingIndicator.style.display = 'none';
    elements.errorIndicator.style.display = 'none';
    elements.currentChannelInfo.style.display = 'flex';
}

function showErrorState(message) {
    elements.playerOverlay.style.display = 'none';
    elements.loadingIndicator.style.display = 'none';
    elements.errorIndicator.style.display = 'flex';
    elements.errorMessage.textContent = message;
}

// Video event handlers
function handleLoadStart() {
    console.log('Load start:', currentChannel ? currentChannel.name : 'unknown');
}

function handleLoadSuccess() {
    console.log('Load success:', currentChannel ? currentChannel.name : 'unknown');
    showPlayingState();
    retryCount = 0;
}

function handleLoadError(e) {
    console.error('Load error:', e, currentChannel);
    const error = elements.videoPlayer.error;
    let message = 'Erro ao carregar o stream.';
    let shouldRetry = true;
    
    if (error) {
        switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
                message = 'Carregamento abortado pelo usuário.';
                shouldRetry = false;
                break;
            case error.MEDIA_ERR_NETWORK:
                message = 'Erro de rede. Verifique sua conexão ou tente outro canal.';
                break;
            case error.MEDIA_ERR_DECODE:
                message = 'Erro ao decodificar o stream. Codec não suportado.';
                shouldRetry = false;
                break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                message = 'Formato de stream não suportado ou URL inválida.';
                break;
        }
    }
    
    showErrorState(message);
    
    // Auto-retry apenas para erros de rede
    if (shouldRetry && retryCount < MAX_RETRIES) {
        setTimeout(() => {
            console.log(`Auto-retry ${retryCount + 1}/${MAX_RETRIES}...`);
            retryCurrentChannel();
        }, 2000);
    }
}

function handleStalled() {
    console.log('Stream stalled');
}

function handleWaiting() {
    console.log('Waiting for data');
}

function handlePlaying() {
    console.log('Playing');
    showPlayingState();
}

// Atualizar info do canal
function updateChannelInfo() {
    if (currentChannel) {
        elements.currentChannelName.textContent = currentChannel.name;
        elements.currentChannelGroup.textContent = currentChannel.group;
        
        const isFavorite = favorites.some(fav => fav.url === currentChannel.url);
        elements.favoriteIcon.textContent = isFavorite ? '⭐' : '☆';
        elements.toggleFavoriteBtn.classList.toggle('active', isFavorite);
    }
}

// Toggle favorito do canal atual
function toggleFavorite() {
    if (!currentChannel) return;
    
    const index = favorites.findIndex(fav => fav.url === currentChannel.url);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('Removido dos favoritos', 'info');
    } else {
        favorites.push({
            url: currentChannel.url,
            name: currentChannel.name,
            group: currentChannel.group,
            logo: currentChannel.logo
        });
        showNotification('Adicionado aos favoritos', 'success');
    }
    
    saveFavorites();
    updateChannelInfo();
    renderChannels();
    updateCounts();
}

// Toggle favorito de qualquer canal
function toggleChannelFavorite(channelId, event) {
    event.stopPropagation();
    
    const channel = channels[channelId];
    const index = favorites.findIndex(fav => fav.url === channel.url);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({
            url: channel.url,
            name: channel.name,
            group: channel.group,
            logo: channel.logo
        });
    }
    
    saveFavorites();
    if (currentChannel && currentChannel.url === channel.url) {
        updateChannelInfo();
    }
    renderChannels();
    updateCounts();
}

// Atualizar canal ativo
function updateActiveChannel() {
    document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (currentChannel) {
        const activeItem = document.querySelector(`.channel-item[data-id="${currentChannel.id}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// Filtrar canais
function filterChannels() {
    renderChannels();
}

// Trocar tab
function switchTab(tab) {
    currentTab = tab;
    
    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // Mostrar/ocultar botões de exportar/importar
    if (elements.favoritesActions) {
        elements.favoritesActions.style.display = tab === 'favorites' ? 'flex' : 'none';
    }
    
    renderChannels();
}

// Atualizar contadores
function updateCounts() {
    elements.allCount.textContent = channels.length;
    elements.favCount.textContent = favorites.length;
}

// Notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Utility: Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ========== SERVIDOR WEB ==========

// Compartilhar canais com servidor
async function shareChannelsWithServer() {
    try {
        await ipcRenderer.invoke('share-channels', channels);
    } catch (error) {
        console.error('Erro ao compartilhar canais com servidor:', error);
    }
}

// Carregar status do servidor
async function loadServerStatus() {
    try {
        const status = await ipcRenderer.invoke('get-server-status');
        updateServerStatus(status);
    } catch (error) {
        console.error('Erro ao carregar status do servidor:', error);
    }
}

// Mostrar modal do servidor
function showServerModal() {
    elements.serverModal.style.display = 'flex';
    loadServerStatus();
}

// Fechar modal do servidor
function closeServerModal() {
    elements.serverModal.style.display = 'none';
}

// Toggle servidor
async function toggleServer() {
    try {
        if (serverRunning) {
            // Parar servidor
            const result = await ipcRenderer.invoke('stop-server');
            if (result.success) {
                showNotification('Servidor parado com sucesso', 'success');
            } else {
                showNotification('Erro ao parar servidor: ' + (result.error || result.message), 'error');
            }
        } else {
            // Iniciar servidor
            const result = await ipcRenderer.invoke('start-server');
            if (result.success) {
                showNotification(`Servidor iniciado em http://${result.ip}:${result.port}`, 'success');
            } else {
                showNotification('Erro ao iniciar servidor: ' + (result.error || result.message), 'error');
            }
        }
    } catch (error) {
        showNotification('Erro ao controlar servidor: ' + error.message, 'error');
    }
}

// Atualizar UI com status do servidor
function updateServerStatus(status) {
    serverRunning = status.running;
    
    // Atualizar badge do botão
    if (serverRunning) {
        elements.serverToggleBtn.classList.add('active');
        elements.serverStatus.textContent = 'Servidor Ativo';
        elements.serverBadge.classList.add('active');
        elements.statusText.textContent = 'Ativo';
        elements.toggleServerBtn.textContent = 'Desativar Servidor';
        elements.toggleServerBtn.classList.remove('btn-primary');
        elements.toggleServerBtn.classList.add('btn-large', 'btn-danger');
        
        // Mostrar informações do servidor
        const url = `http://${status.ip}:${status.port}`;
        elements.serverUrl.value = url;
        elements.serverIp.textContent = status.ip;
        elements.serverPort.textContent = status.port;
        elements.serverInfo.style.display = 'block';
    } else {
        elements.serverToggleBtn.classList.remove('active');
        elements.serverStatus.textContent = 'Servidor';
        elements.serverBadge.classList.remove('active');
        elements.statusText.textContent = 'Desativado';
        elements.toggleServerBtn.textContent = 'Ativar Servidor';
        elements.toggleServerBtn.classList.add('btn-primary');
        elements.toggleServerBtn.classList.remove('btn-danger');
        
        // Ocultar informações do servidor
        elements.serverInfo.style.display = 'none';
    }
}

// Copiar URL do servidor
function copyServerUrl() {
    const url = elements.serverUrl.value;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('URL copiada para a área de transferência', 'success');
    }).catch(err => {
        showNotification('Erro ao copiar URL', 'error');
    });
}

// Expor função para uso no HTML
window.copyServerUrl = copyServerUrl;

// Inicializar app
init();
