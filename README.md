# 📺 IPTV Player

Aplicação Electron leve e moderna para visualizar canais IPTV com sistema de favoritos e modo servidor web.

## ⚠️ Aviso para Usuários Windows

**Antivírus podem bloquear o executável** - Isso é um falso positivo comum. A aplicação é segura e open-source.
📖 **[Leia aqui como resolver](WINDOWS-ANTIVIRUS.md)**

## ✨ Características

- 🎥 **Reprodução de IPTV** - Suporta streams M3U/M3U8 via URL ou arquivo local
- 🌐 **Modo Servidor Web** - Acesse seus canais de qualquer dispositivo na rede (porta 2323)
- ⭐ **Sistema de Favoritos** - Marque seus canais favoritos para acesso rápido
- � **Exportar/Importar Favoritos** - Compartilhe listas de favoritos com outros usuários
- �🔍 **Busca Inteligente** - Encontre canais por nome ou grupo
- 🎨 **Interface Moderna** - Design clean e responsivo com tema escuro
- 💪 **Tratamento de Erros** - Sistema de retry automático e mensagens claras
- 📊 **Organização por Grupos** - Canais organizados automaticamente por categoria
- 📱 **Acesso Remoto** - Interface web responsiva para mobile, tablet e desktop
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
- **Exportar Favoritos:** Na aba Favoritos, clique em "📤 Exportar" para salvar seus favoritos em um arquivo JSON
- **Importar Favoritos:** Na aba Favoritos, clique em "📥 Importar" para adicionar favoritos de um arquivo JSON
  - 📖 **[Saiba mais sobre Exportar/Importar Favoritos](EXPORTAR-FAVORITOS.md)**

### Modo Servidor (Novo! v0.2.0)

1. **Ativar Servidor:**
   - Clique no botão "🌐 Servidor" no cabeçalho, OU
   - Use o menu: Servidor > Ativar Modo Servidor
   - Clique em "Ativar Servidor"

2. **Acessar de Outros Dispositivos:**
   - Anote o endereço mostrado (ex: `http://192.168.1.100:2323`)
   - Abra este endereço no navegador de qualquer dispositivo na mesma rede
   - Funciona em smartphones, tablets, smart TVs, computadores, etc.

3. **Recursos do Modo Servidor:**
   - Interface web responsiva e moderna
   - Lista completa de canais sincronizada
   - Sistema de favoritos compartilhado
   - Reprodução com HLS.js
   - Acesso simultâneo de múltiplos dispositivos

## 🛠️ Tecnologias

- **Electron** - Framework para aplicações desktop
- **Express.js** - Servidor HTTP integrado
- **HLS.js** - Reprodução de streams HLS
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
