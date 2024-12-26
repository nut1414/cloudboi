db-up:
	docker-compose -f ./docker/db/docker-compose.yaml up -d
db-down:
	docker-compose -f ./docker/db/docker-compose.yaml down

dev-backend-install:
	sh ./backend/install.sh

dev-backend:
	sh ./backend/run.sh &

dev-frontend-install:
	cd frontend && pnpm install

dev-frontend:
	cd frontend && pnpm dev

dev: db-up dev-backend dev-frontend db-down

gen-client: dev-frontend-install
	cd frontend && pnpm gen-client




