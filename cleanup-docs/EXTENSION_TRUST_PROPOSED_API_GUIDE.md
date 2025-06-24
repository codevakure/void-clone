# Extension Trust & Proposed API Configuration Guide

This guide explains how to configure extension trust settings and proposed API access in Zap Editor. These configurations control which extensions can use unstable APIs, access authentication services, handle protocol URLs, and bypass certain security restrictions.

## Overview

Extension trust and proposed API configurations in Zap are configured through the `product.json` file in the following sections:

- `extensionPublisherOrgs` - Trusted publisher organizations
- `trustedExtensionPublishers` - Individual trusted publishers
- `trustedExtensionUrlPublicKeys` - Public keys for URL verification
- `trustedExtensionAuthAccess` - Authentication access permissions
- `trustedExtensionProtocolHandlers` - Protocol handling permissions
- `extensionEnabledApiProposals` - Proposed API access whitelist

## Important Security Notes

⚠️ **Security Implications**: These configurations can bypass important security restrictions:
- Proposed APIs may be unstable and change without notice
- Trusted extensions get elevated privileges
- Improper configuration can expose users to security risks

🔒 **Principle of Least Privilege**: Only grant the minimum permissions necessary
- Avoid blanket trust for all extensions
- Regularly review and audit trusted extensions
- Test proposed API usage thoroughly

🌐 **Open VSX Compatibility**: Ensure trusted extensions are available on Open VSX Registry

## Current Configuration (Secure Defaults)

The current `product.json` has secure defaults with empty configurations:

```json
{
  "extensionPublisherOrgs": [],
  "trustedExtensionPublishers": [],
  "trustedExtensionUrlPublicKeys": {},
  "trustedExtensionAuthAccess": [],
  "trustedExtensionProtocolHandlers": [],
  "extensionEnabledApiProposals": {}
}
```

## Configuration Options

### 1. Publisher Organization Trust (`extensionPublisherOrgs`)

Define trusted publisher organizations that get special privileges:

```json
{
  "extensionPublisherOrgs": [
    "your-organization",
    "trusted-partner-org"
  ]
}
```

**Use Cases:**
- Enterprise environments with known safe publishers
- Open source organizations you trust
- Internal extension development teams

**Security Impact:**
- Extensions from these orgs bypass certain security checks
- Use with extreme caution in production environments

### 2. Trusted Extension Publishers (`trustedExtensionPublishers`)

Individual publisher accounts that are considered trusted:

```json
{
  "trustedExtensionPublishers": [
    "your-publisher-id",
    "well-known-publisher",
    "internal-dev-team"
  ]
}
```

**Benefits:**
- More granular control than organization-wide trust
- Allows trusting specific maintainers
- Useful for vetted community publishers

**Recommendations:**
- Regularly audit trusted publishers
- Remove publishers that are no longer active
- Consider publisher reputation and security track record

### 3. Extension URL Public Keys (`trustedExtensionUrlPublicKeys`)

Public keys for verifying extension URLs and downloads:

```json
{
  "trustedExtensionUrlPublicKeys": {
    "https://your-registry.example.com": [
      "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0B...\n-----END PUBLIC KEY-----"
    ],
    "https://trusted-cdn.example.com": [
      "public-key-fingerprint-1",
      "public-key-fingerprint-2"
    ]
  }
}
```

**Use Cases:**
- Self-hosted extension registries
- Internal CDNs for extension distribution
- Enhanced security for extension downloads

**Implementation:**
- Generate RSA/ECDSA key pairs for signing
- Distribute public keys through secure channels
- Implement signature verification in your registry

### 4. Authentication Access Control (`trustedExtensionAuthAccess`)

Control which extensions can access authentication providers:

#### Global Access Array:
```json
{
  "trustedExtensionAuthAccess": [
    "your-extension-id",
    "github.vscode-pull-request-github",
    "ms-vscode.azure-account"
  ]
}
```

#### Provider-Specific Access:
```json
{
  "trustedExtensionAuthAccess": {
    "github": [
      "github.vscode-pull-request-github",
      "your-git-extension"
    ],
    "microsoft": [
      "ms-vscode.azure-account"
    ],
    "google": [
      "your-gcp-extension"
    ]
  }
}
```

**Security Considerations:**
- Authentication access grants powerful capabilities
- Only trust extensions that actually need auth access
- Regularly review and audit auth access permissions
- Consider implementing additional consent flows

### 5. Protocol Handler Trust (`trustedExtensionProtocolHandlers`)

Extensions allowed to handle custom protocol URLs:

```json
{
  "trustedExtensionProtocolHandlers": [
    "your-protocol-extension",
    "git-clone-helper",
    "custom-url-handler"
  ]
}
```

**Common Use Cases:**
- Git repository cloning from web browsers
- Custom application protocols (e.g., `myapp://`)
- Deep linking into specific editor features
- Integration with external tools

**Security Impact:**
- Protocol handlers can execute code from external sources
- Potential for malicious URL exploitation
- Requires careful input validation in extensions

### 6. Proposed API Access (`extensionEnabledApiProposals`)

The most important configuration - controls which extensions can use proposed (unstable) APIs:

```json
{
  "extensionEnabledApiProposals": {
    "your-extension-id": [
      "terminalDataWriteEvent",
      "notebookControllerKind",
      "tokenInformation"
    ],
    "trusted-community-extension": [
      "fileSearchApi",
      "textSearchProvider"
    ],
    "internal-dev-extension": [
      "debugVisualization",
      "customEditorMove"
    ]
  }
}
```

## Available Proposed APIs

Here are some commonly used proposed APIs (note: these change frequently):

### Editor & Text APIs
- `textSearchProvider` - Custom text search implementations
- `fileSearchApi` - Custom file search implementations
- `inlineCompletionsAdditions` - Enhanced inline completions
- `tokenInformation` - Token semantic information

### Debugging & Diagnostics
- `debugVisualization` - Custom debug visualizers
- `diagnosticSource` - Custom diagnostic sources
- `terminalDataWriteEvent` - Terminal data monitoring

### Notebooks & Custom Editors
- `notebookControllerKind` - Notebook controller enhancements
- `customEditorMove` - Custom editor movement operations
- `notebookVariableProvider` - Variable inspection in notebooks

### Workspace & Files
- `workspaceTrust` - Workspace trust API access
- `fileSystemAccess` - Enhanced file system operations
- `workspaceSymbolProvider` - Custom workspace symbol providers

### Authentication & Security
- `authentication` - Authentication provider APIs
- `secrets` - Secure secret storage
- `tokenInformation` - Token management

## Implementation Examples

### 1. Development Environment Setup

```json
{
  "extensionPublisherOrgs": ["your-company"],
  "trustedExtensionPublishers": [
    "your-dev-team",
    "internal-tools"
  ],
  "trustedExtensionAuthAccess": {
    "github": ["your-company.internal-git-tools"],
    "internal-auth": ["your-company.sso-extension"]
  },
  "extensionEnabledApiProposals": {
    "your-company.development-tools": [
      "terminalDataWriteEvent",
      "debugVisualization",
      "workspaceSymbolProvider"
    ],
    "your-company.testing-framework": [
      "testObserver",
      "testRunProfile"
    ]
  }
}
```

### 2. Enterprise Deployment

```json
{
  "extensionPublisherOrgs": ["enterprise-approved"],
  "trustedExtensionPublishers": [
    "verified-enterprise-vendor",
    "internal-development"
  ],
  "trustedExtensionUrlPublicKeys": {
    "https://internal-registry.company.com": [
      "company-registry-signing-key"
    ]
  },
  "trustedExtensionAuthAccess": {
    "company-sso": [
      "company.sso-integration",
      "company.user-management"
    ]
  },
  "extensionEnabledApiProposals": {
    "company.enterprise-tools": [
      "authentication",
      "secrets",
      "workspaceTrust"
    ]
  }
}
```

### 3. Open Source Community Setup

```json
{
  "trustedExtensionPublishers": [
    "rust-lang",
    "golang",
    "python",
    "redhat"
  ],
  "trustedExtensionAuthAccess": [
    "github.vscode-pull-request-github",
    "ms-python.python",
    "rust-lang.rust-analyzer"
  ],
  "extensionEnabledApiProposals": {
    "rust-lang.rust-analyzer": [
      "textSearchProvider",
      "workspaceSymbolProvider"
    ],
    "ms-python.python": [
      "debugVisualization",
      "notebookControllerKind"
    ],
    "github.vscode-pull-request-github": [
      "authentication",
      "tokenInformation"
    ]
  }
}
```

## Best Practices

### 1. **Security First**
- Start with empty configurations (secure defaults)
- Add permissions only when needed
- Regularly audit and remove unused permissions
- Test thoroughly before production deployment

### 2. **Documentation**
- Document why each extension needs specific permissions
- Keep track of which APIs are being used
- Update documentation when APIs are finalized
- Share knowledge with your development team

### 3. **Monitoring**
- Monitor proposed API usage in logs
- Track which extensions are using which APIs
- Set up alerts for unauthorized API usage
- Regular security reviews

### 4. **Updates & Maintenance**
- Proposed APIs can change or be removed
- Extensions may need updates when APIs finalize
- Keep track of VS Code release notes
- Test extensions after Zap updates

## Migration from Microsoft Extensions

Many Microsoft extensions use proposed APIs. Here's how to handle migration:

### 1. **Identify Dependencies**
- Check which Microsoft extensions your users need
- Find Open VSX alternatives
- Document required proposed APIs

### 2. **Replace with Alternatives**
```json
{
  "extensionEnabledApiProposals": {
    // Instead of ms-python.python, use community alternatives
    "python-community.python-tools": [
      "debugVisualization",
      "notebookControllerKind"
    ],
    // Instead of ms-vscode.azure-account, use open alternatives
    "community.cloud-tools": [
      "authentication",
      "secrets"
    ]
  }
}
```

### 3. **Custom Implementation**
If no alternatives exist, you may need to:
- Develop custom extensions
- Fork existing open source extensions
- Implement required functionality without proposed APIs

## Troubleshooting

### Extensions Not Loading
1. Check extension IDs are correct
2. Verify extensions exist on Open VSX
3. Check proposed API spellings
4. Review console logs for API errors

### Proposed API Errors
1. Verify API names against VS Code source
2. Check if APIs have been finalized
3. Ensure extension package.json declares APIs
4. Test with `--enable-proposed-api` flag

### Authentication Issues
1. Verify auth provider configurations
2. Check trusted extension lists
3. Test authentication flows
4. Review consent mechanisms

### Protocol Handler Problems
1. Check extension registration
2. Verify URL schemes
3. Test protocol handling
4. Review security restrictions

## Testing & Validation

### 1. Development Testing
```bash
# Test with proposed API enabled
./zap --enable-proposed-api=your-extension-id

# Test without proposed API (production simulation)
./zap
```

### 2. Security Testing
- Test with malicious extensions
- Verify permission boundaries
- Check authentication flows
- Test protocol handler security

### 3. Integration Testing
- Test extension combinations
- Verify API interactions
- Check performance impact
- Test in various environments

## API Proposal Resources

### Finding Current Proposals
1. VS Code repository: `src/vscode-dts/vscode.proposed.*.d.ts`
2. API proposal issues: https://github.com/microsoft/vscode/issues?q=label%3Aapi-proposal
3. Extension development documentation
4. Community forums and discussions

### Staying Updated
1. Follow VS Code release notes
2. Subscribe to API proposal discussions
3. Join extension development communities
4. Monitor breaking changes

---

For more information about Zap Editor development, see:
- [VOID_CODEBASE_GUIDE.md](./VOID_CODEBASE_GUIDE.md)
- [PROPRIETARY_SERVICES_REMOVAL.md](./PROPRIETARY_SERVICES_REMOVAL.md)
- [EXTENSION_RECOMMENDATIONS_GUIDE.md](./EXTENSION_RECOMMENDATIONS_GUIDE.md)
