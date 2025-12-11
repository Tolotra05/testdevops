#!/bin/bash

set -e

echo "🔨 Build des images Docker..."
docker compose build

echo "🚀 Démarrage des services..."
docker compose up -d

echo "📋 Logs (Ctrl+C pour quitter)..."
docker compose logs 
