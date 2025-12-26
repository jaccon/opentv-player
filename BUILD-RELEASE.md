# 🏗️ Guia de Build e Release

## Pré-requisitos

- Node.js 14+
- npm instalado
- Git configurado

## Processo Completo de Release

### 1. Atualizar Versão

```bash
# Editar version no package.json
# Exemplo: "version": "0.4.0"
```

### 2. Atualizar Documentação

- Atualizar CHANGELOG.md com as mudanças
- Atualizar README.md se necessário
- Criar RELEASE-NOTES-vX.X.X.md

### 3. Commit e Tag

```bash
# Adicionar todas as alterações
git add .

# Fazer commit
git commit -m "feat: Descrição das mudanças vX.X.X"

# Criar tag
git tag -a vX.X.X -m "Release vX.X.X - Título

📝 Principais mudanças:
- Feature 1
- Feature 2
- Correção 3"

# Enviar para GitHub
git push origin main
git push origin vX.X.X
```

### 4. Gerar Builds

#### macOS (Apple Silicon)

```bash
npm run build:mac
```

Arquivos gerados em `dist/`:
- `OpenTV Player-X.X.X-arm64.dmg`
- `OpenTV Player-X.X.X-arm64-mac.zip`

⚠️ **Nota**: O aviso de code signing é normal para builds não assinados.

#### Windows (x64 e ARM64)

```bash
npm run build:win
```

Arquivos gerados em `dist/`:
- `OpenTV Player-X.X.X-x64.exe` (instalador)
- `OpenTV Player-X.X.X-arm64.exe` (instalador)
- `OpenTV Player-X.X.X-x64-Portable.exe`
- `OpenTV Player-X.X.X-arm64-Portable.exe`

⏱️ **Tempo estimado**: 2-5 minutos dependendo do hardware

#### Todos (Mac + Windows + Linux)

```bash
npm run build
```

### 5. Verificar Builds Gerados

```bash
# Listar arquivos da versão atual
ls -lh dist/*X.X.X*

# Ver tamanho dos arquivos
du -sh dist/*X.X.X*
```

### 6. Testar Localmente (Recomendado)

```bash
# Mac
open "dist/OpenTV Player-X.X.X-arm64.dmg"

# Windows (via Wine ou VM)
# Testar instalador e versão portátil
```

### 7. Criar Release no GitHub

1. Acesse: https://github.com/SEU-USER/opentv-player/releases/new
2. Selecione a tag criada: `vX.X.X`
3. Título: `vX.X.X - Título Descritivo`
4. Descrição: Copie de `RELEASE-NOTES-vX.X.X.md`
5. Upload dos arquivos:
   - ✅ Instaladores (.dmg, .exe)
   - ✅ Versões portáteis (.zip, -Portable.exe)
6. Marque "Set as the latest release"
7. Click "Publish release"

### 8. Pós-Release

- [ ] Testar download dos arquivos
- [ ] Verificar instalação em sistema limpo
- [ ] Anunciar em redes sociais/comunidade
- [ ] Responder issues relacionadas

## Troubleshooting

### Build falha no Mac

```bash
# Limpar cache
rm -rf dist/
rm -rf node_modules/
npm install
npm run build:mac
```

### Build falha no Windows

```bash
# Verificar se wine está instalado (para cross-compilation)
which wine

# Limpar e rebuildar
rm -rf dist/
npm run build:win
```

### Arquivos grandes demais

```bash
# Ver tamanho
du -sh dist/*

# Electron empacota chromium, é normal ter 100-200MB
# Para reduzir: considere usar electron-builder com compression
```

## Scripts Úteis

### Build rápido (sem código signing)

```bash
# Mac
npm run build:mac -- --config.mac.identity=null

# Builds paralelos
npm run build:mac & npm run build:win
```

### Limpar builds antigos

```bash
# Remover builds antigos mantendo os últimos
cd dist
rm -rf *0.1.* *0.2.*
```

## Checklist Final

Antes de publicar a release:

- [ ] Versão atualizada no package.json
- [ ] CHANGELOG.md atualizado
- [ ] Commit feito com mensagem clara
- [ ] Tag criada e enviada
- [ ] Builds gerados sem erros
- [ ] Builds testados localmente
- [ ] Release notes preparadas
- [ ] Arquivos prontos para upload

## Referências

- [electron-builder docs](https://www.electron.build/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
