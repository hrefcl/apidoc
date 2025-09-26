# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

We take the security of apiDOC v4 seriously. If you discover a security vulnerability, please follow these steps:

### 1. **DO NOT** open a public issue

Security vulnerabilities should be reported privately to allow us to address them before public disclosure.

### 2. Report via GitHub Security Advisories

1. Go to https://github.com/hrefcl/apidoc/security/advisories
2. Click "New draft security advisory"
3. Fill in the details of the vulnerability
4. We will respond within 48 hours

### 3. Alternative Contact

If you cannot use GitHub Security Advisories, please send an email to:
- **Security Team**: security@apidoc.app
- **Subject**: `[SECURITY] apiDOC v4 Vulnerability Report`

### 4. What to Include

Please include as much of the following information as possible:

- **Type of vulnerability** (XSS, injection, authentication bypass, etc.)
- **Steps to reproduce** the vulnerability
- **Affected versions** of apiDOC
- **Potential impact** of the vulnerability
- **Any proposed fixes** or mitigations you've identified

## Security Response Process

1. **Acknowledgment**: We'll acknowledge receipt within 48 hours
2. **Investigation**: We'll investigate and validate the reported vulnerability
3. **Fix Development**: We'll develop and test a fix
4. **Release**: We'll release a security update
5. **Disclosure**: We'll coordinate responsible disclosure

## Security Best Practices

When using apiDOC v4:

### Authentication
- Use strong passwords for remote authentication
- Regularly rotate authentication credentials
- Use HTTPS in production environments

### File Security
- Validate input files and templates
- Use proper file permissions
- Avoid exposing sensitive paths in documentation

### Configuration
- Review authentication settings regularly
- Use environment variables for sensitive configuration
- Enable appropriate access controls

### Dependencies
- Keep apiDOC updated to the latest version
- Regularly audit npm dependencies with `npm audit`
- Monitor security advisories

## Security Features

apiDOC v4 includes several security enhancements:

- **Dual Authentication System**: Local and remote authentication options
- **Input Validation**: Comprehensive validation of API documentation inputs
- **Secure Template Processing**: Protected template rendering
- **HTTPS Support**: Built-in HTTPS server capability
- **Access Control**: Configurable access restrictions

## Vulnerability Disclosure Timeline

We aim to:
- **Acknowledge** reports within 48 hours
- **Provide initial assessment** within 1 week
- **Release fixes** for critical vulnerabilities within 2 weeks
- **Release fixes** for other vulnerabilities within 1 month

## Security Hall of Fame

We recognize and thank security researchers who help make apiDOC safer:

<!-- Future security researchers will be listed here -->

---

**Remember**: Security is a shared responsibility. Please help us keep the apiDOC community safe by reporting vulnerabilities responsibly.