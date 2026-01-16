# Task Orchestrator - Distributed Microservices System

## Project Overview
A distributed task management system with microservices architecture for processing and orchestrating tasks across multiple worker nodes.

## Architecture
┌─────────────────┐    ┌──────────────┐    ┌──────────────┐
│ Frontend        │    │ API Server   │    │ RabbitMQ     │
│ (React)         │◄──►│ (Spring)     │◄──►│ (Message     │
└─────────────────┘    └──────────────┘    │ Queue)       │
                                           └──────────────┘
                                                │
                                            ┌──────────────┐
                                            │ Worker       │
                                            │ Nodes        │
                                            │ (Spring)     │
                                            └──────────────┘

## Services
1. **Frontend** - React.js dashboard for task management
2. **API Server** - Spring Boot REST API for task orchestration
3. **Worker Nodes** - Spring Boot workers for task processing
4. **RabbitMQ** - Message queue for task distribution
5. **PostgreSQL** - Database for task persistence

## Prerequisites
- Docker & Docker Compose
- Java 21+
- Node.js 18+
- Maven

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/task-orchestrator.git
cd task-orchestrator

# Start all services
docker-compose up -d

# Access the application
Frontend: http://localhost:3000
API Docs: http://localhost:8080/swagger-ui.html
RabbitMQ: http://localhost:15672 (admin/password123)
```

## API Endpoints
- GET /api/tasks - List all tasks
- POST /api/tasks - Submit new task
- GET /api/tasks/{id} - Get task details
- GET /api/workers - List worker nodes
- GET /api/statistics - System statistics

## Task Types
- IMAGE_PROCESSING
- WEB_SCRAPING
- DATA_TRANSFORMATION
- REPORT_GENERATION

## Development
```bash
# Backend development
cd backend
mvn spring-boot:run

# Frontend development
cd frontend
npm install
npm start

# Worker development
cd worker
mvn spring-boot:run
```

## Docker Commands
```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build api-server
```

## Configuration

See docker-compose.yml and individual service configuration files.

## Environment Variables
- RABBITMQ_HOST: RabbitMQ host (default: rabbitmq)
- RABBITMQ_PORT: RabbitMQ port (default: 5672)
- DATABASE_URL: PostgreSQL connection URL
- API_SERVER_URL: API server URL for workers

## License
MIT