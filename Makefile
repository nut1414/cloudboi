SHELL := /bin/bash

DC_DB = docker compose -f ./docker/db/docker-compose.yaml
DC_APP = docker compose -f ./docker/app/docker-compose.yaml

# DOCKER

docker-clean:
	docker system prune -a --volumes --force

docker-up: db-up backend-up frontend-up

docker-down: frontend-down backend-down db-down

db-up:
	${DC_DB} up -d

db-down:
	${DC_DB} down

db-build:
	${DC_DB} build --no-cache

backend-up:
	${DC_APP} up -d backend

backend-down:
	${DC_APP} down backend

backend-build:
	${DC_APP} build --no-cache backend

backend-debug:
	MODE=debug ${DC_APP} up backend

frontend-up:
	${DC_APP} up -d frontend

frontend-down:
	${DC_APP} down frontend

frontend-build:
	${DC_APP} build --no-cache frontend
	
db-rebuild: db-down db-build db-up
	@echo "Database rebuilt successfully"

backend-rebuild: backend-down backend-build backend-up
	@echo "Backend rebuilt successfully"

frontend-rebuild: frontend-down frontend-build frontend-up
	@echo "Frontend rebuilt successfully"

rebuild-all: db-rebuild backend-rebuild
	@echo "All containers rebuilt successfully"

# LOCAL

kill-backend:
	pkill -f "uvicorn src.core.main:app" || true

dev-backend-install:
	cd backend && sh ./install.sh

dev-backend:
	cd backend && sh ./run.sh &

dev-frontend-install:
	cd frontend && . ${HOME}/.nvm/nvm.sh && nvm install 23 && nvm use 23 && npm install -g pnpm && pnpm install

dev-frontend:
	cd frontend && . ${HOME}/.nvm/nvm.sh && nvm use 23 && pnpm dev

dev: db-up dev-backend dev-frontend db-down

install: dev-backend-install dev-frontend-install

gen-client: dev-frontend-install
	cd frontend && pnpm gen-client




