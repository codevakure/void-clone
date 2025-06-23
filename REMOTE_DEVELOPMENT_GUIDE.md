# Remote Development Components - Microsoft Services Removal Guide

## Overview

This document outlines the Microsoft proprietary service references found in Remote Development components and provides guidance for implementing open-source alternatives.

## Removed/Replaced Microsoft Service References

### 1. OAuth Authentication Redirect URIs

**Files affected:**
- `src/vs/base/common/oauth.ts`
- `src/vs/workbench/api/common/extHostAuthentication.ts`

**Microsoft services removed:**
- `https://vscode.dev/redirect` - Microsoft's OAuth redirect endpoint
- `https://insiders.vscode.dev/redirect` - Microsoft's OAuth redirect endpoint for insiders

**Replacement approach:**
The OAuth authentication system now uses configurable redirect URIs through the `product.json` configuration file, allowing users to set their own OAuth endpoints.

### 2. Codespaces Authority References

**Files affected:**
- `src/vs/platform/telemetry/common/telemetryUtils.ts`
- `src/vs/workbench/contrib/welcomeGettingStarted/common/gettingStartedContent.ts`

**Microsoft services removed:**
- `codespaces` authority in telemetry allowed authorities
- GitHub Codespaces-specific getting started content

**Replacement approach:**
Replaced with generic remote development guidance that works with any remote development setup.

### 3. GitHub.dev and vscode.dev References

**Files affected:**
- `src/vscode-dts/vscode.d.ts`
- Various test files and documentation

**Microsoft services removed:**
- References to `github.dev` web editor
- References to `vscode.dev` web editor

**Replacement approach:**
Updated API documentation and examples to use generic remote development patterns.

## Implementation Guide

### Setting Up OAuth Authentication

Instead of hardcoded Microsoft OAuth endpoints, configure your own:

1. **Configure OAuth Endpoints in product.json:**
```json
{
  "oauthRedirectUris": [
    "https://your-domain.com/oauth/redirect",
    "http://localhost:3000/oauth/callback"
  ],
  "oauthClientName": "Your Editor Name"
}
```

2. **Set up your OAuth server:**
- Use an open-source OAuth2 server like Keycloak, Auth0 (self-hosted), or Hydra
- Configure your redirect URIs to match your product.json settings
- Ensure your OAuth server supports PKCE for security

### Alternative Remote Development Solutions

#### 1. SSH Remote Development
- **Built-in support**: Native SSH tunneling (no Microsoft services)
- **Configuration**: Standard SSH config files
- **Authentication**: SSH keys, certificates, or password

#### 2. Container-based Development
- **Docker containers**: Local or remote container development
- **Podman**: Open-source container runtime alternative
- **Dev containers**: Use open dev container specifications

#### 3. Self-hosted Remote Servers
- **code-server**: Open-source VS Code server implementation
- **OpenVSCode Server**: Microsoft's open-source server (without proprietary components)
- **Gitpod**: Self-hosted or cloud development environments

#### 4. Tunnel Services
- **Cloudflare Tunnel**: Free tunneling service
- **ngrok**: Local tunnel service (free tier available)
- **Tailscale**: Mesh VPN for secure remote access
- **WireGuard**: Open-source VPN solution

### Configuration Examples

#### 1. SSH Remote Configuration
```json
{
  "remote.SSH.remotePlatform": {
    "hostname": "linux"
  },
  "remote.SSH.connectTimeout": 15,
  "remote.SSH.showLoginTerminal": true
}
```

#### 2. Container Development Configuration
```json
{
  "dev.containers.defaultExtensions": [
    "your-extension-publisher.your-extension"
  ],
  "dev.containers.forwardPorts": [3000, 8080],
  "dev.containers.portsAttributes": {
    "3000": {
      "label": "Application",
      "onAutoForward": "notify"
    }
  }
}
```

#### 3. Custom Tunnel Configuration
```json
{
  "tunnel.access": {
    "hostNameOverride": "your-tunnel-service.com",
    "preventSleep": true
  },
  "remote.tunnels.access": {
    "hostNameOverride": "your-tunnel-service.com"
  }
}
```

## Security Considerations

### 1. Authentication
- **Always use HTTPS** for OAuth redirects and API calls
- **Implement PKCE** (Proof Key for Code Exchange) for OAuth flows
- **Use strong encryption** for SSH keys and certificates
- **Regular key rotation** for long-running remote sessions

### 2. Network Security
- **VPN or private networks** for production environments
- **Firewall rules** to restrict access to remote development servers
- **Certificate pinning** for custom OAuth servers
- **Regular security audits** of remote development infrastructure

### 3. Data Protection
- **End-to-end encryption** for remote file transfers
- **Local data caching controls** to prevent sensitive data exposure
- **Session timeout policies** for idle remote connections
- **Audit logging** for remote development activities

## Troubleshooting Common Issues

### OAuth Authentication Failures
1. Verify redirect URIs match between client and server
2. Check CORS settings on OAuth server
3. Ensure client ID and secrets are correct
4. Validate OAuth server metadata endpoints

### Remote Connection Issues
1. Verify network connectivity and DNS resolution
2. Check SSH key permissions and agent forwarding
3. Validate container runtime and image availability
4. Test tunnel service connectivity and authentication

### Extension Compatibility
1. Ensure remote extensions are available on Open VSX
2. Check extension host compatibility with remote environments
3. Verify extension dependencies are met in remote environment
4. Test extension functionality in target remote platform

## Migration Checklist

- [ ] Configure custom OAuth endpoints in product.json
- [ ] Set up self-hosted OAuth2 server
- [ ] Update authentication flows to use custom endpoints
- [ ] Remove hardcoded Microsoft service references
- [ ] Test OAuth authentication with custom server
- [ ] Verify remote development features work without Microsoft services
- [ ] Update documentation with new configuration options
- [ ] Create user guides for alternative remote development setups
- [ ] Test extension compatibility in remote environments
- [ ] Validate security configurations and access controls

## Related Documentation

- [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749)
- [PKCE RFC](https://tools.ietf.org/html/rfc7636)
- [SSH Protocol Documentation](https://tools.ietf.org/html/rfc4251)
- [Dev Container Specification](https://containers.dev/)
- [Open VSX Registry](https://open-vsx.org/)

## Support

For issues related to remote development without Microsoft services:
1. Check this documentation for configuration guidance
2. Verify your OAuth server and remote development setup
3. Review network and security configurations
4. Test with minimal configurations to isolate issues
