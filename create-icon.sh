#!/bin/bash

echo "🎨 Criando ícone para OpenTV Player..."

# Verificar se o arquivo SVG existe
if [ ! -f "icon.svg" ]; then
    echo "❌ Erro: icon.svg não encontrado!"
    exit 1
fi

# Criar diretório build se não existir
mkdir -p build

# Verificar se imagemagick está instalado
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick não está instalado."
    echo "📦 Instalando via Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew não está instalado. Instale em: https://brew.sh"
        exit 1
    fi
    brew install imagemagick
fi

# Converter SVG para PNG 1024x1024
echo "🔄 Convertendo SVG para PNG..."
convert -background none -resize 1024x1024 icon.svg build/icon.png

# Criar iconset para Mac
echo "🍎 Criando iconset para Mac..."
mkdir -p build/icon.iconset

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

# Converter para ICNS
echo "✨ Criando arquivo .icns..."
iconutil -c icns build/icon.iconset -o build/icon.icns

# Limpar iconset temporário
rm -rf build/icon.iconset

echo "✅ Ícone criado com sucesso!"
echo "📁 Localização: build/icon.icns"
echo ""
echo "🚀 Agora você pode executar:"
echo "   npm run build:mac"
