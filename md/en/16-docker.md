---
title: "Docker & Container Usage"
category: "Development"
order: 16
---

# 🐳 Docker & Container Usage

Complete guide for containerizing APIDoc documentation with Docker, including production-ready configurations, multi-stage builds, and orchestration patterns.

## 🚀 Quick Start

### Basic Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Generate documentation
RUN npx apidoc -i src/ -o docs/

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start static server
CMD ["npx", "http-server", "docs", "-p", "8080", "-c-1"]
```

### Build and Run
```bash
# Build the image
docker build -t my-api-docs .

# Run the container
docker run -p 8080:8080 my-api-docs

# Access documentation
curl http://localhost:8080
```

## 🏗️ Multi-Stage Build

### Optimized Production Build
```dockerfile
# Multi-stage Dockerfile for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code and configuration
COPY src/ ./src/
COPY apidoc.json ./
COPY template/ ./template/
COPY assets/ ./assets/

# Generate documentation
RUN npx apidoc -i src/ -o docs/ --template template/

# Production stage
FROM nginx:alpine AS production

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy generated documentation from builder stage
COPY --from=builder /app/docs /usr/share/nginx/html

# Copy custom assets
COPY --from=builder /app/assets /usr/share/nginx/html/assets

# Create nginx user
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Set ownership
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Switch to non-root user
USER nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Expose port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration
```nginx
# docker/nginx.conf
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /tmp/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 16M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    server {
        listen 8080;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Enable browser caching for static assets
        location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API documentation
        location / {
            try_files $uri $uri/ /index.html;
            add_header X-Frame-Options "SAMEORIGIN";
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## 🔐 Docker with Authentication

### Authenticated Documentation Container
```dockerfile
# Dockerfile with authentication
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source and config
COPY src/ ./src/
COPY apidoc.json ./
COPY template/ ./template/

# Generate documentation with auth
RUN npx apidoc -i src/ -o docs/ --template template/

# Production stage with authentication server
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy authentication server
COPY server/ ./server/
COPY --from=builder /app/docs ./docs/

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G appgroup -g appgroup appuser

# Set ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Start authentication server
CMD ["node", "server/app.js"]
```

### Authentication Server
```javascript
// server/app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_TIMEOUT || '3600000') // 1 hour
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Login page
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>API Documentation - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; }
            .container { max-width: 400px; margin: 100px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; }
            input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
            button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #0056b3; }
            .error { color: red; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>API Documentation Access</h2>
            <form method="POST" action="/login">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit">Login</button>
                ${req.query.error ? `<div class="error">Invalid credentials</div>` : ''}
            </form>
        </div>
    </body>
    </html>
  `);
});

// Login handler
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simple authentication (replace with your auth logic)
  const validUsers = {
    'admin': 'admin123',
    'developer': 'dev123',
    'viewer': 'view123'
  };

  if (validUsers[username] && validUsers[username] === password) {
    req.session.authenticated = true;
    req.session.user = username;
    res.redirect('/');
  } else {
    res.redirect('/login?error=1');
  }
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve documentation (protected)
app.use('/', requireAuth, express.static(path.join(__dirname, '../docs')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
```

## 🎯 Docker Compose

### Basic Setup
```yaml
# docker-compose.yml
version: '3.8'

services:
  api-docs:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Optional: Add reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - api-docs
    restart: unless-stopped
```

### Production Setup with SSL
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api-docs:
    build:
      context: .
      target: production
    environment:
      - NODE_ENV=production
      - SESSION_SECRET=${SESSION_SECRET}
      - AUTH_TYPE=${AUTH_TYPE}
      - AUTH_ENDPOINT=${AUTH_ENDPOINT}
    volumes:
      - ./logs:/var/log/nginx
      - ./data:/app/data:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - api-docs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  default:
    name: apidoc-network
```

### Development Setup
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  api-docs-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
      - "35729:35729" # LiveReload
    environment:
      - NODE_ENV=development
      - CHOKIDAR_USEPOLLING=true
    volumes:
      - ./src:/app/src:ro
      - ./docs:/app/docs
      - ./apidoc.json:/app/apidoc.json:ro
      - /app/node_modules
    restart: unless-stopped
    command: npm run dev
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/docker.yml
name: Build and Deploy Docker Image

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/api-docs

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha

    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: Deploy to staging
      if: github.ref == 'refs/heads/develop'
      run: |
        echo "Deploying to staging..."
        # Add your staging deployment commands here

    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: |
        echo "Deploying to production..."
        # Add your production deployment commands here
```

### GitLab CI
```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_REGISTRY: $CI_REGISTRY
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE
  DOCKER_TAG: $CI_COMMIT_SHORT_SHA

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $DOCKER_IMAGE:$DOCKER_TAG .
    - docker push $DOCKER_IMAGE:$DOCKER_TAG
  only:
    - main
    - develop

test:
  stage: test
  image: $DOCKER_IMAGE:$DOCKER_TAG
  script:
    - wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
  only:
    - main
    - develop

deploy_staging:
  stage: deploy
  script:
    - docker pull $DOCKER_IMAGE:$DOCKER_TAG
    - docker stop api-docs-staging || true
    - docker run -d --name api-docs-staging -p 8081:8080 $DOCKER_IMAGE:$DOCKER_TAG
  environment:
    name: staging
    url: https://api-docs-staging.example.com
  only:
    - develop

deploy_production:
  stage: deploy
  script:
    - docker pull $DOCKER_IMAGE:$DOCKER_TAG
    - docker stop api-docs-prod || true
    - docker run -d --name api-docs-prod -p 8080:8080 $DOCKER_IMAGE:$DOCKER_TAG
  environment:
    name: production
    url: https://api-docs.example.com
  only:
    - main
  when: manual
```

## ☸️ Kubernetes Deployment

### Basic Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-docs
  labels:
    app: api-docs
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-docs
  template:
    metadata:
      labels:
        app: api-docs
    spec:
      containers:
      - name: api-docs
        image: my-registry/api-docs:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
        - name: SESSION_SECRET
          valueFrom:
            secretKeyRef:
              name: api-docs-secrets
              key: session-secret
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
      imagePullSecrets:
      - name: registry-secret

---
apiVersion: v1
kind: Service
metadata:
  name: api-docs-service
spec:
  selector:
    app: api-docs
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-docs-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api-docs.example.com
    secretName: api-docs-tls
  rules:
  - host: api-docs.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-docs-service
            port:
              number: 80
```

### ConfigMap and Secrets
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-docs-config
data:
  NODE_ENV: "production"
  AUTH_TYPE: "remote"
  AUTH_ENDPOINT: "https://auth.example.com/api/validate"

---
apiVersion: v1
kind: Secret
metadata:
  name: api-docs-secrets
type: Opaque
data:
  session-secret: <base64-encoded-secret>
  api-token: <base64-encoded-token>
```

### Helm Chart
```yaml
# helm/values.yaml
replicaCount: 3

image:
  repository: my-registry/api-docs
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: api-docs.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: api-docs-tls
      hosts:
        - api-docs.example.com

resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80

config:
  nodeEnv: production
  authType: remote
  authEndpoint: https://auth.example.com/api/validate

secrets:
  sessionSecret: ""
  apiToken: ""
```

## 🔧 Advanced Configurations

### Multi-Environment Container
```dockerfile
# Dockerfile.multi-env
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Development stage
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Test stage
FROM base AS test
RUN npm ci
COPY . .
RUN npm test

# Build stage
FROM base AS build
RUN npm ci
COPY . .
RUN npx apidoc -i src/ -o docs/

# Production stage
FROM nginx:alpine AS production
COPY --from=build /app/docs /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker with Volume Mounting
```yaml
# docker-compose.volumes.yml
version: '3.8'

services:
  api-docs:
    build: .
    ports:
      - "8080:8080"
    volumes:
      # Mount source code for development
      - ./src:/app/src:ro
      - ./apidoc.json:/app/apidoc.json:ro

      # Mount output directory
      - docs-volume:/app/docs

      # Mount configuration
      - ./config:/app/config:ro

      # Mount logs
      - ./logs:/app/logs
    environment:
      - NODE_ENV=development
      - WATCH_FILES=true
    restart: unless-stopped

volumes:
  docs-volume:
    driver: local
```

## 📊 Monitoring & Logging

### Docker Logging Configuration
```yaml
# docker-compose.logging.yml
version: '3.8'

services:
  api-docs:
    build: .
    ports:
      - "8080:8080"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api-docs.rule=Host(`api-docs.example.com`)"

  # Log aggregation
  filebeat:
    image: elastic/filebeat:7.17.0
    volumes:
      - ./filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    depends_on:
      - api-docs
```

### Health Check Implementation
```javascript
// health.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {}
  };

  // Check if documentation files exist
  try {
    const docsPath = path.join(__dirname, 'docs', 'index.html');
    fs.accessSync(docsPath, fs.constants.F_OK);
    health.checks.documentation = 'healthy';
  } catch (error) {
    health.checks.documentation = 'unhealthy';
    health.status = 'unhealthy';
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  health.checks.memory = {
    rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
    status: memUsage.heapUsed < 200 * 1024 * 1024 ? 'healthy' : 'warning'
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

app.listen(3001, () => {
  console.log('Health check server running on port 3001');
});
```

## 📋 Best Practices

### Security
- ✅ Use non-root users in containers
- ✅ Scan images for vulnerabilities
- ✅ Keep base images updated
- ✅ Use minimal base images (Alpine)
- ✅ Set resource limits

### Performance
- ✅ Use multi-stage builds
- ✅ Optimize image layers
- ✅ Enable compression
- ✅ Implement caching strategies
- ✅ Use health checks

### Operations
- ✅ Implement proper logging
- ✅ Monitor resource usage
- ✅ Set up alerts
- ✅ Regular backups
- ✅ Document deployment procedures

APIDoc's Docker integration provides scalable, production-ready containerization for documentation deployment across all environments.