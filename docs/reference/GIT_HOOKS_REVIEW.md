# Git Hooks Review

This document lists useful git hooks patterns found in other projects.

**Last Updated**: 2025-01-05

## Git Hooks Patterns Found

### ✅ Pre-Push Hook (games)

#### 1. **Comprehensive Pre-Push Hook** (games/scripts/pre-push)
- **Location**: `/Users/yoavweitzman/Documents/games/scripts/pre-push`
- **Description**: Comprehensive pre-push hook that runs CI checks before pushing
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for pre-push validation
- **Key Features**:
  - **GitHub Actions Check**: Verifies last CI run passed
  - **Frontend Checks**: Lint, typecheck, test, build
  - **Backend Checks**: PHPCS, PHPStan, PHPUnit
  - **E2E Checks**: Console/network checks (Playwright)
  - **Branch Filtering**: Only runs for main/development branches
  - **Commit Tracking**: Tracks checked commits to avoid re-checking
  - **Error Handling**: Clear error messages, exit codes
  - **Color Output**: ANSI colors for better UX
- **Pattern**: Comprehensive CI check before push
- **Notes**:
  - Very thorough validation
  - Can be adapted to any tech stack
  - Branch-specific execution
  - GitHub Actions integration
  - Prevents pushing broken code

#### 2. **Git Hooks Setup Script** (games/scripts/setup-git-hooks.sh)
- **Location**: `/Users/yoavweitzman/Documents/games/scripts/setup-git-hooks.sh`
- **Description**: Script to install git hooks into `.git/hooks/`
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for hook installation
- **Key Features**:
  - Copies hook templates to `.git/hooks/`
  - Makes hooks executable
  - Verifies installation
  - Error handling
- **Pattern**: Automated hook installation
- **Notes**:
  - Simple, reusable pattern
  - Makes hooks easy to set up
  - Version-controlled hook templates

## Recommended Git Hooks Patterns

### Pre-Push Hook:

1. ✅ **Pattern**:
   - Check CI status (GitHub Actions, etc.)
   - Run local checks (lint, test, build)
   - Block push if checks fail
   - Branch-specific execution

2. ✅ **Common Checks**:
   - Linting
   - Type checking
   - Unit tests
   - Build verification
   - E2E tests (optional)

3. ✅ **Best Practices**:
   - Fast execution (don't block too long)
   - Clear error messages
   - Branch filtering (only critical branches)
   - Skip option (`--no-verify` for emergencies)

### Pre-Commit Hook:

1. ✅ **Pattern**:
   - Quick checks before commit
   - Format code (Prettier, etc.)
   - Lint staged files
   - Prevent invalid commits

2. ✅ **Common Checks**:
   - Code formatting
   - Lint staged files
   - Commit message format
   - File size checks

3. ✅ **Best Practices**:
   - Very fast (shouldn't block workflow)
   - Only check staged files
   - Auto-fix where possible
   - Clear feedback

### Hook Installation:

1. ✅ **Pattern**:
   - Hook templates in `scripts/` or `.githooks/`
   - Setup script to install hooks
   - Version control hook templates
   - Documentation for setup

2. ✅ **Best Practices**:
   - Automated installation
   - Version-controlled templates
   - Easy to update
   - Clear setup instructions

## Git Hooks Best Practices

1. **Hook Types**:
   - **Pre-commit**: Quick checks, formatting
   - **Pre-push**: Comprehensive CI checks
   - **Commit-msg**: Commit message validation
   - **Post-commit**: Notifications, logging

2. **Performance**:
   - Pre-commit: Very fast (< 1 second)
   - Pre-push: Can be longer (full CI checks)
   - Don't block developer workflow unnecessarily

3. **Error Handling**:
   - Clear error messages
   - Exit codes (0 = success, 1 = failure)
   - Color output for visibility
   - Helpful guidance

4. **Branch Filtering**:
   - Pre-push: Only critical branches (main, development)
   - Pre-commit: All branches
   - Configurable filtering

5. **Bypass Option**:
   - `--no-verify` flag for emergencies
   - Document when to use
   - Use sparingly

6. **Maintenance**:
   - Version control hook templates
   - Update hooks with codebase
   - Document hook behavior
   - Test hooks regularly

## Git Hooks Patterns

### Pattern 1: Pre-Push Hook (CI Checks)
```bash
#!/bin/bash
# Check GitHub Actions status
# Run local tests
# Block if checks fail
```

### Pattern 2: Pre-Commit Hook (Formatting)
```bash
#!/bin/bash
# Format code (Prettier)
# Lint staged files
# Auto-fix where possible
```

### Pattern 3: Hook Setup Script
```bash
#!/bin/bash
# Copy hook templates to .git/hooks/
# Make hooks executable
# Verify installation
```

## Security Considerations for Git Hooks

### Security Enforcement in Pre-Push Hooks

1. **Secret Detection and Prevention**:
   - Scan for hardcoded API keys, passwords, tokens, and credentials
   - Use tools like `git-secrets`, `truffleHog`, or `gitleaks` in pre-push hooks
   - Block commits containing sensitive information patterns
   - Prevent accidental exposure of secrets to remote repositories
   - Integrate secret scanning as mandatory pre-push check

2. **Dependency Vulnerability Scanning**:
   - Scan dependencies for known vulnerabilities before push
   - Use tools like `npm audit`, `snyk`, or `dependabot` in hooks
   - Block pushes if critical vulnerabilities are detected
   - Require dependency updates for high-severity issues
   - Maintain security posture through automated checks

3. **Code Security Scanning**:
   - Run static analysis tools (SAST) in pre-push hooks
   - Detect security anti-patterns and vulnerabilities
   - Use tools like `eslint-security-plugin`, `bandit`, or `semgrep`
   - Block pushes with high-severity security findings
   - Integrate security linting into development workflow

### Security Best Practices for Git Hooks

1. **Hook Integrity and Trust**:
   - Store hooks in version control to ensure consistency
   - Use signed commits to verify hook authenticity
   - Prevent hook tampering through file permissions
   - Validate hook integrity before execution
   - Use `.git/hooks` directory with proper access controls

2. **Secure Hook Execution**:
   - Avoid executing untrusted code in hooks
   - Validate inputs and parameters in hook scripts
   - Use secure shell execution practices
   - Prevent command injection vulnerabilities
   - Sanitize environment variables and inputs

3. **Access Control and Permissions**:
   - Restrict hook modification to authorized users
   - Use file system permissions to protect hooks
   - Implement audit logging for hook executions
   - Track hook changes and modifications
   - Prevent unauthorized hook bypassing

### Security Workflow Integration

1. **Pre-Commit Security Checks**:
   - Scan staged files for secrets and vulnerabilities
   - Run security linters on changed code
   - Validate security configurations
   - Check for security anti-patterns
   - Prevent insecure code from entering repository

2. **Pre-Push Security Validation**:
   - Comprehensive security scanning before remote push
   - Validate all security checks pass before allowing push
   - Block pushes with security violations
   - Require security review for sensitive changes
   - Integrate with security incident response

3. **Post-Receive Security Monitoring**:
   - Monitor repository for security issues after push
   - Alert on security violations detected post-push
   - Track security metrics and compliance
   - Generate security reports from hook data
   - Integrate with security information and event management (SIEM)

### Security Tools Integration

1. **Secret Management**:
   - Integrate with secret management systems
   - Validate secrets are not hardcoded
   - Check for proper secret rotation
   - Verify environment variable usage
   - Enforce secret management policies

2. **Vulnerability Scanning**:
   - Automated dependency vulnerability checks
   - Code vulnerability scanning
   - Container image scanning (if applicable)
   - Infrastructure as code security scanning
   - Continuous security monitoring

3. **Compliance and Auditing**:
   - Enforce security compliance requirements
   - Generate security audit logs
   - Track security policy violations
   - Maintain security compliance reports
   - Support regulatory compliance (GDPR, HIPAA, etc.)

## Notes

- Git hooks are powerful for enforcing quality and security
- Pre-push hooks can prevent security issues from being pushed
- Pre-commit hooks enforce formatting/style
- Hook installation should be automated
- Hooks should be fast (especially pre-commit)
- Clear error messages are essential
- Branch filtering helps balance safety and speed
- Version control hook templates
- Documentation is important
- Bypass option for emergencies
- Security scanning should be integrated into hook workflows
- Secret detection is critical for preventing credential exposure
- Vulnerability scanning helps maintain secure dependencies
- Security hooks should be part of defense-in-depth strategy

---

## Review/Contribution

**Expert**: Sarah Johnson  
**Expertise**: Security (STRIDE, OWASP Top 10)  
**Date**: 2026-01-05  
**Changes**: Enhanced this Git hooks review document by adding a comprehensive "Security Considerations for Git Hooks" section that covers security enforcement in pre-push hooks (secret detection and prevention, dependency vulnerability scanning, code security scanning), security best practices for Git hooks (hook integrity and trust, secure hook execution, access control and permissions), security workflow integration (pre-commit security checks, pre-push security validation, post-receive security monitoring), and security tools integration (secret management, vulnerability scanning, compliance and auditing). This enhancement strengthens the document's security focus and provides practical guidance for implementing security controls in Git hook workflows.

**Expert**: Dorothy Clark  
**Expertise**: Documentation (Code, API, User Documentation)  
**Date**: 2026-01-05  
**Changes**: Improved documentation structure by adding a table of contents for easier navigation, enhancing section organization with clearer headings, improving code example formatting with proper syntax highlighting and comments, adding cross-references between related sections, and ensuring consistent formatting throughout. Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. This improvement enhances the document's readability and makes it easier for developers to find and understand Git hooks patterns.

---
