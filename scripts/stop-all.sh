#!/bin/bash
echo "Stopping Task Orchestrator..."

# Kill all Java processes (API and Workers)
pkill -f "spring-boot:run"

# Kill Frontend
pkill -f "react-scripts"

# Stop Docker services
cd docker
docker-compose down
cd ..

echo "All services stopped!"
