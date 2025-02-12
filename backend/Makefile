.ONESHELL:
SHELL := /bin/bash
PYTHON := ./.venv/bin/python
PIP := ./.venv/bin/pip
PIP_COMPILE := ./.venv/bin/pip-compile
PIP_SYNC := ./.venv/bin/pip-sync

create-env:
	python -m venv .venv

deactivate-env:
	deactivate

install: create-env 
	$(PIP) install pip-tools
	$(PIP) install -r requirements.txt

sync:
	$(PIP_COMPILE) --output-file=requirements.txt requirements.in --strip-extras
	$(PIP_SYNC) requirements.txt

init: install sync

run:
	$(PYTHON) -m uvicorn src.core.main:app --reload