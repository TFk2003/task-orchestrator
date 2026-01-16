#!/bin/bash
echo "Building Task Orchestrator..."

# Build Backend API Server
echo "Building API Server..."
cd backend/api-server
mvn clean package -DskipTests
cd ../..

# Build Worker Node
echo "Building Worker Node..."
cd backend/worker-node
mvn clean package -DskipTests
cd ../..

# Build Frontend
echo "Building Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Build complete!"
