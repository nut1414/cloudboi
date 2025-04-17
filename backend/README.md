# cloudboi-backend

## Getting Started

Getting started by running `make init` then `make run`

## Proxy Configuration

In the Docker setup, the backend API is served through an Nginx proxy that combines frontend and backend services under a single domain. This solves cross-domain cookie issues and simplifies the development experience.

### How it Works

1. In Docker, the API is accessed via:
   - API: http://localhost/api/
   - API documentation: http://localhost/api/docs
   - OpenAPI schema: http://localhost/api/openapi.json

2. The proxy setup:
   - Automatically strips the `/api` prefix from requests before forwarding to the backend
   - Handles authentication cookies properly by maintaining the same domain for frontend and backend
   - Enables SameSite=strict cookie security since all requests come from the same origin

### Local Development

For local development, the API runs directly on:
- API: http://localhost:8000/
- API documentation: http://localhost:8000/docs
- OpenAPI schema: http://localhost:8000/openapi.json
