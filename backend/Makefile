.ONESHELL:
SHELL := /bin/bash

# Don't use venv paths in Docker
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
endif

create-env:
	test -d .venv || python -m venv .venv

install:
ifeq ($(DOCKER),true)
	pip install -r requirements.txt
else
	$(MAKE) create-env
	$(PIP) install pip-tools
	$(PIP) install -r requirements.txt
endif

sync:
	$(PIP_COMPILE) --output-file=requirements.txt requirements.in --strip-extras
	$(PIP_SYNC) requirements.txt

init: install sync

run:
ifeq ($(DOCKER),true)
	$(PYTHON) -m uvicorn src.core.main:app --host 0.0.0.0 --port 8000 --reload --reload-dir /app/src
else
	$(PYTHON) -m uvicorn src.core.main:app --reload
endif