# Frontend Docker Deployment Guide

This guide explains how to deploy your Next.js frontend using Docker.

## 🏗️ Project Structure

```
frontend/
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Container orchestration
├── .dockerignore             # Files to exclude from build
├── next.config.js            # Next.js configuration with standalone output
├── build-docker.sh           # Build script
├── deploy-docker.sh          # Deployment script
├── .env.production           # Production environment variables
└── app/api/health/route.ts   # Health check endpoint
```

## 🚀 Quick Start

### 1. Build the Docker Image

```bash
cd frontend
./build-docker.sh
```

### 2. Deploy the Container

```bash
./deploy-docker.sh
```

### 3. Access Your App

- **Frontend**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## 🔧 Configuration Options

### Build Script Options

```bash
./build-docker.sh --help

Options:
  --api-url URL    Backend API URL (default: http://localhost:5000)
  --app-url URL    Frontend URL (default: http://localhost:3000)
  --tag TAG        Docker image tag (default: latest)
  --name NAME      Docker image name (default: callback-listener-frontend)
```

### Deployment Script Options

```bash
./deploy-docker.sh --help

Options:
  --api-url URL       Backend API URL (default: http://localhost:5000)
  --app-url URL       Frontend URL (default: http://localhost:3000)
  --port PORT         Host port to bind (default: 3000)
  --tag TAG           Docker image tag (default: latest)
  --name NAME         Container name (default: callback-listener-frontend)
  --stop              Stop and remove the container
  --logs              Show container logs
```

## 🌐 Production Deployment Examples

### Local Production Test

```bash
# Build for local testing
./build-docker.sh \
  --api-url http://localhost:5000 \
  --app-url http://localhost:3000

# Deploy locally
./deploy-docker.sh \
  --api-url http://localhost:5000 \
  --app-url http://localhost:3000
```

### Remote Server Deployment

```bash
# Build for production server
./build-docker.sh \
  --api-url https://api.yourdomain.com \
  --app-url https://yourdomain.com \
  --tag production

# Deploy to production
./deploy-docker.sh \
  --api-url https://api.yourdomain.com \
  --app-url https://yourdomain.com \
  --port 3000 \
  --tag production
```

### Cloud Deployment (AWS/GCP/Azure)

```bash
# Build for cloud
./build-docker.sh \
  --api-url https://your-backend-service.cloud.com \
  --app-url https://your-frontend.cloud.com \
  --tag cloud

# Tag for container registry
docker tag callback-listener-frontend:cloud your-registry/callback-listener-frontend:latest

# Push to registry
docker push your-registry/callback-listener-frontend:latest
```

## 🐳 Docker Compose Usage

### Simple Deployment

```bash
# Set environment variables
export NEXT_PUBLIC_API_URL=http://localhost:5000
export NEXT_PUBLIC_APP_URL=http://localhost:3000

# Start with docker-compose
docker-compose up -d
```

### Custom Environment

```bash
# Create custom .env file
cat > .env.docker << EOF
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
EOF

# Start with custom environment
docker-compose --env-file .env.docker up -d
```

## 📊 Monitoring & Management

### View Container Status

```bash
docker ps --filter name=callback-listener-frontend
```

### View Logs

```bash
# Real-time logs
./deploy-docker.sh --logs

# Or directly with docker
docker logs -f callback-listener-frontend
```

### Health Check

```bash
# Check application health
curl http://localhost:3000/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-06-13T10:30:00.000Z",
  "service": "callback-listener-frontend",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600,
  "memory": {
    "used": 45678912,
    "total": 67108864
  },
  "config": {
    "apiUrl": "http://localhost:5000",
    "appUrl": "http://localhost:3000"
  }
}
```

### Stop Container

```bash
./deploy-docker.sh --stop
```

## 🔧 Troubleshooting

### Build Issues

```bash
# Check Docker version
docker --version

# Ensure you're in the frontend directory
pwd
# Should show: /Users/payorayo/AI_PROJECTS/callback_listener/frontend

# Clean Docker cache if needed
docker system prune -a
```

### Runtime Issues

```bash
# Check container logs
docker logs callback-listener-frontend

# Check if ports are available
lsof -i :3000

# Restart container
docker restart callback-listener-frontend
```

### Environment Variable Issues

```bash
# Check environment variables in container
docker exec callback-listener-frontend env | grep NEXT_PUBLIC

# Update environment variables
docker stop callback-listener-frontend
./deploy-docker.sh \
  --api-url https://new-api-url.com \
  --app-url https://new-app-url.com
```

## 🏭 Production Best Practices

### 1. Security

- Use non-root user (already configured in Dockerfile)
- Set proper security headers (configured in next.config.js)
- Use HTTPS in production
- Limit container resources

### 2. Performance

- Multi-stage build for smaller images
- Standalone output for faster startup
- Proper caching layers in Dockerfile
- Health checks for monitoring

### 3. Monitoring

```bash
# Resource usage
docker stats callback-listener-frontend

# Container info
docker inspect callback-listener-frontend
```

### 4. Updates

```bash
# Update deployment
./build-docker.sh --tag v2.0.0
./deploy-docker.sh --tag v2.0.0
```

## 🌍 Integration with Backend

Your frontend Docker container can connect to:

1. **Local Backend**: `http://host.docker.internal:5000`
2. **Containerized Backend**: `http://backend-container:5000`
3. **Remote Backend**: `https://api.yourdomain.com`

### Full Stack Docker Compose

Create a `docker-compose.full.yml` in the project root:

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/callback_listener
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=callback_listener
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
```

## 📈 Next Steps

1. **Set up CI/CD** pipeline for automated builds
2. **Configure load balancer** for high availability
3. **Set up monitoring** with Prometheus/Grafana
4. **Implement logging** aggregation
5. **Add SSL/TLS** certificates for HTTPS

Your frontend is now ready for production deployment! 🎉