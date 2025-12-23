# 🚀 Como Publicar no GitHub

## 📝 Passo a Passo Completo

### 1️⃣ Preparar Repositório Local

```bash
# Ir para a pasta do projeto
cd /Volumes/NVe480GB/Workspace/opensource/iptv

# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "feat: OpenTV Player - IPTV player moderno com favoritos e HLS.js"
```

### 2️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `opentv-player`
   - **Description:** "Aplicação leve e moderna para visualizar canais IPTV com sistema de favoritos"
   - **Public** (marcado)
   - **NÃO** marque "Add README" (já temos)
3. Clique em **Create repository**

### 3️⃣ Conectar e Fazer Push

```bash
# Adicionar remote (use sua URL do GitHub)
git remote add origin https://github.com/jaccon/opentv-player.git

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push
git push -u origin main
```

### 4️⃣ Ativar GitHub Pages

1. No repositório, vá em **Settings** (⚙️)
2. No menu lateral, clique em **Pages**
3. Em **Source**:
   - Branch: `main`
   - Folder: `/docs`
4. Clique em **Save**

✅ **Pronto!** Em alguns minutos estará em:
```
https://jaccon.github.io/opentv-player
```

---

## 🎯 Comandos Rápidos

### Já tem repositório? Apenas atualize:

```bash
cd /Volumes/NVe480GB/Workspace/opensource/iptv
git add .
git commit -m "Update: melhorias na página e aplicação"
git push
```

### Criar Release para Download

1. No GitHub, vá em **Releases** → **Create a new release**
2. Tag: `v1.0.0`
3. Title: `OpenTV Player v1.0.0`
4. Description:
```markdown
## 📺 OpenTV Player v1.0.0

Primeira versão do OpenTV Player - IPTV Player moderno e leve.

### ✨ Features
- 📡 Suporte M3U/M3U8 com HLS.js
- ⭐ Sistema de favoritos
- 🔍 Busca inteligente
- 📋 Histórico de URLs
- 🔄 Recuperação automática de erros

### 📦 Downloads
Escolha a versão para seu sistema operacional:
```
5. Anexe os arquivos de `dist/`:
   - `OpenTV Player-1.0.0-arm64.dmg` (Mac ARM)
   - `OpenTV Player-1.0.0-arm64-mac.zip` (Mac ZIP)

---

## 📋 Checklist Completo

- [ ] Git inicializado
- [ ] Arquivos commitados
- [ ] Repositório criado no GitHub
- [ ] Remote configurado
- [ ] Push realizado
- [ ] GitHub Pages ativado em Settings
- [ ] Release criada com builds
- [ ] Página testada (aguardar 2-5 min)

---

## 🔧 Solução de Problemas

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/jaccon/opentv-player.git
```

### Erro de permissão no push
```bash
# Usar token de acesso pessoal
# GitHub Settings → Developer settings → Personal access tokens
# Ao fazer push, use o token como senha
```

### Página não aparece
- Aguarde 2-5 minutos após ativar Pages
- Verifique se a pasta `/docs` está no branch main
- Confirme que `docs/index.html` existe

---

## 🎉 Próximos Passos

1. **Compartilhe:** Tweet, LinkedIn, Reddit
2. **Adicione README badges:**
   ```markdown
   ![GitHub release](https://img.shields.io/github/v/release/jaccon/opentv-player)
   ![GitHub stars](https://img.shields.io/github/stars/jaccon/opentv-player)
   ```
3. **Configure Actions** para build automático
4. **Adicione CONTRIBUTING.md** para colaboradores

---

## 🌐 URLs Finais

- **Repositório:** https://github.com/jaccon/opentv-player
- **Página Web:** https://jaccon.github.io/opentv-player
- **Releases:** https://github.com/jaccon/opentv-player/releases
