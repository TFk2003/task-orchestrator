#!/bin/bash
echo "Starting Task Orchestrator in Development Mode..."

# Start infrastructure
echo "Starting infrastructure services..."
cd docker
docker-compose up -d postgres rabbitmq redis
cd ..

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Start API Server
echo "Starting API Server..."
cd backend/api-server
mvn spring-boot:run &
API_PID=$!
cd ../..

# Wait for API server to start
sleep 15

# Start Worker 1
echo "Starting Worker 1..."
cd backend/worker-node
APP_WORKER_ID=worker-1 SERVER_PORT=8081 mvn spring-boot:run &
WORKER1_PID=$!
cd ../..

# Start Worker 2
echo "Starting Worker 2..."
cd backend/worker-node
APP_WORKER_ID=worker-2 SERVER_PORT=8082 mvn spring-boot:run &
WORKER2_PID=$!
cd ../..

# Start Frontend
echo "Starting Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "Task Orchestrator is running!"
echo "API Server PID: $API_PID"
echo "Worker 1 PID: $WORKER1_PID"
echo "Worker 2 PID: $WORKER2_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Access the application at:"
echo "  - Frontend: http://localhost:3000"
echo "  - API Server: http://localhost:8080"
echo "  - RabbitMQ Management: http://localhost:15672"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
wait