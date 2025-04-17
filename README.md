# Cloudboi

monorepo for cloudboi projects

# Prerequisite

for windows, please run everything in WSL

- python>=3.12.0
- nodejs>=22
- pnpm `npm install --global pnpm`
- docker

# For ubuntu wsl instruction

- install git
- Enable WSL Feature in Windows then reboot system
- Install Ubuntu from Microsoft Store, setup password by open Ubuntu

> ## BEFORE CONTINUING -> INSTALL DOCKER DESKTOP

https://www.docker.com/products/docker-desktop/

- clone the project
- open up terminal in `cloudboi` folder
- do `wsl` then do the following command

```sh
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
sudo chmod g+rwx "$HOME/.docker" -R

sudo apt update
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt install python-is-python3 python3 python3.12-venv python3-pip python3-full git make

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

nvm install 23
nvm use 23

npm install -g pnpm

make install
```

- then run `make dev` to start the project

# Architecture

## Service Structure

CloudBoi uses a multi-service architecture:

- **Frontend**: React application for user interface
- **Backend**: FastAPI server providing the API
- **Proxy**: Nginx proxy that unifies frontend and backend under a single domain
- **Database**: PostgreSQL database for data storage

The Nginx proxy serves as a unified entry point for both frontend and backend services, solving cross-domain cookie issues by making them appear as a single origin to browsers.

# Infrastructure Management

CloudBoi provides a CLI tool for managing MAAS and LXD infrastructure. The tool allows you to:
- Initialize and configure MAAS and LXD clusters
- Generate cloud-init configurations for new nodes
- Clear and reinitialize infrastructure components
- Manage infrastructure with optional force mode to skip confirmation prompts

For detailed instructions on using the infrastructure management tools, see the [Infrastructure README](infrastructure/README.md).

# Contribution

please create a branch with feature as name then request a pull request review on that branch

# Running project

1.  Initialize the database:
    ```sh
    make db-up
    ```
2. Run the project:

    - Locally:
        ```sh
        make dev
        ```
    - In Docker:
        ```sh
        make docker-up
        ```
3. Run specific services:
    - Locally:
        ```sh
        make dev-service_name # Replace service_name with the service you want to run Ex. make dev-frontend
        ```
    - In Docker:
        ```sh
        make service_name-up # Replace service_name with the service you want to run Ex. make frontend-up
        ```

## Accessing the Application

When running with Docker, the application is accessible at:
- **Frontend and Backend**: http://localhost (port 80)
  
The Nginx proxy automatically routes requests to the appropriate service:
- Frontend requests go to: http://localhost/
- Backend API requests go to: http://localhost/api/

When running locally:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

# Testing

The project uses Playwright for end-to-end (E2E) testing. We recommend running tests in Docker for the most consistent experience across environments.

## Running tests with Docker (Recommended)
```sh
# Make sure you're in the project root directory
# Build the test container
make test-build

# Run all E2E tests in the container
make test-e2e

# Generate HTML report
make test-e2e-report

# Run a specific test file
make test-file FILE=e2e/scenarios/test_example.py
```

## Running tests locally (Alternative)
For development purposes, you can also run tests locally:

```sh
# First, navigate to the test directory
cd test

# Set up the test environment
make setup

# Run all E2E tests locally
make test-e2e

# Run tests in visible browser mode
make test-e2e-headed
```

For more detailed information about the testing architecture, writing tests, and available test commands, see the [Testing README](test/README.md).

# Debugging

#### Frontend
- TBD

#### Backend
- run the following command(don't forget to open docker desktop first)
    ```sh
    make db-up backend-debug
    ```
- click on debug tab on vs code
<img src="images/vs_code_debug_tab.png" width="400"/>
- choose `Python Docker: Remote Debug` then click run
<img src="images/vs_code_debug_run.png" width="400"/>

# Document for backend

fastapi should auto generate schema at http://localhost/api/docs when running with Docker or http://localhost:8000/docs when running locally.

# Generating client for frontend

make sure the project is running and then execute this command in another terminal

```sh
make gen-client
```

or you can manually use pnpm in project folder

```sh
cd frontend
pnpm gen-client
```
