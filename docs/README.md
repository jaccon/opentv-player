# 🌐 GitHub Pages - OpenTV Player

## 📁 Estrutura

A página web está em `/docs/index.html` para GitHub Pages.

## 🖼️ Screenshot

Para ter a página completa, você precisa adicionar um screenshot:

### Opção 1 - Tirar Screenshot da Aplicação
1. Abra o OpenTV Player
2. Carregue uma playlist com canais
3. Tire um screenshot (Cmd+Shift+4 no Mac)
4. Salve como `docs/screenshot.png`

### Opção 2 - Screenshot Automático
```bash
# Abra a aplicação e tire screenshot
npm start &
sleep 5
screencapture -x docs/screenshot.png
```

### Tamanho Recomendado
- **Largura:** 1200px - 1600px
- **Altura:** 800px - 1000px
- **Formato:** PNG ou JPG
- **Peso:** < 500KB (otimizado)

## 🚀 Ativar GitHub Pages

1. Vá em **Settings** do repositório
2. Clique em **Pages** no menu lateral
3. Em **Source**, selecione:
   - Branch: `main`
   - Folder: `/docs`
4. Clique em **Save**

Sua página estará em:
```
https://jaccon.github.io/opentv-player
```

## 🎨 Personalização

Edite `/docs/index.html` para customizar:

- **Cores**: Variáveis CSS em `:root`
- **Textos**: Seções HTML
- **Links**: URLs de download e GitHub

## ✅ Checklist

- [ ] Screenshot adicionado em `docs/screenshot.png`
- [ ] `icon.svg` copiado para `docs/` (já usa o da raiz)
- [ ] GitHub Pages ativado
- [ ] Testado localmente
- [ ] URL do repositório atualizada

## 🧪 Testar Localmente

```bash
# Opção 1 - Python
cd docs
python3 -m http.server 8000

# Opção 2 - Node.js (npx)
cd docs
npx http-server

# Abra: http://localhost:8000
```

## 🎯 Features da Página

✅ Design dark mode elegante
✅ Hero section com screenshot
✅ Seção de features com ícones
✅ Como funciona (3 passos)
✅ Botão de download para releases
✅ Responsivo (mobile-first)
✅ Animações suaves
✅ SEO otimizado

## 📝 Próximos Passos

1. Adicione o screenshot
2. Ative GitHub Pages
3. Compartilhe: https://jaccon.github.io/opentv-player
