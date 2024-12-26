.ONESHELL:
SHELL := /bin/bash
PYTHON := ./.venv/bin/python
PIP := ./.venv/bin/pip


create-env:
	python -m venv .venv

deactivate-env:
	deactivate

install: create-env 
	$(PIP) install pip-tools
	$(PIP) install -r requirements.txt

sync: activate-env
	$(PYTHON) -m pip-compile --output-file=requirements.txt requirements.in --strip-extras
	$(PYTHON) -m pip-sync requirements.txt

init: install sync

run: 
	$(PYTHON) -m uvicorn src.core.main:app --reload
