# Debug Adapters & Server Configuration Guide

This guide explains how to configure custom debug adapters and server connections in Zap Editor. Debug adapters provide debugging capabilities for different programming languages, while server configurations enable remote development and collaborative features.

## Overview

Debug adapters and server configurations in Void are configured through:

- `debugAdapterConfiguration` - Custom debug adapter settings and overrides
- `serverConfiguration` - Remote server and collaborative development settings
- Extension-based debug adapters (recommended approach)
- Custom debug protocol implementations

## Important Notes

⚠️ **Microsoft Proprietary Dependencies Removed**: Void Editor has removed dependencies on:
- Microsoft's C# DevKit debug adapters
- .NET Core proprietary debugging components
- VS Code Server license handshake logic
- Microsoft-specific native debug modules

🔓 **Open Source Alternatives**: Use community-maintained and open-source debug adapters:
- **C#/.NET**: OmniSharp-based debuggers
- **Node.js**: Built-in Node.js debug adapters
- **Python**: Python extension debug adapters
- **Java**: Language Server Protocol based debuggers

🌐 **Open VSX Compatibility**: Ensure debug adapter extensions are available on Open VSX Registry

## Current Configuration (Open Source Defaults)

The current `product.json` has empty configurations ready for customization:

```json
{
  "debugAdapterConfiguration": {},
  "serverConfiguration": {}
}
```

## Debug Adapter Configuration

### 1. Extension-Based Debug Adapters (Recommended)

The preferred approach is to use debug adapters provided by extensions:

```json
{
  "debugAdapterConfiguration": {
    "preferExtensionDebugAdapters": true,
    "fallbackToBuiltIn": false,
    "extensionDebugAdapters": {
      "node": {
        "extensionId": "ms-vscode.node-debug2",
        "adapterType": "executable"
      },
      "python": {
        "extensionId": "ms-python.python",
        "adapterType": "server"
      },
      "csharp": {
        "extensionId": "omnisharp.csharp",
        "adapterType": "executable"
      }
    }
  }
}
```

### 2. Custom Debug Adapter Executables

Configure custom debug adapter executables:

```json
{
  "debugAdapterConfiguration": {
    "customAdapters": {
      "mylang-debug": {
        "type": "executable",
        "command": "/path/to/mylang-debug-adapter",
        "args": ["--stdio"],
        "options": {
          "env": {
            "DEBUG_MODE": "true"
          }
        }
      },
      "remote-debug": {
        "type": "server",
        "host": "localhost",
        "port": 4711,
        "timeout": 10000
      }
    }
  }
}
```

### 3. Debug Adapter Protocol Configuration

Configure DAP (Debug Adapter Protocol) settings:

```json
{
  "debugAdapterConfiguration": {
    "protocolSettings": {
      "timeout": 30000,
      "retryCount": 3,
      "logLevel": "warn",
      "enableSourceMaps": true
    },
    "adapterFilters": {
      "node": {
        "skipFiles": ["<node_internals>/**"],
        "smartStep": true
      },
      "python": {
        "justMyCode": true,
        "enableSubProcess": false
      }
    }
  }
}
```

## Server Configuration

### 1. Remote Development Server

Configure remote development capabilities:

```json
{
  "serverConfiguration": {
    "remoteServer": {
      "enabled": true,
      "defaultPort": 8000,
      "authenticationRequired": true,
      "sslConfiguration": {
        "enabled": false,
        "certPath": "",
        "keyPath": ""
      },
      "allowedOrigins": [
        "https://your-domain.example.com"
      ]
    }
  }
}
```

### 2. Collaborative Development

Configure real-time collaboration features:

```json
{
  "serverConfiguration": {
    "collaboration": {
      "enabled": false,
      "provider": "custom",
      "serverUrl": "wss://your-collaboration-server.example.com",
      "maxParticipants": 10,
      "sessionTimeout": 3600000,
      "features": {
        "sharedEditing": true,
        "sharedTerminal": false,
        "voiceChat": false
      }
    }
  }
}
```

### 3. Language Server Protocol (LSP) Configuration

Configure custom language servers:

```json
{
  "serverConfiguration": {
    "languageServers": {
      "mylang": {
        "command": "/path/to/mylang-lsp-server",
        "args": ["--stdio"],
        "filetypes": ["mylang", "ml"],
        "rootPatterns": ["mylang.config.json", ".mylang"],
        "settings": {
          "mylang.completion.enabled": true,
          "mylang.diagnostics.level": "error"
        }
      }
    }
  }
}
```

## Implementation Examples

### 1. Open Source C# Development Setup

Replace Microsoft's proprietary C# debugger with open source alternatives:

```json
{
  "debugAdapterConfiguration": {
    "extensionDebugAdapters": {
      "csharp": {
        "extensionId": "omnisharp.csharp",
        "adapterType": "executable",
        "configuration": {
          "useOmniSharp": true,
          "enableNetCoreDebugging": true,
          "enableMonoDebugging": false
        }
      }
    },
    "customAdapters": {
      "netcore": {
        "type": "executable",
        "command": "dotnet",
        "args": ["exec", "/path/to/netcoredbg.dll"],
        "options": {
          "env": {
            "DOTNET_ROOT": "/usr/share/dotnet"
          }
        }
      }
    }
  }
}
```

### 2. Self-Hosted Development Environment

```json
{
  "serverConfiguration": {
    "remoteServer": {
      "enabled": true,
      "defaultPort": 8080,
      "authenticationRequired": true,
      "sslConfiguration": {
        "enabled": true,
        "certPath": "/etc/ssl/certs/void-server.crt",
        "keyPath": "/etc/ssl/private/void-server.key"
      }
    },
    "languageServers": {
      "typescript": {
        "command": "typescript-language-server",
        "args": ["--stdio"],
        "filetypes": ["typescript", "javascript"]
      },
      "python": {
        "command": "pylsp",
        "args": [],
        "filetypes": ["python"]
      }
    }
  }
}
```

### 3. Enterprise Development Setup

```json
{
  "debugAdapterConfiguration": {
    "protocolSettings": {
      "timeout": 60000,
      "logLevel": "info",
      "auditLogging": true,
      "logPath": "/var/log/void-debug"
    },
    "security": {
      "allowRemoteDebugging": false,
      "trustedDebuggers": [
        "/usr/local/bin/approved-debugger"
      ]
    }
  },
  "serverConfiguration": {
    "remoteServer": {
      "enabled": true,
      "authenticationRequired": true,
      "authenticationProvider": "ldap",
      "ldapConfiguration": {
        "server": "ldap://enterprise.company.com",
        "baseDN": "dc=company,dc=com"
      }
    }
  }
}
```

## Open Source Debug Adapter Alternatives

### Language-Specific Options

#### C# / .NET
- **OmniSharp**: Community-maintained C# language server
  - Extension ID: `ms-dotnettools.csharp` (if available on Open VSX)
  - Alternative: `omnisharp.csharp`
  - GitHub: https://github.com/OmniSharp/omnisharp-vscode

- **netcoredbg**: Open source .NET Core debugger
  - GitHub: https://github.com/Samsung/netcoredbg
  - Cross-platform debugging support

#### Python
- **Python Extension**: Community Python debugging
  - Extension ID: `ms-python.python` (if available on Open VSX)
  - Uses open source debugging protocols

#### Node.js
- **Built-in Node Debugger**: Open source Node.js debugging
  - No additional extensions required
  - Uses V8 Inspector Protocol

#### Java
- **Language Support for Java**: Open source Java debugging
  - Extension ID: `redhat.java`
  - Powered by Eclipse JDT Language Server

#### Go
- **Go Extension**: Community Go debugging
  - Extension ID: `golang.go`
  - Uses Delve debugger

#### Rust
- **Rust Analyzer**: Community Rust debugging
  - Extension ID: `rust-lang.rust-analyzer`
  - LLDB/GDB integration

### Universal Debug Adapters
- **LLDB**: For native code debugging
- **GDB**: For native code debugging
- **CodeLLDB**: VS Code extension for LLDB

## Custom Debug Adapter Development

### 1. Debug Adapter Protocol Implementation

Create a custom debug adapter following the DAP specification:

```typescript
// Example debug adapter structure
class MyLanguageDebugAdapter {
    constructor(private session: DebugSession) {}
    
    public async initializeRequest(response: DebugProtocol.InitializeResponse): Promise<void> {
        // Initialize debug adapter capabilities
        response.body = {
            supportsConfigurationDoneRequest: true,
            supportsEvaluateForHovers: true,
            supportsStepBack: false
        };
    }
    
    public async launchRequest(response: DebugProtocol.LaunchResponse, args: any): Promise<void> {
        // Start debugging session
    }
    
    public async setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): Promise<void> {
        // Set breakpoints
    }
}
```

### 2. Extension Integration

Package your debug adapter as a VS Code extension:

```json
{
  "contributes": {
    "debuggers": [
      {
        "type": "mylang",
        "label": "My Language Debugger",
        "program": "./out/debugAdapter.js",
        "runtime": "node",
        "configurationAttributes": {
          "launch": {
            "required": ["program"],
            "properties": {
              "program": {
                "type": "string",
                "description": "Path to the program to debug"
              }
            }
          }
        }
      }
    ]
  }
}
```

## Security Considerations

### 1. Debug Adapter Security
- Validate all input from debug sessions
- Restrict file system access
- Implement proper authentication for remote debugging
- Audit debug session logs

### 2. Server Configuration Security
- Use HTTPS/WSS for remote connections
- Implement proper authentication and authorization
- Regularly update server certificates
- Monitor and log server access

### 3. Extension Security
- Only install debug adapter extensions from trusted sources
- Review extension permissions and capabilities
- Keep extensions updated
- Monitor extension activity

## Testing & Validation

### 1. Debug Adapter Testing
```bash
# Test debug adapter functionality
./void --extensionDevelopmentPath=./my-debug-extension
```

### 2. Server Configuration Testing
```bash
# Test remote server functionality
./void --remote=my-server:8080
```

### 3. Protocol Validation
- Test Debug Adapter Protocol compliance
- Validate Language Server Protocol implementation
- Check remote connection stability
- Test authentication flows

## Troubleshooting

### Debug Adapter Issues
1. **Adapter Not Found**
   - Check extension installation
   - Verify adapter executable path
   - Review extension manifest

2. **Connection Failures**
   - Check network connectivity
   - Verify port configurations
   - Review firewall settings

3. **Protocol Errors**
   - Check DAP compliance
   - Validate message formats
   - Review protocol logs

### Server Configuration Issues
1. **Authentication Failures**
   - Verify authentication provider settings
   - Check user credentials
   - Review authentication logs

2. **SSL/TLS Issues**
   - Validate certificate chain
   - Check certificate expiration
   - Review SSL configuration

3. **Performance Issues**
   - Monitor server resources
   - Check network latency
   - Review connection limits

## Migration from Microsoft Services

### Replacing Microsoft C# DevKit
1. **Install OmniSharp Extension**: Use community C# support
2. **Configure netcoredbg**: Set up open source .NET debugger
3. **Update Launch Configurations**: Modify debug configurations
4. **Test Functionality**: Verify debugging works correctly

### Replacing VS Code Server
1. **Use Open Source Alternatives**: code-server, Gitpod, etc.
2. **Custom Server Implementation**: Build your own remote server
3. **Container-Based Development**: Use dev containers
4. **Local Development**: Focus on local development workflows

---

For more information about Void Editor development, see:
- [VOID_CODEBASE_GUIDE.md](./VOID_CODEBASE_GUIDE.md)
- [PROPRIETARY_SERVICES_REMOVAL.md](./PROPRIETARY_SERVICES_REMOVAL.md)
- [EXTENSION_TRUST_PROPOSED_API_GUIDE.md](./EXTENSION_TRUST_PROPOSED_API_GUIDE.md)
- [EXTENSION_RECOMMENDATIONS_GUIDE.md](./EXTENSION_RECOMMENDATIONS_GUIDE.md)
