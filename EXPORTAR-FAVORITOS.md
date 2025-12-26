# 📤 Funcionalidade de Exportar e Importar Favoritos

## Descrição

Esta funcionalidade permite que você exporte seus canais favoritos para um arquivo JSON e compartilhe com outros usuários, ou importe favoritos de outras pessoas.

## Como Usar

### 🔹 Exportar Favoritos

1. Abra o OpenTV Player
2. Clique na aba **⭐ Favoritos**
3. Os botões **📤 Exportar** e **📥 Importar** aparecerão abaixo das abas
4. Clique em **📤 Exportar**
5. Escolha onde salvar o arquivo (será salvo com o nome `favoritos-opentv-YYYY-MM-DD.json`)
6. Compartilhe este arquivo com outros usuários!

### 🔹 Importar Favoritos

1. Abra o OpenTV Player
2. Clique na aba **⭐ Favoritos**
3. Clique em **📥 Importar**
4. Selecione o arquivo JSON de favoritos que você recebeu
5. Os novos favoritos serão adicionados à sua lista
   - Favoritos duplicados (com a mesma URL) não serão adicionados novamente
   - Você verá uma mensagem informando quantos favoritos foram importados

## Formato do Arquivo

O arquivo JSON exportado contém:

```json
{
  "version": "1.0",
  "app": "OpenTV Player",
  "exportDate": "2025-12-26T...",
  "totalChannels": 10,
  "favorites": [
    {
      "name": "Nome do Canal",
      "url": "https://...",
      "group": "Grupo do Canal",
      "logo": "URL do logo"
    }
  ]
}
```

## Características

- ✅ **Sem duplicatas**: Canais já existentes não são importados novamente
- ✅ **Mesclagem inteligente**: Novos favoritos são adicionados aos existentes
- ✅ **Compatibilidade**: Suporta tanto o formato novo (com metadados) quanto o formato antigo (apenas array)
- ✅ **Notificações**: Receba feedback em tempo real sobre o sucesso das operações
- ✅ **Segurança**: Validação de formato do arquivo antes da importação

## Compartilhamento

Você pode compartilhar o arquivo JSON exportado de várias formas:

- 📧 Email
- 💬 Mensageiros (WhatsApp, Telegram, etc.)
- ☁️ Serviços de nuvem (Google Drive, Dropbox, etc.)
- 🔗 GitHub Gists ou repositórios
- 💾 Pen drive ou outros meios físicos

## Exemplos de Uso

### Cenário 1: Família
Você configurou uma lista perfeita de canais favoritos e quer compartilhar com sua família.

### Cenário 2: Comunidade
Você faz parte de uma comunidade e quer compartilhar uma lista curada de canais.

### Cenário 3: Backup
Faça backup regular dos seus favoritos exportando-os periodicamente.

### Cenário 4: Múltiplos Dispositivos
Sincronize seus favoritos entre diferentes computadores exportando de um e importando em outro.

## Notas Técnicas

- Os favoritos são armazenados localmente em: `<userData>/favorites.json`
- A exportação adiciona metadados úteis como data de exportação e versão
- A importação é segura e não sobrescreve seus favoritos existentes
- O arquivo JSON é legível e pode ser editado manualmente se necessário

## Solução de Problemas

**Erro ao exportar:**
- Verifique se você tem permissões de escrita no diretório escolhido
- Certifique-se de que há espaço em disco disponível

**Erro ao importar:**
- Verifique se o arquivo é um JSON válido
- Certifique-se de que o arquivo contém o formato correto de favoritos

**Favoritos não aparecem após importar:**
- Verifique se você está na aba "Favoritos"
- Recarregue a aplicação se necessário

---

Desenvolvido para OpenTV Player v0.3.0+
