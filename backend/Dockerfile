# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install make and git
RUN apt-get update && apt-get install -y make git

# Copy the application
COPY . .

# Install dependencies using make (with Docker flag)
RUN make install

# Run the backend using make (with Docker flag)
CMD ["bash", "-c", "DOCKER=true make ${MODE}"]