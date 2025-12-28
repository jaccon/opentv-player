# 📺 IPTV Player

Aplicação Electron leve e moderna para visualizar canais IPTV com sistema de favoritos, modo servidor e suporte a Chromecast.

## ✨ Características

- 📡 **Suporte M3U/M3U8**: Carregue playlists locais ou via URL
- 🎬 **Reprodução de Vídeos Locais**: Abra arquivos MP4, OGV, WebM, MKV, AVI, MOV
- ⭐ **Sistema de Favoritos**: Marque seus canais preferidos para acesso rápido
- 🔍 **Busca Inteligente**: Encontre canais por nome ou grupo
- 📊 **Organização por Grupos**: Canais organizados automaticamente por categoria
- 🔄 **Recuperação Automática**: Retry automático em caso de falha (até 3 tentativas)
- ⚡ **Interface Leve**: Design moderno e responsivo com excelente performance
- 🛡️ **Tratamento de Erros**: Mensagens claras sobre problemas de carregamento
- 💾 **Persistência**: Favoritos salvos automaticamente
- 🌐 **Modo Servidor**: Compartilhe seus canais na rede local
- 📺 **Chromecast**: Transmita canais para dispositivos Chromecast (NOVO!)

## 🚀 Como Usar

### Instalação

```bash
npm install
```

### Executar

```bash
npm start
```

## 📖 Guia de Uso

### 1. Carregar Playlist

**Opção A - Arquivo Local:**
- Clique em "📁 Carregar M3U"
- Selecione um arquivo `.m3u` ou `.m3u8`

**Opção B - URL:**
- Cole a URL da playlist no campo de texto
- Clique em "🌐 Carregar URL" ou pressione Enter

**Opção C - Vídeo Local:**
- Menu: Arquivo > Abrir Vídeo... (ou Ctrl/Cmd+Shift+O)
- Selecione um arquivo de vídeo (MP4, OGV, WebM, MKV, AVI, MOV)
- O vídeo será reproduzido diretamente no player

### 2. Navegar pelos Canais

- Use a barra de busca para filtrar canais
- Alterne entre "Todos" e "⭐ Favoritos"
- Canais são agrupados por categoria automaticamente
- Clique em qualquer canal para começar a assistir

### 3. Gerenciar Favoritos

- Clique no ícone ⭐ ao lado do canal na lista
- Use o botão de favorito no player para o canal atual
- Acesse rapidamente na aba "Favoritos"

### 4. Transmitir para Chromecast 📺

- Reproduza um canal
- Clique no botão 📺 ao lado do botão de favoritos
- Selecione seu dispositivo Chromecast na lista
- O canal será transmitido automaticamente!
- [Veja o guia completo do Chromecast](CHROMECAST.md)

### 5. Tratamento de Erros

A aplicação possui retry automático:
- Até 3 tentativas automáticas em caso de falha
- Mensagens claras sobre o tipo de erro
- Botão "Tentar Novamente" para retry manual

## 🎯 Tipos de Erro Tratados

- **Erro de Rede**: Problemas de conexão
- **Stream não Suportado**: Formato incompatível
- **Erro de Decodificação**: Problema ao processar o vídeo
- **Carregamento Abortado**: Interrupção pelo usuário
- **Stream Travado**: Detecção de buffering excessivo

## 🔧 Estrutura do Projeto

```
iptv/
├── index.html       # Interface da aplicação
├── main.js          # Processo principal do Electron
├── renderer.js      # Lógica do renderer (UI)
├── styles.css       # Estilos da aplicação
└── package.json     # Dependências e configuração
```

## 📝 Formato M3U Suportado

A aplicação suporta playlists M3U/M3U8 com:
- `#EXTINF`: Informações do canal
- `tvg-logo`: Logo do canal
- `group-title`: Agrupamento de canais

Exemplo:
```m3u
#EXTM3U
#EXTINF:-1 tvg-logo="logo.png" group-title="Esportes",Canal Esportivo
http://exemplo.com/stream.m3u8
```

## 🎨 Atalhos e Dicas

- **Enter** no campo de URL: Carrega a playlist
- **Busca em Tempo Real**: Filtra enquanto você digita
- **Scroll Automático**: Canal ativo sempre visível
- **Notificações**: Feedback visual para todas as ações

## ⚙️ Tecnologias

- **Electron**: Framework desktop
- **HTML5 Video**: Player nativo
- **CSS3**: Interface moderna
- **JavaScript**: Lógica da aplicação

## 🐛 Solução de Problemas

### Canal não carrega
1. Verifique sua conexão com a internet
2. Confirme se a URL do stream está válida
3. Alguns streams podem ter restrições geográficas

### Playlist não carrega
1. Verifique o formato do arquivo (M3U/M3U8)
2. Para URLs, confirme que está acessível
3. Verifique se o arquivo tem o formato correto

### Performance
- Limite playlists muito grandes (>1000 canais)
- Feche outros aplicativos que usam vídeo
- Verifique a velocidade da sua conexão

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para a comunidade IPTV**
