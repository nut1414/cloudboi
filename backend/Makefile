.ONESHELL:
SHELL := /bin/bash

UVICORN_PARAMS = --host 0.0.0.0 --port 8000 --reload --reload-dir /app/src

ifeq ($(DOCKER),true)
    PYTHON := python
    PIP := pip
    PIP_COMPILE := pip-compile
    PIP_SYNC := pip-sync
else
    PYTHON := ./.venv/bin/python
    PIP := ./.venv/bin/pip
    PIP_COMPILE := ./.venv/bin/pip-compile
    PIP_SYNC := ./.venv/bin/pip-sync
	UVICORN_PARAMS = --reload
endif

create-env:
ifeq ($(DOCKER),true)
	@echo "Skipping virtual environment creation in Docker"
else
	test -d .venv || python -m venv .venv
endif

install: create-env
	$(PIP) install pip-tools
	$(PIP) install -r requirements.txt

sync:
	$(PIP_COMPILE) --output-file=requirements.txt requirements.in --strip-extras
	$(PIP_SYNC) requirements.txt

init: install sync

dev:
	$(PYTHON) -m uvicorn src.core.main:app $(UVICORN_PARAMS)

test:
	$(MAKE) dev

debug:
	$(PYTHON) -m debugpy --listen 0.0.0.0:5678 --wait-for-client -m uvicorn src.core.main:app $(UVICORN_PARAMS)