# 🐳 Docker and Containers

APIDoc can easily run in Docker containers, providing a consistent environment for generating documentation on any system.

## 🚀 Quick Start with Docker

### Docker Hub Image
```bash
# Download official image
docker pull hrefcl/apidoc:latest

# Generate documentation
docker run --rm \
  -v $(pwd):/workspace \
  hrefcl/apidoc:latest \
  -i /workspace/src \
  -o /workspace/docs
```

### Local Image
```bash
# Build image from source code
git clone https://github.com/hrefcl/apidoc.git
cd apidoc
docker build -t apidoc:local .

# Use local image
docker run --rm \
  -v $(pwd):/workspace \
  apidoc:local \
  -i /workspace/src \
  -o /workspace/docs
```

## 🛠️ Complete Dockerfile

### Multi-Stage Dockerfile
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

# Metadata
LABEL maintainer="APIDoc Team"
LABEL version="5.0.0"
LABEL description="APIDoc - REST documentation generator"

# Configure working directory
WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY lib/ ./lib/
COPY bin/ ./bin/
COPY template/ ./template/

# Compile TypeScript
RUN npm run build

# Production image
FROM node:20-alpine AS production

# Install system tools
RUN apk add --no-cache \
    git \
    bash \
    curl

# Create non-root user
RUN addgroup -g 1000 apidoc && \
    adduser -D -s /bin/bash -u 1000 -G apidoc apidoc

# Configure working directory
WORKDIR /home/apidoc

# Copy compiled application
COPY --from=builder --chown=apidoc:apidoc /app/dist ./
COPY --from=builder --chown=apidoc:apidoc /app/node_modules ./node_modules/
COPY --from=builder --chown=apidoc:apidoc /app/template ./template/
COPY --from=builder --chown=apidoc:apidoc /app/bin ./bin/

# Make script executable
RUN chmod +x ./bin/apidoc

# Switch to non-root user
USER apidoc

# Configure PATH
ENV PATH="/home/apidoc/bin:${PATH}"

# Entry point
ENTRYPOINT ["apidoc"]

# Default command
CMD ["--help"]
```

### Development Dockerfile
```dockerfile
# Dockerfile.dev
FROM node:20-alpine

# Install development tools
RUN apk add --no-cache \
    git \
    bash \
    curl \
    vim

WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Expose port for development
EXPOSE 8080 3000 3001

# Development command
CMD ["npm", "run", "dev"]
```

## 🔧 Docker Compose

### Basic docker-compose.yml
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

### docker-compose.dev.yml for Development
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
      - "8080:8080"  # Development server
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

### Configuration with Watch Mode
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
        # Generate initial documentation (CLI v5)
        apidoc generate -i src -o docs

        # Watch for changes using inotify
        apk add --no-cache inotify-tools
        while inotifywait -r -e modify,create,delete src; do
          echo 'Changes detected, regenerating documentation...'
          apidoc generate -i src -o docs
          echo 'Documentation updated'
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

## 🔄 Automation Scripts

### Makefile
```makefile
# Makefile
.PHONY: build run dev clean docs

# Variables
IMAGE_NAME = apidoc
CONTAINER_NAME = apidoc-container
SRC_DIR = ./src
DOCS_DIR = ./docs

# Build image
build:
	docker build -t $(IMAGE_NAME) .

# Generate documentation
docs:
	docker run --rm \
		-v $(SRC_DIR):/workspace/src:ro \
		-v $(DOCS_DIR):/workspace/docs \
		-v ./apidoc.json:/workspace/apidoc.json:ro \
		$(IMAGE_NAME) \
		-i /workspace/src \
		-o /workspace/docs

# Development with watch
dev:
	docker-compose -f docker-compose.dev.yml up --build

# Serve documentation
serve:
	docker-compose up --build

# Clean containers and images
clean:
	docker-compose down
	docker rmi $(IMAGE_NAME) 2>/dev/null || true
	docker system prune -f

# Logs
logs:
	docker-compose logs -f apidoc

# Interactive shell
shell:
	docker run --rm -it \
		-v $(SRC_DIR):/workspace/src \
		-v $(DOCS_DIR):/workspace/docs \
		$(IMAGE_NAME) sh
```

### npm Scripts with Docker
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

## 🌐 Nginx Configuration

### nginx.conf to Serve Docs
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Log configuration
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # gzip configuration
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

        # Documentation directory
        root /usr/share/nginx/html;
        index index.html;

        # Cache configuration for assets
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # SPA configuration
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # CORS for development
        location /api {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        }
    }
}
```

## 🚀 Deployment with Docker

### Production Deploy
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting APIDoc deployment..."

# Variables
IMAGE_NAME="apidoc:$(git rev-parse --short HEAD)"
REGISTRY="your-registry.com"
PROJECT_NAME="my-api-docs"

# Build image
echo "📦 Building image..."
docker build -t $IMAGE_NAME .

# Tag for registry
docker tag $IMAGE_NAME $REGISTRY/$PROJECT_NAME:latest
docker tag $IMAGE_NAME $REGISTRY/$PROJECT_NAME:$(git rev-parse --short HEAD)

# Push to registry
echo "☁️  Pushing image to registry..."
docker push $REGISTRY/$PROJECT_NAME:latest
docker push $REGISTRY/$PROJECT_NAME:$(git rev-parse --short HEAD)

# Deploy with docker-compose in production
echo "🔄 Deploying to production..."
ssh user@production-server "
  cd /opt/$PROJECT_NAME &&
  docker-compose pull &&
  docker-compose up -d &&
  docker image prune -f
"

echo "✅ Deployment complete!"
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

## ⚡ Optimizations

### Optimized Multi-Stage Build
```dockerfile
# Optimized Dockerfile
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

### Build Cache
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

## 🔍 Monitoring and Logs

### Health Check
```dockerfile
# Add health check to Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD apidoc --version || exit 1
```

### Logging with Docker
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

Docker provides a consistent and reproducible way to run APIDoc in any environment, from local development to large-scale production.
