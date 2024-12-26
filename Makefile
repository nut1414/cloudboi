SHELL := /bin/bash

db-up:
	docker compose -f ./docker/db/docker-compose.yaml up -d
db-down:
	docker compose -f ./docker/db/docker-compose.yaml down

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




