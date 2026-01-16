#!/bin/bash
echo "Running tests..."

# Test API Server
echo "Testing API Server..."
cd backend/api-server
mvn test
cd ../..

# Test Worker Node
echo "Testing Worker Node..."
cd backend/worker-node
mvn test
cd ../..

# Test Frontend
echo "Testing Frontend..."
cd frontend
npm test -- --watchAll=false
cd ..

echo "All tests completed!"