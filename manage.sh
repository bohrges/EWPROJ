#!/bin/bash

ACTION=$1

function rebuild() {
    echo "Rebuilding containers and images..."
    docker-compose down
    docker rmi -f ewproj_frontend ewproj_backend mongo:latest || true
    docker compose up -d --build
}

function start() {
    echo "Starting containers..."
    docker compose up -d --build
}

function remove() {
    echo "Stopping and removing containers, networks, and images..."
    docker compose down
    docker rmi -f ewproj_frontend ewproj_backend mongo:latest || true
}

function help() {
    echo "Usage: $0 {rebuild|start|remove}"
    echo "  rebuild: Stops, removes, rebuilds and starts the containers"
    echo "  start: Starts the containers"
    echo "  remove: Stops and removes the containers and images"
}

case "$ACTION" in
    rebuild)
        rebuild
        ;;
    start)
        start
        ;;
    remove)
        remove
        ;;
    *)
        help
        ;;
esac
