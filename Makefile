SHELL := /bin/bash

DC_DB = docker compose -f ./docker/db/docker-compose.yaml
DC_APP = docker compose -f ./docker/app/docker-compose.yaml
DC_TEST = docker compose -f ./docker/test/docker-compose.yaml

FORWARD_DOCKER_DISPLAY = -e DISPLAY=$${DISPLAY} -v /tmp/.X11-unix:/tmp/.X11-unix

# Define common test pattern to avoid repetition
define run_test
	${DC_TEST} run --rm $(2) test make $(1) || EXIT_CODE=$$?; \
	${MAKE} test-env-down; \
	exit $${EXIT_CODE:-0}
endef

# DOCKER

docker-clean:
	docker system prune -a --volumes --force

docker-up: db-up backend-up frontend-up proxy-up

docker-down: proxy-down frontend-down backend-down db-down

# Test environment setup
test-env-up:
	MODE=test ${MAKE} docker-up
	@echo "Test environment started"
	# Give backend time to fully start up
	sleep 5

test-env-down:
	${MAKE} docker-down
	@echo "Test environment stopped"

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

proxy-up:
	${DC_APP} up -d proxy

proxy-down:
	${DC_APP} down proxy

db-rebuild: db-down db-build db-up
	@echo "Database rebuilt successfully"

backend-rebuild: backend-down backend-build backend-up
	@echo "Backend rebuilt successfully"

frontend-rebuild: frontend-down frontend-build frontend-up
	@echo "Frontend rebuilt successfully"

proxy-rebuild: proxy-down proxy-up
	@echo "Proxy rebuilt successfully"

rebuild-all: db-rebuild backend-rebuild frontend-rebuild proxy-rebuild
	@echo "All containers rebuilt successfully"

# TESTING

test-build:
	${DC_TEST} build

test-e2e: test-env-up
	$(call run_test,test-e2e,)

test-e2e-report: test-env-up
	$(call run_test,test-e2e-report,)

test-file: test-env-up
	$(call run_test,test-file FILE=${FILE},)

test-marked: test-env-up
	$(call run_test,test-marked MARKER=${MARKER},)

# DEBUG TESTING

test-e2e-debug: test-env-up
	$(call run_test,test-e2e-debug,${FORWARD_DOCKER_DISPLAY})

test-file-debug: test-env-up
	$(call run_test,test-file-debug FILE=${FILE},${FORWARD_DOCKER_DISPLAY})

test-marked-debug: test-env-up
	$(call run_test,test-marked-debug MARKER=${MARKER},${FORWARD_DOCKER_DISPLAY})

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




