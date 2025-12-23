# 🚀 Guia de Build - OpenTV Player

## 📦 Preparação

### 1. Instalar dependências de build

```bash
npm install
```

### 2. Criar ícone para Mac (.icns)

Para Mac, você precisa de um arquivo `.icns`. Existem várias formas:

#### Opção A - Usando ferramentas online (mais fácil):
1. Exporte o `opentv-logo.svg` para PNG em alta resolução (1024x1024)
2. Use um conversor online: https://cloudconvert.com/png-to-icns
3. Salve o arquivo como `build/icon.icns`

#### Opção B - Usando ferramentas do Mac:
```bash
# 1. Converter SVG para PNG (precisa ter imagemagick ou inkscape)
# Com imagemagick:
convert -background none -resize 1024x1024 opentv-logo.svg build/icon.png

# Ou com sips (nativo do Mac) - primeiro exporte o SVG manualmente para PNG
# 2. Criar iconset
mkdir build/icon.iconset
sips -z 16 16     build/icon.png --out build/icon.iconset/icon_16x16.png
sips -z 32 32     build/icon.png --out build/icon.iconset/icon_16x16@2x.png
sips -z 32 32     build/icon.png --out build/icon.iconset/icon_32x32.png
sips -z 64 64     build/icon.png --out build/icon.iconset/icon_32x32@2x.png
sips -z 128 128   build/icon.png --out build/icon.iconset/icon_128x128.png
sips -z 256 256   build/icon.png --out build/icon.iconset/icon_128x128@2x.png
sips -z 256 256   build/icon.png --out build/icon.iconset/icon_256x256.png
sips -z 512 512   build/icon.png --out build/icon.iconset/icon_256x256@2x.png
sips -z 512 512   build/icon.png --out build/icon.iconset/icon_512x512.png
sips -z 1024 1024 build/icon.png --out build/icon.iconset/icon_512x512@2x.png

# 3. Converter para icns
iconutil -c icns build/icon.iconset -o build/icon.icns
```

#### Opção C - Instalar electron-icon-builder:
```bash
npm install --save-dev electron-icon-builder
```

Criar arquivo `build-icons.js`:
```javascript
const iconBuilder = require('electron-icon-builder');

iconBuilder({
  input: './build/icon.png',
  output: './build',
  flatten: true
}).then(() => console.log('Ícones criados!')).catch(console.error);
```

Execute: `node build-icons.js`

### 3. Estrutura de arquivos necessária

```
build/
  ├── icon.icns      # Para Mac
  ├── icon.ico       # Para Windows
  └── icon.png       # Para Linux (1024x1024)
```

## 🏗️ Criar Build

### Build para Mac (DMG + ZIP)
```bash
npm run build:mac
```

Isso irá criar:
- `dist/OpenTV Player-1.0.0.dmg` - Instalador Mac
- `dist/OpenTV Player-1.0.0-mac.zip` - Versão portátil

### Build para Windows
```bash
npm run build:win
```

### Build para Linux
```bash
npm run build:linux
```

### Build para todas as plataformas
```bash
npm run build
```

## 📱 Resultado

Após o build, você terá:

### Mac:
- **Nome da aplicação**: OpenTV Player
- **Ícone**: Logo do OpenTV vermelho
- **Menu**: OpenTV Player (com ícone)
- **Localização**: `dist/mac/OpenTV Player.app`

### Características do App Mac:
- ✅ Ícone personalizado no Dock
- ✅ Nome "OpenTV Player" no menu superior
- ✅ Instalador DMG profissional
- ✅ Versão assinada (se configurar certificado)

## 🔧 Configurações Avançadas

### Assinar aplicação Mac (para distribuição)

1. Obtenha um certificado Apple Developer
2. Adicione ao `package.json`:

```json
"build": {
  "mac": {
    "identity": "Seu Nome (TEAM_ID)",
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  }
}
```

### Notarização (App Store)

```json
"build": {
  "mac": {
    "notarize": {
      "teamId": "YOUR_TEAM_ID"
    }
  }
}
```

## 🐛 Problemas Comuns

### Erro: "Icon not found"
- Certifique-se que `build/icon.icns` existe
- Verifique o formato do arquivo

### Build muito grande
- Adicione arquivos desnecessários em `.build` exclusions
- Já configurado: `!**/*.md`, `!logotipo/**`

### Erro de permissões
```bash
chmod +x node_modules/.bin/electron-builder
```

## 📋 Checklist Final

- [ ] `build/icon.icns` criado (Mac)
- [ ] `build/icon.ico` criado (Windows)
- [ ] `build/icon.png` criado (Linux)
- [ ] `npm install` executado
- [ ] Versão atualizada no `package.json`
- [ ] Testado com `npm start`
- [ ] Build executado com `npm run build:mac`
- [ ] Aplicação testada em `dist/mac/`

## 🎉 Pronto!

Agora você tem uma aplicação profissional para distribuir!

**Arquivos finais:**
- `dist/OpenTV Player-1.0.0.dmg` - Para distribuição
- `dist/OpenTV Player-1.0.0-mac.zip` - Versão portátil
