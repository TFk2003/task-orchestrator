# Project Structure
task-orchestrator/
├── docker/
│ ├── docker-compose.yml # Main compose file
│ ├── api-server.Dockerfile # API server Dockerfile
│ └── worker.Dockerfile # Worker node Dockerfile
├── frontend/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── context/ # React context
│ │ ├── pages/ # Page components
│ │ └── services/ # API services
│ ├── package.json
│ ├── Dockerfile
│ └── nginx.conf
├── backend/ # API server
│ ├── src/main/java/
│ │ └── org/example/apiserver/
│ │ ├── config/ # Configuration
│ │ ├── controller/ # REST controllers
│ │ ├── dto/ # Data transfer objects
│ │ ├── model/ # Entity models
│ │ ├── repository/ # Data repositories
│ │ ├── service/ # Business logic
│ │ └── util/ # Utility classes
│ ├── pom.xml
│ └── application.yml
├── worker/ # Worker nodes
│ ├── src/main/java/
│ │ └── org/example/workernode/
│ │ ├── config/ # Configuration
│ │ ├── consumer/ # RabbitMQ consumers
│ │ ├── processor/ # Task processors
│ │ └── service/ # Services
│ ├── pom.xml
│ └── application.yml
├── .gitignore
├── README.md
├── LICENSE
└── docker-compose.yml

## Service Ports
- Frontend: 3000 (dev), 80 (prod)
- API Server: 8080
- PostgreSQL: 5432
- RabbitMQ: 5672 (AMQP), 15672 (Management UI)
- Worker Nodes: Dynamic