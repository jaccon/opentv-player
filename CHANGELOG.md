# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.4.0] - 2025-12-26

### 🎉 Novas Funcionalidades

- **Exportar Favoritos**: Exporte sua lista de canais favoritos para um arquivo JSON
- **Importar Favoritos**: Importe listas de favoritos compartilhadas por outros usuários
- **Compartilhamento de Listas**: Compartilhe suas listas curadas com amigos e comunidade
- **Mesclagem Inteligente**: Sistema que evita duplicatas ao importar favoritos
- **Formato com Metadados**: Arquivos exportados incluem versão, data e informações do app

### 📄 Documentação

- Adicionado guia completo de exportação/importação (`EXPORTAR-FAVORITOS.md`)
- Arquivo de exemplo com favoritos de canais internacionais (`exemplo-favoritos.json`)
- README atualizado com informações sobre a nova funcionalidade

### 🎨 Interface

- Botões de Exportar/Importar aparecem na aba Favoritos
- Notificações informativas sobre o resultado das operações
- Design consistente com o resto da aplicação

### 🔧 Melhorias Técnicas

- Validação de formato de arquivo na importação
- Suporte para formato antigo e novo de favoritos
- Diálogos nativos do sistema para salvar/abrir arquivos
- Tratamento robusto de erros

---

## [0.3.0] - 2025-12-XX

### Funcionalidades Anteriores

- Sistema de favoritos com persistência local
- Modo servidor web para acesso remoto
- Reprodução de streams M3U/M3U8
- Interface moderna com tema escuro
- Busca e organização por grupos

---

## [0.2.0] - Modo Servidor

- Servidor HTTP integrado (porta 2323)
- Acesso via rede local
- Interface web responsiva
- Compartilhamento de canais

---

## [0.1.0] - Versão Inicial

- Reprodução básica de IPTV
- Carregamento de arquivos M3U
- Interface desktop com Electron
