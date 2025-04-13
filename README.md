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
        make service_name-up # Replace service_name with the service you want to run Ex. make dev-frontend
        ```

# Testing

The project uses Playwright for end-to-end (E2E) testing. Tests can be run both locally and in Docker.

## Setting up the test environment
```sh
cd test
make setup
```

## Running tests locally
```sh
# First, navigate to the test directory
cd test

# Run all E2E tests locally
make test-e2e

# Generate HTML report
make test-e2e-report

# Run tests in visible browser mode
make test-e2e-headed
```

## Running tests with Docker
```sh
# Make sure you're in the project root directory (not in the test directory)
# Build the test container
make test-build

# Run all E2E tests in the container
make test-e2e
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

fastapi should auto generate schema at http://localhost:8000/docs

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
