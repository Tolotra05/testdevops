FROM python:3.11-slim

# Créer le dossier /app
RUN mkdir -p /app
WORKDIR /app

# Copier les requirements d'abord (pour le cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier TOUT
COPY . .

# Vérifier que app.py est là
RUN ls -la /app/ && echo "=== app.py ===" && head -5 app.py || echo "ERREUR: app.py non trouvé!"

EXPOSE 5000

CMD ["python", "app.py"]
