#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

BUILD_FLAG="--build"
if [[ "${1:-}" == "--no-build" ]]; then
    BUILD_FLAG=""
fi

SEED_ENABLED=true
if [[ "${2:-}" == "--no-seed" ]]; then
    SEED_ENABLED=false
fi

echo "Starting UI + API + Postgres services with docker-compose (BUILD_FLAG=${BUILD_FLAG:-none})..."
docker-compose up ${BUILD_FLAG} --remove-orphans -d

echo "Waiting for services to start up..."
sleep 10

wait_for_postgres() {
    echo "Waiting for Postgres to be ready..."
    for i in {1..30}; do
        if docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
            echo "Postgres is ready!"
            return 0
        fi
        echo "Postgres not ready yet, waiting... (attempt $i/30)"
        sleep 2
    done
    echo "Postgres failed to start within 60 seconds"
    return 1
}

wait_for_api() {
    echo "Waiting for API service to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:4000/health >/dev/null 2>&1; then
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
    if docker-compose exec -T api-service npx prisma migrate reset --force; then
        echo "Database migrations completed successfully!"
    else
        echo "Database migrations failed!"
        return 1
    fi
}

run_seeding() {
    echo "Running database seeding..."
    if docker-compose exec -T api-service npm run prisma:seed; then
        echo "Database seeding completed successfully!"
    else
        echo "Database seeding failed!"
        return 1
    fi
}

if wait_for_postgres && wait_for_api; then
    run_migrations

    if [[ "$SEED_ENABLED" == true ]]; then
        run_seeding
    else
        echo "Skipping database seeding (disabled via flag)"
    fi

    echo "Setup completed successfully! You can access:"
    echo "- UI: http://localhost:3000"
    echo "- API: http://localhost:4000"
else
    echo "Failed to start services properly"
    exit 1
fi
