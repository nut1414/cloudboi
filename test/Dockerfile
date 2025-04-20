FROM python:3.12-slim

WORKDIR /app

# Install make, git and xvfb
RUN apt-get update && apt-get install -y make git xvfb

# Copy the test directory
COPY . .

RUN DOCKER=true make setup

# Run the tests using make
CMD ["bash", "-c", "make test-e2e"] 