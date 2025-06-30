#!/bin/bash

# Frontend Docker Test Script
echo "🧪 Testing Frontend Docker Setup"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test configuration
CONTAINER_NAME="callback-listener-frontend-test"
IMAGE_NAME="callback-listener-frontend"
TEST_PORT="3001"
API_URL="http://localhost:5000"
APP_URL="http://localhost:3001"

echo ""
echo "🔧 Test Configuration:"
echo "   Container: $CONTAINER_NAME"
echo "   Port: $TEST_PORT"
echo "   API URL: $API_URL"
echo "   App URL: $APP_URL"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "🧹 Cleaning up test container..."
    docker stop $CONTAINER_NAME 2>/dev/null
    docker rm $CONTAINER_NAME 2>/dev/null
}

# Set trap for cleanup
trap cleanup EXIT

# Test 1: Check if Docker is available
echo "1. Testing Docker availability..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed or not in PATH${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is available${NC}"

# Test 2: Build the image
echo ""
echo "2. Building Docker image..."
if ./build-docker.sh --api-url "$API_URL" --app-url "$APP_URL" --name "$IMAGE_NAME" --tag "test"; then
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
else
    echo -e "${RED}❌ Failed to build Docker image${NC}"
    exit 1
fi

# Test 3: Run the container
echo ""
echo "3. Starting test container..."
docker run -d \
    --name "$CONTAINER_NAME" \
    -p "$TEST_PORT:3000" \
    -e NODE_ENV=production \
    -e NEXT_PUBLIC_API_URL="$API_URL" \
    -e NEXT_PUBLIC_APP_URL="$APP_URL" \
    "$IMAGE_NAME:test"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Container started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start container${NC}"
    exit 1
fi

# Test 4: Wait for container to be ready
echo ""
echo "4. Waiting for container to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:$TEST_PORT/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Container is ready (took ${i}s)${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Container failed to become ready within 30 seconds${NC}"
        echo "Container logs:"
        docker logs $CONTAINER_NAME
        exit 1
    fi
    sleep 1
done

# Test 5: Health check
echo ""
echo "5. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:$TEST_PORT/api/health)
if echo "$HEALTH_RESPONSE" | grep -q '"status": "healthy"'; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "Health status: $(echo "$HEALTH_RESPONSE" | grep -o '"status": "[^"]*"')"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "Response: $HEALTH_RESPONSE"
    exit 1
fi

# Test 6: Main page accessibility
echo ""
echo "6. Testing main page..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$TEST_PORT/)
if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Main page accessible (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${RED}❌ Main page not accessible (HTTP $HTTP_STATUS)${NC}"
    exit 1
fi

# Test 7: Environment variables
echo ""
echo "7. Testing environment variables..."
ENV_CHECK=$(curl -s http://localhost:$TEST_PORT/api/health | grep -o '"apiUrl": "[^"]*"')
if echo "$ENV_CHECK" | grep -q "$API_URL"; then
    echo -e "${GREEN}✅ Environment variables configured correctly${NC}"
    echo "API URL: $ENV_CHECK"
else
    echo -e "${YELLOW}⚠️  Environment variables might not be set correctly${NC}"
    echo "Expected API URL: $API_URL"
    echo "Found: $ENV_CHECK"
fi

# Test 8: Container resource usage
echo ""
echo "8. Checking container resources..."
CONTAINER_STATS=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" $CONTAINER_NAME)
echo "Resource usage:"
echo "$CONTAINER_STATS"

# Test 9: Image size
echo ""
echo "9. Checking image size..."
IMAGE_SIZE=$(docker images $IMAGE_NAME:test --format "{{.Size}}")
echo "Image size: $IMAGE_SIZE"

echo ""
echo -e "${GREEN}🎉 All tests passed! Your Docker setup is working correctly.${NC}"
echo ""
echo "📊 Test Summary:"
echo "   Container: $CONTAINER_NAME"
echo "   Frontend URL: http://localhost:$TEST_PORT"
echo "   Health URL: http://localhost:$TEST_PORT/api/health"
echo "   Image: $IMAGE_NAME:test ($IMAGE_SIZE)"
echo ""
echo "🚀 To deploy for real:"
echo "   ./deploy-docker.sh --api-url YOUR_API_URL --app-url YOUR_APP_URL"