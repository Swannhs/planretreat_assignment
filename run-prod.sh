#!/bin/bash
set -e

echo "Starting production build and deployment..."

docker-compose -f docker-compose.prod.yml up --build -d

echo "Waiting for services to start..."
sleep 10

echo "Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T api-service npx prisma migrate deploy

echo "Running database seeding..."
docker-compose -f docker-compose.prod.yml exec -T api-service node dist/prisma/seed.js

echo "Production deployment completed successfully!"
echo "- UI: http://localhost:3000"
echo "- API: http://localhost:4000"
