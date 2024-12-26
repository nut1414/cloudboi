# cloudboi

monorepo for cloudboi projects

# prerequisite

for windows, please run everything in WSL

- python>=3.12.0
- nodejs>=22
- pnpm `npm install --global pnpm`
- docker

for ubuntu wsl

```sh
sudo apt update
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt install python-is-python3 python3 python3.12-venv python3-pip python3-full

nvm install 23
nvm use 23

make dev
```

# contribution

please create a branch with feature as name then request a pull request review on that branch

# running project

```sh
make dev
```

# document for backend

fastapi should auto generate schema at localhost:8000/docs

# generating client for frontend

make sure the project is running and then execute this command in another terminal

```sh
make gen-client
```

or you can manually use pnpm in project folder

```sh
cd frontend
pnpm gen-client
```
