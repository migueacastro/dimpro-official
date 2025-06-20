#!/bin/bash

# Usage instructions
usage() {
  echo "Usage: $0 [dev|production]"
  echo "  dev        - Start in development mode (default)."
  echo "  production - Start in production mode."
  exit 1
}

# Set MODE to "dev" by default
MODE="dev"

# Check if the first argument is "production"
if [ "$1" = "production" ]; then
  MODE="production"
elif [ -n "$1" ]; then
  # If an argument is provided but it's not "production", show usage instructions
  usage
fi

# Update the .env file with the new MODE and VITE_MODE
ENV_FILE=".env"

DOMAIN=$(grep '^DOMAIN=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '"')

if [ -f "$ENV_FILE" ]; then
  # Update or add MODE and VITE_MODE in the .env file
  if grep -q "^MODE=" "$ENV_FILE"; then
    sed -i.bak "s/^MODE=.*/MODE=$MODE/" "$ENV_FILE"
  else
    echo "MODE=$MODE" >> "$ENV_FILE"
  fi
  
  if grep -q "^VITE_MODE=" "$ENV_FILE"; then
    sed -i.bak "s/^VITE_MODE=.*/VITE_MODE=$MODE/" "$ENV_FILE"
  else
    echo "VITE_MODE=$MODE" >> "$ENV_FILE"
  fi
  # Remove backup file created by sed

  if grep -q "^VITE_DOMAIN=" "$ENV_FILE"; then
    sed -i.bak "s/^VITE_DOMAIN=.*/VITE_DOMAIN=$DOMAIN/" "$ENV_FILE"
  else
    echo "VITE_DOMAIN=$DOMAIN" >> "$ENV_FILE"
  fi

  rm -f "${ENV_FILE}.bak"
else
  echo "Error: .env file not found!"
  exit 1
fi

# Export MODE so it's available to docker-compose
export MODE
export VITE_MODE=$MODE

# Start docker-compose
echo "Starting in $MODE mode..."
if [ "$MODE" = "production" ]; then
  exec docker-compose up
else
  exec docker-compose up db api django-q frontend nginx
fi