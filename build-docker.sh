#!/bin/bash

# Frontend Docker Build Script
echo "🐳 Building Frontend Docker Image"

# Set default values
IMAGE_NAME="callback-listener-frontend"
TAG="latest"
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
    --tag)
      TAG="$2"
      shift 2
      ;;
    --name)
      IMAGE_NAME="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --api-url URL    Backend API URL (default: http://localhost:5000)"
      echo "  --app-url URL    Frontend URL (default: http://localhost:3000)"
      echo "  --tag TAG        Docker image tag (default: latest)"
      echo "  --name NAME      Docker image name (default: callback-listener-frontend)"
      echo "  -h, --help       Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

echo "🔧 Build Configuration:"
echo "   Image Name: $IMAGE_NAME:$TAG"
echo "   API URL: $API_URL"
echo "   App URL: $APP_URL"
echo ""

# Check if Dockerfile exists
if [ ! -f "Dockerfile" ]; then
    echo "❌ Error: Dockerfile not found. Make sure you're in the frontend directory."
    exit 1
fi

# Build the Docker image
echo "🏗️  Building Docker image..."
docker build \
  --build-arg NEXT_PUBLIC_API_URL="$API_URL" \
  --build-arg NEXT_PUBLIC_APP_URL="$APP_URL" \
  -t "$IMAGE_NAME:$TAG" \
  .

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 To run the container:"
    echo "   docker run -p 3000:3000 $IMAGE_NAME:$TAG"
    echo ""
    echo "🐳 To run with docker-compose:"
    echo "   NEXT_PUBLIC_API_URL=$API_URL NEXT_PUBLIC_APP_URL=$APP_URL docker-compose up"
    echo ""
    echo "📊 Image details:"
    docker images "$IMAGE_NAME:$TAG" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi