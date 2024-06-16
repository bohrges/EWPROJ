#!/bin/bash
docker-compose down
docker rmi -f ewproj_frontend ewproj_backend mongo:latest || true
docker-compose up -d --build