# 🐳 Docker y Contenedores

APIDoc puede ejecutarse fácilmente en contenedores Docker, proporcionando un entorno consistente para generar documentación en cualquier sistema.

## 🚀 Uso Rápido con Docker

### Docker Hub Image
```bash
# Descargar imagen oficial
docker pull hrefcl/apidoc:latest

# Generar documentación
docker run --rm \
  -v $(pwd):/workspace \
  hrefcl/apidoc:latest \
  -i /workspace/src \
  -o /workspace/docs
```

### Imagen Local
```bash
# Construir imagen desde código fuente
git clone https://github.com/hrefcl/apidoc.git
cd apidoc
docker build -t apidoc:local .

# Usar imagen local
docker run --rm \
  -v $(pwd):/workspace \
  apidoc:local \
  -i /workspace/src \
  -o /workspace/docs
```

## 🛠️ Dockerfile Completo

### Dockerfile Multi-Stage
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

# Metadatos
LABEL maintainer="APIDoc Team"
LABEL version="5.0.0"
LABEL description="APIDoc - Generador de documentación REST"

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar código fuente
COPY lib/ ./lib/
COPY bin/ ./bin/
COPY template/ ./template/

# Compilar TypeScript
RUN npm run build

# Imagen de producción
FROM node:20-alpine AS production

# Instalar herramientas del sistema
RUN apk add --no-cache \
    git \
    bash \
    curl

# Crear usuario no-root
RUN addgroup -g 1000 apidoc && \
    adduser -D -s /bin/bash -u 1000 -G apidoc apidoc

# Configurar directorio de trabajo
WORKDIR /home/apidoc

# Copiar aplicación compilada
COPY --from=builder --chown=apidoc:apidoc /app/dist ./
COPY --from=builder --chown=apidoc:apidoc /app/node_modules ./node_modules/
COPY --from=builder --chown=apidoc:apidoc /app/template ./template/
COPY --from=builder --chown=apidoc:apidoc /app/bin ./bin/

# Hacer ejecutable el script
RUN chmod +x ./bin/apidoc

# Cambiar a usuario no-root
USER apidoc

# Configurar PATH
ENV PATH="/home/apidoc/bin:${PATH}"

# Punto de entrada
ENTRYPOINT ["apidoc"]

# Comando por defecto
CMD ["--help"]
```

### Dockerfile de Desarrollo
```dockerfile
# Dockerfile.dev
FROM node:20-alpine

# Instalar herramientas de desarrollo
RUN apk add --no-cache \
    git \
    bash \
    curl \
    vim

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar todas las dependencias (incluyendo dev)
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto para desarrollo
EXPOSE 8080 3000 3001

# Comando de desarrollo
CMD ["npm", "run", "dev"]
```

## 🔧 Docker Compose

### docker-compose.yml Básico
```yaml
version: '3.8'

services:
  apidoc:
    build: .
    container_name: apidoc-generator
    volumes:
      - ./src:/workspace/src:ro
      - ./docs:/workspace/docs
      - ./apidoc.json:/workspace/apidoc.json:ro
    working_dir: /workspace
    command: ["-i", "src", "-o", "docs"]

  docs-server:
    image: nginx:alpine
    container_name: apidoc-server
    ports:
      - "8080:80"
    volumes:
      - ./docs:/usr/share/nginx/html:ro
    depends_on:
      - apidoc
```

### docker-compose.dev.yml para Desarrollo
```yaml
version: '3.8'

services:
  apidoc-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: apidoc-dev
    volumes:
      - .:/app
      - /app/node_modules
      - ./example:/workspace/example:ro
      - ./tmp/docs:/workspace/docs
    ports:
      - "8080:8080"  # Servidor de desarrollo
      - "3000:3000"  # Hot reload
      - "3001:3001"  # TypeDoc
    environment:
      - NODE_ENV=development
    command: ["npm", "run", "dev:template"]

  docs-preview:
    image: nginx:alpine
    container_name: docs-preview
    ports:
      - "9090:80"
    volumes:
      - ./tmp/docs:/usr/share/nginx/html:ro
    depends_on:
      - apidoc-dev
```

### Configuración con Watch Mode
```yaml
version: '3.8'

services:
  apidoc-watch:
    build: .
    container_name: apidoc-watch
    volumes:
      - ./src:/workspace/src:ro
      - ./docs:/workspace/docs
      - ./apidoc.json:/workspace/apidoc.json:ro
    working_dir: /workspace
    command: >
      sh -c "
        # Generar documentación inicial (CLI v5)
        apidoc generate -i src -o docs

        # Vigilar cambios usando inotify
        apk add --no-cache inotify-tools
        while inotifywait -r -e modify,create,delete src; do
          echo 'Cambios detectados, regenerando documentación...'
          apidoc generate -i src -o docs
          echo 'Documentación actualizada'
        done
      "

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./docs:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - apidoc-watch
```

## 🔄 Scripts de Automatización

### Makefile
```makefile
# Makefile
.PHONY: build run dev clean docs

# Variables
IMAGE_NAME = apidoc
CONTAINER_NAME = apidoc-container
SRC_DIR = ./src
DOCS_DIR = ./docs

# Construir imagen
build:
	docker build -t $(IMAGE_NAME) .

# Generar documentación
docs:
	docker run --rm \
		-v $(SRC_DIR):/workspace/src:ro \
		-v $(DOCS_DIR):/workspace/docs \
		-v ./apidoc.json:/workspace/apidoc.json:ro \
		$(IMAGE_NAME) \
		-i /workspace/src \
		-o /workspace/docs

# Desarrollo con watch
dev:
	docker-compose -f docker-compose.dev.yml up --build

# Servir documentación
serve:
	docker-compose up --build

# Limpiar contenedores e imágenes
clean:
	docker-compose down
	docker rmi $(IMAGE_NAME) 2>/dev/null || true
	docker system prune -f

# Logs
logs:
	docker-compose logs -f apidoc

# Shell interactivo
shell:
	docker run --rm -it \
		-v $(SRC_DIR):/workspace/src \
		-v $(DOCS_DIR):/workspace/docs \
		$(IMAGE_NAME) sh
```

### Scripts npm con Docker
```json
{
  "scripts": {
    "docker:build": "docker build -t apidoc:local .",
    "docker:docs": "docker run --rm -v $(pwd)/src:/workspace/src:ro -v $(pwd)/docs:/workspace/docs apidoc:local -i /workspace/src -o /workspace/docs",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up --build",
    "docker:serve": "docker-compose up --build",
    "docker:clean": "docker-compose down && docker system prune -f"
  }
}
```

## 🌐 Configuración Nginx

### nginx.conf para Servir Docs
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Configuración de logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Configuración de gzip
    gzip on;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen 80;
        server_name localhost;

        # Directorio de documentación
        root /usr/share/nginx/html;
        index index.html;

        # Configuración de cache para assets
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Configuración para SPA
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Headers de seguridad
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # CORS para desarrollo
        location /api {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        }
    }
}
```

## 🚀 Deployment con Docker

### Deploy a Producción
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Iniciando deploy de APIDoc..."

# Variables
IMAGE_NAME="apidoc:$(git rev-parse --short HEAD)"
REGISTRY="your-registry.com"
PROJECT_NAME="my-api-docs"

# Build de imagen
echo "📦 Construyendo imagen..."
docker build -t $IMAGE_NAME .

# Tag para registro
docker tag $IMAGE_NAME $REGISTRY/$PROJECT_NAME:latest
docker tag $IMAGE_NAME $REGISTRY/$PROJECT_NAME:$(git rev-parse --short HEAD)

# Push a registro
echo "☁️  Subiendo imagen a registro..."
docker push $REGISTRY/$PROJECT_NAME:latest
docker push $REGISTRY/$PROJECT_NAME:$(git rev-parse --short HEAD)

# Deploy con docker-compose en producción
echo "🔄 Desplegando en producción..."
ssh user@production-server "
  cd /opt/$PROJECT_NAME &&
  docker-compose pull &&
  docker-compose up -d &&
  docker image prune -f
"

echo "✅ Deploy completado!"
```

### docker-compose.prod.yml
```yaml
version: '3.8'

services:
  apidoc:
    image: your-registry.com/my-api-docs:latest
    restart: unless-stopped
    volumes:
      - docs-data:/workspace/docs
    environment:
      - NODE_ENV=production
    command: ["-i", "/workspace/src", "-o", "/workspace/docs"]

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - docs-data:/usr/share/nginx/html:ro
      - ./nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - apidoc

  watchtower:
    image: containrrr/watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 300 --cleanup

volumes:
  docs-data:
```

## ⚡ Optimizaciones

### Multi-Stage Build Optimizado
```dockerfile
# Dockerfile optimizado
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
RUN addgroup -g 1000 -S apidoc && \
    adduser -S apidoc -u 1000

WORKDIR /home/apidoc

COPY --from=deps --chown=apidoc:apidoc /app/node_modules ./node_modules
COPY --from=builder --chown=apidoc:apidoc /app/dist ./
COPY --from=builder --chown=apidoc:apidoc /app/template ./template
COPY --from=builder --chown=apidoc:apidoc /app/bin ./bin

USER apidoc
ENV PATH="/home/apidoc/bin:${PATH}"

ENTRYPOINT ["apidoc"]
```

### Cache de Build
```yaml
# .github/workflows/docker.yml
name: Docker Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: hrefcl/apidoc:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## 🔍 Monitoring y Logs

### Health Check
```dockerfile
# Agregar health check al Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD apidoc --version || exit 1
```

### Logging con Docker
```yaml
version: '3.8'

services:
  apidoc:
    build: .
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    volumes:
      - ./logs:/var/log/apidoc
```

Docker proporciona una forma consistente y reproducible de ejecutar APIDoc en cualquier entorno, desde desarrollo local hasta producción en gran escala.