# 📺 IPTV Player

Aplicação Electron leve e moderna para visualizar canais IPTV com sistema de favoritos e tratamento robusto de erros.

## ✨ Características

- 🎥 **Reprodução de IPTV** - Suporta streams M3U/M3U8 via URL ou arquivo local
- ⭐ **Sistema de Favoritos** - Marque seus canais favoritos para acesso rápido
- 🔍 **Busca Inteligente** - Encontre canais por nome ou grupo
- 🎨 **Interface Moderna** - Design clean e responsivo com tema escuro
- 💪 **Tratamento de Erros** - Sistema de retry automático e mensagens claras
- 📊 **Organização por Grupos** - Canais organizados automaticamente por categoria
- 🚀 **Performance** - Aplicação leve e otimizada

## 🚀 Como Usar

### Instalação

```bash
# Instalar dependências
npm install

# Executar aplicação
npm start
```

### Carregar Canais

1. **Via Arquivo Local:**
   - Clique em "📁 Carregar M3U"
   - Selecione seu arquivo .m3u ou .m3u8

2. **Via URL:**
   - Cole a URL do arquivo M3U no campo de texto
   - Clique em "🌐 Carregar URL" ou pressione Enter

### Usar a Aplicação

- **Assistir Canal:** Clique em qualquer canal na lista
- **Favoritar:** Clique na estrela (☆) ao lado do canal ou no botão grande durante a reprodução
- **Buscar:** Use o campo de busca para filtrar canais
- **Ver Favoritos:** Clique na aba "⭐ Favoritos"

## 🛠️ Tecnologias

- **Electron** - Framework para aplicações desktop
- **HTML5 Video** - Reprodução nativa de streams
- **JavaScript** - Lógica da aplicação
- **CSS3** - Interface moderna e responsiva

## 📋 Requisitos

- Node.js 14 ou superior
- Sistema operacional: Windows, macOS ou Linux

## 🔧 Funcionalidades Técnicas

### Tratamento de Erros
- Sistema de retry automático (até 3 tentativas)
- Detecção de diferentes tipos de erro (rede, codec, formato)
- Mensagens de erro descritivas para o usuário
- Indicadores visuais de loading e erro

### Sistema de Favoritos
- Persistência local (armazenado em favorites.json)
- Sincronização automática entre tabs
- Indicadores visuais em todos os lugares

### Performance
- Carregamento otimizado de listas grandes
- Scroll suave e responsivo
- Baixo uso de memória

## 📝 Formato M3U Suportado

```m3u
#EXTM3U
#EXTINF:-1 tvg-logo="http://example.com/logo.png" group-title="Notícias",Canal Exemplo
http://example.com/stream.m3u8
```

## 🐛 Solução de Problemas

**Canal não carrega:**
- Verifique sua conexão com a internet
- Confirme se a URL do stream está ativa
- Alguns streams podem ter restrições geográficas

**Playlist não carrega:**
- Verifique o formato do arquivo M3U
- Certifique-se de que a URL está acessível

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Desenvolvido com ❤️ usando Electron
