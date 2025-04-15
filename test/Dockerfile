FROM python:3.12-slim

WORKDIR /app

ENV DOCKER=true

# Install make, git and xvfb
RUN apt-get update && apt-get install -y make git xvfb

# Copy the test directory
COPY . .

# Install dependencies using make
RUN make install

# Install Playwright browsers
RUN make install-browsers

# Run the tests using make
CMD ["bash", "-c", "make test-e2e"] 