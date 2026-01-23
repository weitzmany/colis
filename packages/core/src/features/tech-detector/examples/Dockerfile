# Dockerfile for Tech Detector
#
# This Dockerfile creates a containerized environment for running tech-detect
# in CI/CD pipelines or as a standalone service.
#
# Usage:
#   docker build -t tech-detector .
#   docker run -v $(pwd):/workspace tech-detector

FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash

# Install @your-org/core globally
RUN npm install -g @your-org/core

# Create workspace directory
WORKDIR /workspace

# Set environment variables for CI
ENV CI=true \
    NODE_ENV=production

# Default command: run tech detection with standards checking
ENTRYPOINT ["tech-detect"]

# Default arguments (can be overridden)
CMD ["--check-standards", "--format", "json"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD tech-detect --version || exit 1

# Labels
LABEL maintainer="your-org" \
      description="Tech Detector - Automated technology stack detection and validation" \
      version="1.0.0"
