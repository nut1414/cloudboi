.ONESHELL:
SHELL := /bin/bash

# Check for Docker environment
ifeq ($(DOCKER),true)
    PYTHON := python
    PIP := pip
    PIP_COMPILE := pip-compile
    PIP_SYNC := pip-sync
    PLAYWRIGHT := playwright
else
    VENV = ./.venv
    PYTHON = $(VENV)/bin/python
    PIP = $(VENV)/bin/pip
    PIP_COMPILE = $(VENV)/bin/pip-compile
    PIP_SYNC = $(VENV)/bin/pip-sync
    PLAYWRIGHT = $(VENV)/bin/playwright
endif

create-venv:
ifeq ($(DOCKER),true)
	@echo "Skipping virtual environment creation in Docker"
else
	test -d .venv || python -m venv .venv
endif

install: create-venv
	$(PIP) install -r requirements.txt
	$(PIP) install pip-tools

sync:
	$(PIP_COMPILE) --output-file=requirements.txt requirements.in --strip-extras
	$(PIP_SYNC) requirements.txt

# install-deps require sudo
install-browsers:
	$(PYTHON) -m playwright install chromium
	$(PYTHON) -m playwright install-deps chromium

setup: install install-browsers

# Run tests
test-e2e:
	@echo "Running E2E tests..."
	$(PYTHON) -m pytest e2e/scenarios -v

test-e2e-headed:
	@echo "Running E2E tests in headed browser..."
	$(PYTHON) -m pytest e2e/scenarios -v --headless=false

test-e2e-slow:
	@echo "Running E2E tests in slow motion..."
	$(PYTHON) -m pytest e2e/scenarios -v --headless=false --slow-mo=100

# Run tests with HTML report
test-e2e-report:
	$(PYTHON) -m pytest e2e/ -v --html=reports/e2e-report.html --self-contained-html

# Run specific test file
test-file:
	$(PYTHON) -m pytest $(FILE) -v

# Run specific test with a marker
test-marked:
	$(PYTHON) -m pytest -m $(MARKER) -v
