#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

BUILD_FLAG="--build"
if [[ "${1:-}" == "--no-build" ]]; then
    BUILD_FLAG=""
fi

SEED_FLAG="--seed"
if [[ "${2:-}" == "--no-seed" ]]; then
    SEED_FLAG=""
fi

echo "Starting UI + API + Postgres services with docker-compose (BUILD_FLAG=${BUILD_FLAG:-none})..."
docker-compose up ${BUILD_FLAG} --remove-orphans -d &

echo "Waiting for services to start up..."
sleep 10

wait_for_api() {
    echo "Waiting for API service to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:4000/api/venues >/dev/null 2>&1; then
            echo "API service is ready!"
            return 0
        fi
        echo "API service not ready yet, waiting... (attempt $i/30)"
        sleep 2
    done
    echo "API service failed to start within 60 seconds"
    return 1
}

run_migrations() {
    echo "Running database migrations (resetting database)..."
    docker-compose exec -T api-service npx prisma migrate reset --force
    if [ $? -eq 0 ]; then
        echo "Database migrations completed successfully!"
    else
        echo "Database migrations failed!"
        return 1
    fi
}

run_seeding() {
    echo "Running database seeding..."
    docker-compose exec -T api-service npm run prisma:seed
    if [ $? -eq 0 ]; then
        echo "Database seeding completed successfully!"
    else
        echo "Database seeding failed!"
        return 1
    fi
}

if wait_for_api; then
    run_migrations
    # Always run seeding after reset
    run_seeding
    
    echo "Setup completed successfully! You can access:"
    echo "- UI: http://localhost:3000"
    echo "- API: http://localhost:4000"
else
    echo "Failed to start services properly"
    exit 1
fi
