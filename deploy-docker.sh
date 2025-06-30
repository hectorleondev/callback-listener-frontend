#!/bin/bash

# Frontend Docker Deployment Script
echo "🚀 Deploying Frontend Container"

# Set default values
CONTAINER_NAME="callback-listener-frontend"
IMAGE_NAME="callback-listener-frontend"
TAG="latest"
PORT="3000"
API_URL="http://localhost:5000"
APP_URL="http://localhost:3000"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --api-url)
      API_URL="$2"
      shift 2
      ;;
    --app-url)
      APP_URL="$2"
      shift 2
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    --tag)
      TAG="$2"
      shift 2
      ;;
    --name)
      CONTAINER_NAME="$2"
      shift 2
      ;;
    --image)
      IMAGE_NAME="$2"
      shift 2
      ;;
    --stop)
      echo "🛑 Stopping container $CONTAINER_NAME..."
      docker stop "$CONTAINER_NAME" 2>/dev/null
      docker rm "$CONTAINER_NAME" 2>/dev/null
      echo "✅ Container stopped and removed"
      exit 0
      ;;
    --logs)
      echo "📋 Showing logs for $CONTAINER_NAME..."
      docker logs -f "$CONTAINER_NAME"
      exit 0
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --api-url URL       Backend API URL (default: http://localhost:5000)"
      echo "  --app-url URL       Frontend URL (default: http://localhost:3000)"
      echo "  --port PORT         Host port to bind (default: 3000)"
      echo "  --tag TAG           Docker image tag (default: latest)"
      echo "  --name NAME         Container name (default: callback-listener-frontend)"
      echo "  --image IMAGE       Image name (default: callback-listener-frontend)"
      echo "  --stop              Stop and remove the container"
      echo "  --logs              Show container logs"
      echo "  -h, --help          Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

echo "🔧 Deployment Configuration:"
echo "   Container Name: $CONTAINER_NAME"
echo "   Image: $IMAGE_NAME:$TAG"
echo "   Port: $PORT"
echo "   API URL: $API_URL"
echo "   App URL: $APP_URL"
echo ""

# Check if image exists
if ! docker image inspect "$IMAGE_NAME:$TAG" >/dev/null 2>&1; then
    echo "❌ Error: Image $IMAGE_NAME:$TAG not found."
    echo "💡 Build the image first:"
    echo "   ./build-docker.sh --api-url $API_URL --app-url $APP_URL"
    exit 1
fi

# Stop existing container if running
if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
    echo "🛑 Stopping existing container..."
    docker stop "$CONTAINER_NAME"
fi

# Remove existing container if it exists
if docker ps -aq -f name="$CONTAINER_NAME" | grep -q .; then
    echo "🗑️  Removing existing container..."
    docker rm "$CONTAINER_NAME"
fi

# Run the new container
echo "🐳 Starting new container..."
docker run -d \
  --name "$CONTAINER_NAME" \
  -p "$PORT:3000" \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL="$API_URL" \
  -e NEXT_PUBLIC_APP_URL="$APP_URL" \
  --restart unless-stopped \
  "$IMAGE_NAME:$TAG"

# Check if container started successfully
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Container started successfully!"
    echo ""
    echo "🌐 Frontend URL: http://localhost:$PORT"
    echo "📊 Container Status:"
    docker ps --filter name="$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "📋 To view logs: docker logs -f $CONTAINER_NAME"
    echo "🛑 To stop: docker stop $CONTAINER_NAME"
    echo ""
    echo "🎉 Frontend is now running in production mode!"
else
    echo ""
    echo "❌ Failed to start container!"
    exit 1
fi