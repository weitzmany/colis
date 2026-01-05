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

## Best Practices

1. **Use environment variables** for secrets
2. **Use `.gitignore`** to exclude files with secrets
3. **Use placeholders** in documentation
4. **Never commit secrets** to version control
5. **Use secure vaults** for production secrets
6. **Rotate keys** regularly
7. **Use different keys** for development and production

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

