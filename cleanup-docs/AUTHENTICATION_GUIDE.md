# Authentication Services - Microsoft Dependencies Removal Guide

## Overview

This document outlines the Microsoft proprietary authentication services that were removed from Void Editor and provides comprehensive guidance for implementing custom authentication solutions.

## Removed Microsoft Authentication Services

### Microsoft Authentication Extension

**What was removed:**
- Microsoft Authentication (MSAL) extension
- Azure Active Directory (AAD) authentication endpoints
- Microsoft account (MSA) authentication
- Microsoft OAuth redirect URLs (`https://vscode.dev/redirect`)
- Azure MSAL (Microsoft Authentication Library) services

**Files affected:**
- `extensions/microsoft-authentication/src/node/authProvider.ts`
- `extensions/microsoft-authentication/src/browser/authProvider.ts`
- `extensions/microsoft-authentication/src/browser/authServer.ts`
- `extensions/microsoft-authentication/src/node/authServer.ts`

**Current status:**
All Microsoft authentication providers have been replaced with placeholder implementations that throw errors and log warnings. This prevents any accidental connections to Microsoft authentication services.

### Microsoft Service URLs Replaced

**Files affected:**
- `src/vs/workbench/services/secrets/electron-sandbox/secretStorageService.ts`
- `src/vs/workbench/services/clipboard/browser/clipboardService.ts`
- `src/vs/workbench/contrib/workspaces/browser/workspaces.contribution.ts`
- `src/vs/platform/environment/node/argv.ts`
- `src/vs/workbench/contrib/themes/test/node/colorRegistry.releaseTest.ts`
- `src/vs/code/electron-main/app.ts`

**Microsoft URLs removed:**
- `https://go.microsoft.com/fwlink/?linkid=2239490` → `https://voideditor.com/docs/secret-storage`
- `https://go.microsoft.com/fwlink/?linkid=2151362` → `https://voideditor.com/docs/clipboard-access`
- `https://go.microsoft.com/fwlink/?linkid=2025315` → `https://voideditor.com/docs/workspaces`
- `https://vscode.download.prss.microsoft.com/` → Custom CDN placeholder
- `https://github.dev/microsoft/vscode-docs/` → `https://github.com/voideditor/void/`

## Custom Authentication Implementation

### 1. OAuth 2.0 / OpenID Connect Providers

#### Open Source Options

1. **Keycloak** - Enterprise-grade identity and access management
   - Website: https://www.keycloak.org/
   - Self-hosted, open source
   - Supports OAuth 2.0, OpenID Connect, SAML

2. **Auth0 Community Edition** - Developer authentication platform
   - Website: https://auth0.com/
   - Free tier available, self-hosted options
   - OAuth 2.0, OpenID Connect support

3. **Okta** - Identity and access management
   - Website: https://www.okta.com/
   - Developer edition available
   - Enterprise-grade security

4. **Authentik** - Open source identity provider
   - Website: https://authentik.io/
   - Fully open source and self-hosted
   - Modern web-based interface

#### Configuration Example

```typescript
// Custom OAuth provider configuration
export interface CustomOAuthConfig {
    clientId: string;
    clientSecret: string;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    redirectUri: string;
    scopes: string[];
    userInfoEndpoint?: string;
}

// Example Keycloak configuration
const keycloakConfig: CustomOAuthConfig = {
    clientId: 'void-editor',
    clientSecret: 'your-client-secret',
    authorizationEndpoint: 'https://your-keycloak.com/auth/realms/void/protocol/openid-connect/auth',
    tokenEndpoint: 'https://your-keycloak.com/auth/realms/void/protocol/openid-connect/token',
    redirectUri: 'http://localhost:3000/auth/callback',
    scopes: ['openid', 'profile', 'email'],
    userInfoEndpoint: 'https://your-keycloak.com/auth/realms/void/protocol/openid-connect/userinfo'
};
```

### 2. Custom Authentication Provider Implementation

```typescript
// Custom authentication provider template
export class CustomAuthProvider implements AuthenticationProvider {
    private _onDidChangeSessions = new EventEmitter<AuthenticationProviderAuthenticationSessionsChangeEvent>();
    onDidChangeSessions = this._onDidChangeSessions.event;

    constructor(
        private readonly config: CustomOAuthConfig,
        private readonly context: ExtensionContext
    ) {}

    async getSessions(scopes?: readonly string[]): Promise<AuthenticationSession[]> {
        // Retrieve stored sessions
        const storedSessions = await this.context.secrets.get('auth-sessions');
        if (!storedSessions) {
            return [];
        }
        
        const sessions = JSON.parse(storedSessions);
        
        // Filter by scopes if provided
        if (scopes) {
            return sessions.filter((session: any) => 
                scopes.every(scope => session.scopes.includes(scope))
            );
        }
        
        return sessions;
    }

    async createSession(scopes: readonly string[]): Promise<AuthenticationSession> {
        // Start OAuth flow
        const authUrl = this.buildAuthUrl(scopes);
        const authCode = await this.getAuthorizationCode(authUrl);
        const tokens = await this.exchangeCodeForTokens(authCode);
        const userInfo = await this.getUserInfo(tokens.access_token);
        
        const session: AuthenticationSession = {
            id: this.generateSessionId(),
            accessToken: tokens.access_token,
            account: {
                id: userInfo.sub,
                label: userInfo.name || userInfo.email
            },
            scopes: Array.from(scopes)
        };
        
        // Store session securely
        await this.storeSession(session);
        
        this._onDidChangeSessions.fire({
            added: [session],
            removed: [],
            changed: []
        });
        
        return session;
    }

    async removeSession(sessionId: string): Promise<void> {
        const sessions = await this.getSessions();
        const sessionToRemove = sessions.find(s => s.id === sessionId);
        
        if (sessionToRemove) {
            const updatedSessions = sessions.filter(s => s.id !== sessionId);
            await this.storeSessions(updatedSessions);
            
            this._onDidChangeSessions.fire({
                added: [],
                removed: [sessionToRemove],
                changed: []
            });
        }
    }

    private buildAuthUrl(scopes: readonly string[]): string {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            response_type: 'code',
            redirect_uri: this.config.redirectUri,
            scope: scopes.join(' '),
            state: this.generateState()
        });
        
        return `${this.config.authorizationEndpoint}?${params.toString()}`;
    }

    private async getAuthorizationCode(authUrl: string): Promise<string> {
        // Implementation depends on your environment
        // For desktop: open system browser and capture redirect
        // For web: use popup window or redirect flow
        throw new Error('Authorization code flow implementation required');
    }

    private async exchangeCodeForTokens(code: string): Promise<any> {
        const response = await fetch(this.config.tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams({
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: this.config.redirectUri
            })
        });
        
        if (!response.ok) {
            throw new Error(`Token exchange failed: ${response.statusText}`);
        }
        
        return response.json();
    }

    private async getUserInfo(accessToken: string): Promise<any> {
        if (!this.config.userInfoEndpoint) {
            return { sub: 'unknown', name: 'Unknown User' };
        }
        
        const response = await fetch(this.config.userInfoEndpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`User info request failed: ${response.statusText}`);
        }
        
        return response.json();
    }

    private generateSessionId(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    private generateState(): string {
        return Math.random().toString(36).substring(2);
    }

    private async storeSession(session: AuthenticationSession): Promise<void> {
        const sessions = await this.getSessions();
        sessions.push(session);
        await this.storeSessions(sessions);
    }

    private async storeSessions(sessions: AuthenticationSession[]): Promise<void> {
        await this.context.secrets.store('auth-sessions', JSON.stringify(sessions));
    }
}
```

### 3. Extension Integration

```typescript
// Extension activation
export async function activate(context: ExtensionContext) {
    // Configure your OAuth provider
    const authConfig: CustomOAuthConfig = {
        clientId: 'your-client-id',
        clientSecret: 'your-client-secret',
        authorizationEndpoint: 'https://your-auth-server.com/oauth/authorize',
        tokenEndpoint: 'https://your-auth-server.com/oauth/token',
        redirectUri: 'http://localhost:3000/callback',
        scopes: ['read', 'write'],
        userInfoEndpoint: 'https://your-auth-server.com/oauth/userinfo'
    };

    // Create and register the authentication provider
    const authProvider = new CustomAuthProvider(authConfig, context);
    
    const providerDisposable = authentication.registerAuthenticationProvider(
        'custom-auth', // Unique provider ID
        'Custom Authentication', // Display name
        authProvider
    );

    context.subscriptions.push(providerDisposable);
}
```

### 4. Security Best Practices

#### Token Management
```typescript
// Secure token storage
class SecureTokenStorage {
    constructor(private readonly secrets: SecretStorage) {}

    async storeToken(sessionId: string, token: string): Promise<void> {
        await this.secrets.store(`token-${sessionId}`, token);
    }

    async getToken(sessionId: string): Promise<string | undefined> {
        return this.secrets.get(`token-${sessionId}`);
    }

    async deleteToken(sessionId: string): Promise<void> {
        await this.secrets.delete(`token-${sessionId}`);
    }
}
```

#### PKCE Implementation
```typescript
// PKCE (Proof Key for Code Exchange) for enhanced security
class PKCEHelper {
    static generateCodeVerifier(): string {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return this.base64URLEncode(array);
    }

    static async generateCodeChallenge(verifier: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return this.base64URLEncode(new Uint8Array(digest));
    }

    private static base64URLEncode(array: Uint8Array): string {
        return btoa(String.fromCharCode(...array))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
}
```

### 5. Environment-Specific Implementations

#### Desktop/Electron Implementation
```typescript
class DesktopAuthFlow {
    async startAuthFlow(authUrl: string): Promise<string> {
        // Start local server to capture callback
        const server = await this.startCallbackServer();
        
        // Open system browser
        await shell.openExternal(authUrl);
        
        // Wait for callback
        const authCode = await this.waitForCallback(server);
        
        // Cleanup
        server.close();
        
        return authCode;
    }

    private async startCallbackServer(): Promise<any> {
        const express = require('express');
        const app = express();
        
        return new Promise((resolve) => {
            const server = app.listen(3000, () => {
                resolve(server);
            });
            
            app.get('/callback', (req: any, res: any) => {
                const code = req.query.code;
                res.send('Authentication successful! You can close this window.');
                this.resolveCallback(code);
            });
        });
    }

    private async waitForCallback(server: any): Promise<string> {
        return new Promise((resolve) => {
            this.resolveCallback = resolve;
        });
    }
}
```

#### Web/Browser Implementation
```typescript
class WebAuthFlow {
    async startAuthFlow(authUrl: string): Promise<string> {
        return new Promise((resolve, reject) => {
            // Open popup window
            const popup = window.open(
                authUrl,
                'auth',
                'width=500,height=600,scrollbars=yes,resizable=yes'
            );

            // Monitor popup for completion
            const checkClosed = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(checkClosed);
                    reject(new Error('Authentication cancelled'));
                }
            }, 1000);

            // Listen for message from popup
            const messageHandler = (event: MessageEvent) => {
                if (event.origin !== window.location.origin) {
                    return;
                }

                if (event.data.type === 'auth-callback') {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageHandler);
                    popup?.close();
                    
                    if (event.data.error) {
                        reject(new Error(event.data.error));
                    } else {
                        resolve(event.data.code);
                    }
                }
            };

            window.addEventListener('message', messageHandler);
        });
    }
}
```

## Migration from Microsoft Authentication

### 1. Assessment Checklist

- [ ] Identify current Microsoft authentication usage
- [ ] Determine required authentication scopes
- [ ] Choose replacement authentication provider
- [ ] Plan data migration strategy
- [ ] Test authentication flow thoroughly

### 2. Migration Steps

1. **Choose Authentication Provider**
   - Evaluate open source options (Keycloak, Authentik)
   - Consider hosted solutions (Auth0, Okta)
   - Assess integration complexity

2. **Setup Authentication Server**
   - Deploy chosen authentication provider
   - Configure OAuth 2.0 / OpenID Connect
   - Set up user management

3. **Implement Custom Provider**
   - Use provided templates and examples
   - Configure OAuth endpoints
   - Implement token management

4. **Test and Validate**
   - Test authentication flow
   - Verify token security
   - Test session management
   - Validate logout/cleanup

### 3. Deployment Considerations

#### High Availability
- Load balancer for authentication server
- Database replication for user data
- Session store redundancy
- Health monitoring and alerting

#### Security
- SSL/TLS encryption for all endpoints
- Regular security audits
- Token rotation policies
- Rate limiting and DDoS protection

## Legal Compliance

### Microsoft Dependencies Removed
- ✅ No Azure Active Directory connections
- ✅ No Microsoft account authentication
- ✅ No Microsoft OAuth endpoints
- ✅ No MSAL library dependencies

### Clean Implementation
- ✅ Open source authentication providers
- ✅ Standard OAuth 2.0 / OpenID Connect protocols
- ✅ Self-hosted authentication infrastructure
- ✅ Complete control over user authentication

## Support and Troubleshooting

### Common Issues

1. **Authentication Flow Failures**
   - Check OAuth configuration
   - Verify redirect URIs
   - Test network connectivity
   - Review server logs

2. **Token Management Issues**
   - Verify secure storage implementation
   - Check token expiration handling
   - Test refresh token flow
   - Validate token format

3. **Integration Problems**
   - Check provider registration
   - Verify event handling
   - Test session persistence
   - Review error handling

---

*This documentation ensures Void Editor has complete independence from Microsoft authentication services while providing comprehensive guidance for implementing secure, open-source authentication solutions.*
