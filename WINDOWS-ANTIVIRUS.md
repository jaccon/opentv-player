# 🛡️ Aviso Importante para Usuários Windows

## Falso Positivo de Antivírus

O OpenTV Player pode ser detectado como "ameaça" por alguns antivírus no Windows. **Isso é um falso positivo comum em aplicações Electron não assinadas digitalmente.**

### Por que isso acontece?

1. **Falta de Assinatura Digital**: A aplicação não possui um certificado de código (Code Signing Certificate) que custa centenas de dólares por ano
2. **Baixa Reputação Inicial**: Novos executáveis precisam construir reputação ao longo do tempo
3. **Electron Framework**: Alguns antivírus são mais sensíveis a aplicações Electron

### ✅ Como usar com segurança

#### Opção 1: Windows Defender (Recomendado)
1. Quando o Windows Defender bloquear, clique em **"Mais informações"**
2. Clique em **"Executar assim mesmo"**

#### Opção 2: Adicionar Exceção
1. Abra **Windows Security** (Segurança do Windows)
2. Vá em **Proteção contra vírus e ameaças**
3. Em **Configurações de proteção contra vírus e ameaças**, clique em **Gerenciar configurações**
4. Role até **Exclusões** e clique em **Adicionar ou remover exclusões**
5. Clique em **Adicionar uma exclusão** > **Arquivo**
6. Selecione o executável do OpenTV Player

#### Opção 3: Use a Versão Portable
A versão Portable (`OpenTV Player-0.2.0-x64-Portable.exe`) pode ter menos problemas que o instalador.

### 🔍 Verificar Segurança

Você pode verificar a segurança do arquivo:

1. **VirusTotal**: Envie o arquivo para https://www.virustotal.com
2. **Código Fonte**: Todo o código está disponível em: https://github.com/jaccon/opentv-player
3. **Build Reproduzível**: Você mesmo pode compilar o código fonte

### 💡 Para Desenvolvedores

Para resolver definitivamente este problema, seria necessário:

1. **Adquirir Certificado de Code Signing** (~$200-500/ano)
   - Requer validação de identidade/empresa
   - Processo pode levar dias/semanas

2. **Configurar Assinatura no electron-builder**:
   ```json
   "win": {
     "certificateFile": "path/to/cert.pfx",
     "certificatePassword": "password"
   }
   ```

### 🆘 Ainda com problemas?

Se seu antivírus continuar bloqueando:
- Tente desabilitar temporariamente para instalação
- Use a versão portable ao invés do instalador
- Considere usar uma máquina virtual para teste
- Abra uma issue no GitHub reportando qual antivírus está bloqueando

---

**Nota**: Esta é uma aplicação open-source e segura. O bloqueio é apenas devido à falta de certificado digital, não indica malware real.
