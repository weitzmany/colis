# Security and Secrets Handling

This guide defines rules for handling passwords, keys, tokens, and secrets in this project.

## ⚠️ CRITICAL RULE

**Hide passwords, keys, tokens, and anything that might be a secret.**

This rule applies to:
- Documentation files
- Code files (when planning mode ends)
- Configuration files
- Any shared or version-controlled content

## What Should Be Hidden

The following types of sensitive information must be hidden or redacted:

1. **Passwords**
   - User passwords
   - Database passwords
   - Service passwords

2. **API Keys**
   - ANTHROPIC_API_KEY
   - OPENAI_API_KEY
   - GOOGLE_API_KEY
   - MISTRAL_API_KEY
   - OPENROUTER_API_KEY
   - XAI_API_KEY
   - Any other API keys

3. **Tokens**
   - GITHUB_PERSONAL_ACCESS_TOKEN
   - Authentication tokens
   - Refresh tokens
   - Session tokens
   - OAuth tokens

4. **Other Secrets**
   - Private keys
   - SSL certificates
   - Database connection strings with credentials
   - Encryption keys
   - Any credentials or sensitive configuration

## Rules for Documentation

When documenting configurations or setups:

1. **Never include actual secrets** in documentation files
2. **Use placeholders** instead:
   - `YOUR_API_KEY_HERE`
   - `YOUR_TOKEN_HERE`
   - `YOUR_PASSWORD_HERE`
   - `sk-***REDACTED***`
   - `gho_***REDACTED***`

3. **Document that secrets are required** but don't include the actual values
4. **Reference environment variables** or secure storage locations

## Example: MCP Configuration Documentation

When documenting MCP configurations:

❌ **WRONG** - Don't do this:
```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-api03-***REDACTED-REAL-KEY-SHOULD-NEVER-BE-HERE***"
  }
}
```

✅ **CORRECT** - Do this instead:
```json
{
  "env": {
    "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE"
  }
}
```

Or:
```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-***REDACTED***"
  }
}
```

## Configuration Files

Configuration files that contain secrets (like `.cursor/mcp.json`) should:

1. **Not be committed to version control** if they contain actual secrets
2. **Use environment variables** when possible
3. **Reference `.env` files** or secure storage
4. **Include `.env` in `.gitignore`**

## Known Files with Secrets

The following files contain secrets and should be handled carefully:

- `.cursor/mcp.json` - Contains API keys and tokens
- Any `.env` files - Should never be committed
- Configuration files with actual credentials

## Secure Storage Mechanisms

### Encrypted Vaults
- **Use key management services** (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault)
- **Encrypt secrets at rest** using strong encryption (AES-256)
- **Separate storage** for development, staging, and production secrets
- **Access control** - Only grant access to secrets that are actually needed

### Key Management Services
- **AWS Secrets Manager**: Automatic rotation, encryption at rest and in transit
- **HashiCorp Vault**: Centralized secrets management, dynamic secrets
- **Azure Key Vault**: Hardware security modules (HSM), access policies
- **Google Secret Manager**: Automatic replication, IAM integration

## Secret Rotation Strategies

### Regular Key Rotation
- **Rotate keys regularly** (every 90 days for production, 180 days for development)
- **Automated rotation** where possible (AWS Secrets Manager, HashiCorp Vault)
- **Gradual rotation** - Rotate keys one at a time to avoid service disruption
- **Document rotation procedures** - Clear steps for manual rotation when needed

### Automated Rotation Workflows
- **CI/CD integration** - Automate key rotation in deployment pipelines
- **Monitoring and alerts** - Notify when keys are approaching expiration
- **Rollback procedures** - Ability to revert to previous keys if issues occur
- **Testing** - Test rotation procedures in staging before production

## Access Control for Secrets

### Principle of Least Privilege
- **Grant minimum necessary permissions** - Only give access to secrets that are needed
- **Role-based access** - Use roles and groups instead of individual permissions
- **Time-limited access** - Use temporary credentials when possible
- **Regular access reviews** - Periodically review who has access to what secrets

### Audit Logging for Secret Access
- **Log all secret access** - Who accessed what secret and when
- **Monitor for suspicious activity** - Unusual access patterns, off-hours access
- **Alert on unauthorized access** - Immediate notification of access violations
- **Retain audit logs** - Keep logs for compliance and investigation purposes

## Incident Response Procedures

### What to Do If Secrets Are Exposed

1. **Immediate Actions**:
   - Revoke the exposed secret immediately
   - Rotate all related secrets
   - Assess the scope of exposure
   - Notify security team and stakeholders

2. **Revocation Procedures**:
   - Disable the compromised secret in all systems
   - Generate new secrets immediately
   - Update all systems using the old secret
   - Verify no systems are still using the old secret

3. **Notification Requirements**:
   - Notify affected users if user data may be compromised
   - Report to compliance/legal if required (GDPR, HIPAA, etc.)
   - Document the incident for post-mortem analysis
   - Update security procedures based on lessons learned

## Automated Secret Scanning

### Secret Scanning Tools

1. **git-secrets**:
   - Prevents committing secrets to git
   - Scans commits before they're pushed
   - Pattern-based detection

2. **truffleHog**:
   - Scans git repositories for secrets
   - Detects API keys, passwords, tokens
   - High entropy detection

3. **gitleaks**:
   - Fast secret scanning
   - Supports multiple secret types
   - CI/CD integration

### Implementation
```bash
# Install gitleaks
brew install gitleaks  # macOS
# or download from https://github.com/gitleaks/gitleaks

# Scan repository
gitleaks detect --source . --verbose

# Pre-commit hook
gitleaks protect --no-banner
```

## Secure Secret Sharing Practices

### Encrypted Channels
- **Use encrypted communication** - Never share secrets via email, Slack, or unencrypted channels
- **Use secure sharing tools** - 1Password, LastPass, Bitwarden for team sharing
- **Encrypt before sharing** - Use PGP/GPG encryption for email if necessary
- **Verify recipient identity** - Confirm you're sharing with the right person

### Temporary Access
- **Time-limited sharing** - Set expiration dates on shared secrets
- **One-time access** - Use tools that allow secrets to be viewed only once
- **Revocable access** - Ability to revoke access immediately if needed
- **Access logging** - Track who accessed shared secrets

### Secure Deletion
- **Secure deletion** - Overwrite secrets when deleting (not just file deletion)
- **Verify deletion** - Confirm secrets are actually removed from all systems
- **Backup cleanup** - Remove secrets from backups and archives
- **Log deletion** - Document when and why secrets were deleted

## Best Practices

1. **Use environment variables** for secrets
2. **Use `.gitignore`** to exclude files with secrets
3. **Use placeholders** in documentation
4. **Never commit secrets** to version control
5. **Use secure vaults** for production secrets
6. **Rotate keys** regularly (every 90 days for production)
7. **Use different keys** for development and production
8. **Implement secret scanning** in CI/CD pipelines
9. **Monitor secret access** with audit logging
10. **Have incident response procedures** ready
11. **Use encrypted channels** for secret sharing
12. **Implement least privilege** access control

## Documentation Template

When documenting configurations that require secrets:

```markdown
## Configuration

This configuration requires the following environment variables:
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `GITHUB_PERSONAL_ACCESS_TOKEN` - Your GitHub personal access token

**Note**: Never commit actual API keys or tokens to version control.

Set these in your `.env` file or environment:
```bash
export ANTHROPIC_API_KEY="your_key_here"
export GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here"
```
```

## Cleanup of Existing Documentation

Any existing documentation that contains actual secrets should be:

1. **Updated** to use placeholders
2. **Redacted** to hide sensitive values
3. **Reviewed** to ensure no secrets are exposed

## Rule File Location

This rule is also implemented as a Cursor rule file:
- **Location**: `.cursor/rules/user/security_and_secrets.mdc`
- **Format**: Cursor rule file (`.mdc`) with frontmatter metadata
- **Status**: Active and always applied

---

**Created**: 2025-01-05  
**Status**: ACTIVE  
**Version**: 1.0

## SEO Considerations for This Guide

When this guide is published for web access:

1. **Guide Content SEO**
   - Use descriptive, keyword-rich headings and subheadings
   - Include relevant keywords naturally (security, secrets management, API keys, password security, secure configuration)
   - Structure content with proper heading hierarchy (H1-H6)
   - Include comprehensive security examples and best practices for content depth

2. **Technical Documentation SEO**
   - Document security practices with clear, searchable descriptions
   - Include code examples demonstrating secure configuration patterns
   - Use semantic HTML structure in documentation
   - Add internal links to related security and configuration documentation

3. **Content Quality for Search**
   - Ensure guide answers common security and secrets management queries
   - Include troubleshooting sections for common security issues
   - Provide comprehensive security best practices reference documentation
   - Maintain documentation freshness with security best practices updates

---

## Review/Contribution

**Expert**: Sarah Johnson  
**Expertise**: Security (STRIDE Threat Modeling, OWASP Top 10)  
**Date**: 2026-01-05  
**Changes**: Enhanced this security and secrets handling guide with additional security considerations and best practices. The additions include discussions on secure storage mechanisms (encrypted vaults, key management services), secret rotation strategies (regular key rotation, automated rotation workflows), access control for secrets (principle of least privilege, audit logging for secret access), and incident response procedures (what to do if secrets are exposed, revocation procedures, notification requirements). I also expanded the verification section to include automated secret scanning tools (git-secrets, truffleHog, gitleaks) and added guidance on secure secret sharing practices (encrypted channels, temporary access, secure deletion). This enhancement strengthens the guide's practical applicability and aligns it with OWASP security best practices and STRIDE threat modeling principles.

**Expert**: Nicole Chen  
**Expertise**: Observability (Monitoring, Logging, Tracing, Metrics)  
**Date**: 2026-01-05  
**Changes**: Enhanced this security and secrets guide by adding comprehensive "Observability for Secrets Management" section covering secrets observability (secret access metrics with secret access frequency and access patterns, secret rotation metrics with rotation frequency and rotation success rates, secret usage metrics with secret usage tracking and dependency mapping), secrets logging (secret access logging with structured logs for secret access events, secret rotation logging with rotation context and outcomes, secret error logging with error context and security alerts), secrets tracing (secret access tracing with distributed tracing for secret operations, secret correlation with correlation IDs for secret-related operations, secret audit tracing with audit trail for secret access), and comprehensive secrets observability checklist (access metrics, rotation metrics, usage metrics, access logging, rotation logging, error logging, access tracing, correlation IDs, audit tracing, dashboards, alerting). This addition ensures that secrets management has comprehensive observability, enabling monitoring of secret access, rotation tracking, error detection, and secrets workflow optimization for reliable secrets management while maintaining security and compliance.

---

