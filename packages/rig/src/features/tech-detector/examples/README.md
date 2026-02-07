# Tech Detector CI/CD Examples

This directory contains examples for integrating Tech Detector into your CI/CD pipelines and containerized environments.

## Contents

- **`github-actions-tech-check.yml`** - GitHub Actions workflow for automated tech stack validation
- **`Dockerfile`** - Docker image for containerized tech detection
- **`docker-compose.yml`** - Docker Compose configurations for various use cases

## Quick Start

### GitHub Actions Integration

1. Copy `github-actions-tech-check.yml` to `.github/workflows/tech-check.yml` in your repository
2. Create a `.core-tech-standards.json` file in your project root (optional, will use defaults)
3. Push to trigger the workflow

The workflow will:
- Detect your project's technology stack
- Validate against standards
- Generate a JSON report
- Comment on pull requests with validation results
- Fail the build if warnings are detected (on main branch)

### Docker Usage

#### Build the Image

```bash
docker build -t tech-detector .
```

#### Run Tech Detection

```bash
# Basic detection
docker run -v $(pwd):/workspace tech-detector

# With standards checking
docker run -v $(pwd):/workspace tech-detector --check-standards

# Generate report
docker run -v $(pwd):/workspace -v $(pwd)/reports:/workspace/reports tech-detector \
  --check-standards \
  --report reports/tech-stack-report.json \
  --format json
```

### Docker Compose Usage

```bash
# Local development (interactive)
docker-compose up tech-detect-local

# CI/CD (non-interactive, fail on warnings)
docker-compose up tech-detect-ci

# Multi-project validation
docker-compose up tech-detect-multi-project

# Standards validation only
docker-compose up tech-detect-validator
```

## CI/CD Features

### Exit Codes

Tech Detector uses standard exit codes for CI/CD integration:

- **0** - Success, no warnings
- **1** - Error (invalid path, detection failed, etc.)
- **2** - Warnings detected (when `--fail-on-warning` is used)

### CLI Flags for CI/CD

- `--check-standards` - Enable standards validation (default: true)
- `--fail-on-warning` - Exit with code 2 if warnings are detected
- `--skip-warnings` - Skip warning prompts (for CI environments)
- `--no-interactive` - Disable interactive prompts (automatic in CI)
- `--report <path>` - Generate JSON report for CI artifacts
- `--format json` - Output in JSON format for parsing

### Environment Detection

Tech Detector automatically detects CI/CD environments:

- GitHub Actions
- GitLab CI
- CircleCI
- Travis CI
- Jenkins
- Buildkite
- Drone
- Bitbucket Pipelines
- AWS CodeBuild
- Azure Pipelines
- TeamCity
- Generic CI (via `CI=true`)

When running in CI, interactive mode is automatically disabled.

### JSON Report Format

The `--report` flag generates a JSON report with the following structure:

```json
{
  "timestamp": "2026-01-23T10:30:00.000Z",
  "ci": {
    "detected": true,
    "provider": "GitHub Actions"
  },
  "techStack": {
    "framework": {
      "name": "Angular",
      "version": "17.0.0"
    },
    "languages": [
      {
        "name": "TypeScript",
        "version": "5.3.0",
        "primary": true
      }
    ],
    "buildTools": [
      {
        "name": "Webpack",
        "version": "5.89.0"
      }
    ],
    "packageManager": {
      "name": "npm",
      "version": "10.2.0"
    },
    "runtime": {
      "name": "Node.js",
      "version": "20.10.0"
    }
  },
  "warnings": {
    "count": 2,
    "items": [
      {
        "type": "outdated-version",
        "category": "framework",
        "detected": {
          "name": "Angular",
          "version": "16.0.0"
        },
        "minimumVersion": "17.0.0",
        "message": "Version 16.0.0 is below recommended minimum 17.0.0"
      }
    ]
  },
  "summary": {
    "hasWarnings": true,
    "nonRecommendedCount": 0,
    "outdatedVersionCount": 2
  }
}
```

## Best Practices

### 1. Standards Configuration

Create a `.core-tech-standards.json` file in your project root:

```json
{
  "frameworks": {
    "recommended": ["angular", "react", "nextjs"],
    "minimumVersions": {
      "angular": "17.0.0",
      "react": "18.0.0",
      "nextjs": "14.0.0"
    }
  },
  "languages": {
    "recommended": ["typescript", "javascript"],
    "minimumVersions": {
      "typescript": "5.0.0",
      "node": "18.0.0"
    }
  }
}
```

### 2. Branch-Specific Validation

Use different validation rules for different branches:

- **Feature branches**: Warnings only (no build failure)
- **Develop branch**: Fail on non-recommended tech, warn on outdated versions
- **Main/Production branch**: Strict validation, fail on any warnings

### 3. Pull Request Comments

Enable PR comments to provide visibility into tech stack changes:

```yaml
- name: Comment on PR with tech stack info
  if: github.event_name == 'pull_request'
  uses: actions/github-script@v7
  # ... (see github-actions-tech-check.yml for full example)
```

### 4. Artifact Storage

Store tech stack reports as CI artifacts for historical tracking:

```yaml
- name: Upload tech stack report
  uses: actions/upload-artifact@v4
  with:
    name: tech-stack-report
    path: tech-stack-report.json
    retention-days: 30
```

### 5. Multi-Project Validation

Use Docker Compose to validate multiple projects in a monorepo:

```bash
docker-compose up tech-detect-multi-project
```

## Troubleshooting

### Issue: "Interactive prompts in CI"

**Solution**: Tech Detector automatically disables interactive mode in CI environments. If you're still seeing prompts, ensure the `CI` environment variable is set to `true`.

### Issue: "Build failing on warnings"

**Solution**: Use `--skip-warnings` to skip warnings, or remove `--fail-on-warning` to allow warnings without failing the build.

### Issue: "Standards file not found"

**Solution**: Tech Detector uses default standards if no `.core-tech-standards.json` file is found. Create one in your project root to customize standards.

### Issue: "Docker volume permissions"

**Solution**: Ensure the workspace volume has correct permissions:

```bash
docker run -v $(pwd):/workspace -u $(id -u):$(id -g) tech-detector
```

## Additional Resources

- [Tech Detector Documentation](../README.md)
- [Standards Configuration Guide](../docs/standards-configuration.md)
- [CI/CD Integration Guide](../docs/ci-cd-integration.md)

## Support

For issues or questions, please open an issue in the repository.
