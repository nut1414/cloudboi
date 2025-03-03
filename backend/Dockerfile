# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

ENV DOCKER=true

# Install make and git
RUN apt-get update && apt-get install -y make git

# Copy the application
COPY . .

# Install dependencies using make (with Docker flag)
RUN make install

# Run the backend using make (with Docker flag)
CMD ["bash", "-c", "make ${MODE}"]