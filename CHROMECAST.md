# 📺 Funcionalidade Chromecast

O OpenTV Player agora suporta transmissão de canais IPTV para dispositivos Chromecast na sua rede local!

## 🚀 Como Usar

### 1. Pré-requisitos
- Um dispositivo Chromecast conectado à mesma rede Wi-Fi que seu computador
- Canal IPTV carregado e reproduzindo no OpenTV Player

### 2. Iniciar Transmissão

1. **Carregue uma lista M3U** e selecione um canal para reproduzir
2. Quando o canal estiver reproduzindo, você verá um **botão com ícone 📺** ao lado do botão de favoritos
3. Clique no botão de Chromecast para abrir o **modal de dispositivos**
4. Aguarde alguns segundos enquanto o app busca dispositivos Chromecast na rede
5. Clique no dispositivo desejado para iniciar a transmissão

### 3. Durante a Transmissão

- O botão de Chromecast mudará para **📡** e ficará pulsando, indicando que está transmitindo
- Você verá informações sobre o dispositivo conectado e o canal sendo transmitido
- O vídeo continuará sendo reproduzido no seu computador (você pode pausar ou mudar de canal localmente)

### 4. Parar Transmissão

1. Clique novamente no botão de Chromecast
2. No modal, clique no botão **"🛑 Parar Transmissão"**
3. A transmissão será encerrada e o Chromecast ficará disponível novamente

## 🔧 Troubleshooting

### Nenhum dispositivo encontrado?

- **Verifique a rede**: Certifique-se de que seu computador e o Chromecast estão na mesma rede Wi-Fi
- **Reinicie o Chromecast**: Desconecte da energia e conecte novamente
- **Firewall**: Verifique se o firewall do seu sistema não está bloqueando a descoberta de dispositivos mDNS
- **Clique em "Buscar Novamente"**: Use o botão no modal para fazer uma nova busca

### Erro ao conectar?

- **URL do canal**: Alguns canais podem não ser compatíveis com Chromecast (streams protegidos ou formatos não suportados)
- **Teste outro canal**: Tente transmitir um canal diferente
- **Reinicie a aplicação**: Feche e abra o OpenTV Player novamente

### Transmissão com problemas?

- **Qualidade da rede**: Verifique se sua rede Wi-Fi está estável
- **Formato do stream**: O Chromecast funciona melhor com streams HLS (formato .m3u8)
- **Servidor sobrecarregado**: O servidor do canal pode estar com problemas

## 📋 Formatos Suportados

O Chromecast suporta transmissão de:
- ✅ Streams HLS (HTTP Live Streaming - .m3u8)
- ✅ Streams MP4 diretos
- ✅ Transmissões ao vivo (LIVE)

## ⚙️ Detalhes Técnicos

### Tecnologias Utilizadas
- **castv2**: Biblioteca Node.js para comunicação com dispositivos Chromecast
- **mdns**: Descoberta automática de dispositivos na rede usando mDNS/Bonjour
- **IPC (Inter-Process Communication)**: Comunicação entre o processo de renderização e o processo principal do Electron

### Arquitetura
1. O processo de renderização (interface) solicita descoberta de dispositivos via IPC
2. O processo principal usa mDNS para encontrar Chromecasts na rede
3. Quando conectado, o stream atual é enviado ao Chromecast usando a API Cast v2
4. O Chromecast carrega e reproduz o stream diretamente da fonte

## 🔒 Privacidade

- A descoberta de dispositivos acontece apenas na sua rede local
- Nenhuma informação é enviada para servidores externos
- A transmissão é ponto-a-ponto: do servidor IPTV diretamente para o Chromecast
- O OpenTV Player apenas inicia a conexão, o Chromecast carrega o stream independentemente

## 🆘 Suporte

Se encontrar problemas com a funcionalidade Chromecast:
1. Verifique os logs do aplicativo (Menu > Visualizar > Ferramentas do Desenvolvedor)
2. Abra uma issue no repositório do GitHub
3. Inclua informações sobre seu Chromecast (modelo, versão do firmware)

---

**Nota**: Esta funcionalidade requer que os dispositivos Chromecast estejam acessíveis via mDNS na rede local. Algumas configurações de rede corporativa podem bloquear essa funcionalidade.
