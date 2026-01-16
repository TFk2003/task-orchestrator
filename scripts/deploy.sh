#!/bin/bash
echo "Deploying Task Orchestrator..."

# Build all services
./build-all.sh

# Start with Docker Compose
cd docker
docker-compose up -d --build

echo "Deployment complete!"
echo "Services are starting..."
echo "Check status with: docker-compose ps"