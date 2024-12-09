create-env:
	python -m venv .venv
activate-env:
	$(source .venv/bin/activate)
deactivate-env:
	deactivate

install: create-env activate-env
	pip install pip-tools
	pip install -r requirements.txt

sync: activate-env
	pip-compile --output-file=requirements.txt requirements.in --strip-extras
	pip-sync requirements.txt

init: install sync

run: activate-env
	uvicorn src.core.main:app --reload
