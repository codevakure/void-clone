# Zap Package Integration Guide

This document outlines how to safely integrate the `codevakure/zap` packages into VS Code's Zap functionality without interfering with existing browser packages or core VS Code operations.

## Overview

The `codevakure/zap` ecosystem provides powerful tools for API testing, request parsing, and collection management. This guide explains how to leverage these packages within VS Code's architecture while maintaining clean separation from browser-specific code.

## Available Zap Packages

Based on the analysis of the codevakure/zap repository, the following packages are available for integration:

### Core Packages
- **`zap-common`** - Shared utilities and types
- **`zap-schema`** - Schema definitions and validation
- **`zap-converters`** - Format conversion utilities (Postman, OpenAPI, etc.)
- **`zap-requests`** - HTTP request execution engine
- **`zap-query`** - Query language for collections and requests

### Supporting Packages
- **`zap-collections`** - Collection management and organization
- **`zap-auth`** - Authentication handling
- **`zap-testing`** - Test execution and validation

## Integration Architecture

### Safe Integration Approach

To avoid conflicts with browser packages and maintain VS Code's architecture, we recommend the following integration strategy:

#### 1. Node.js-Only Integration
```
VS Code Main Process (Node.js)
├── Zap Service Layer
│   ├── zap-requests (HTTP execution)
│   ├── zap-converters (Import/Export)
│   ├── zap-collections (Management)
│   └── zap-schema (Validation)
└── Browser Process Communication
    └── Message passing to React UI
```

#### 2. Package Isolation
- **Main Process**: Use full zap packages for heavy operations
- **Renderer Process**: Use lightweight interfaces and types only
- **Web Workers**: Handle parsing and conversion tasks
- **IPC Communication**: Pass results between processes

## Implementation Strategies

### 1. Service-Based Architecture

Create dedicated services in the main process:

```typescript
// In main process only
interface ZapRequestService {
  executeRequest(request: ZapRequest): Promise<ZapResponse>;
  importCollection(format: 'postman' | 'openapi', data: string): Promise<ZapCollection>;
  convertRequest(from: ZapRequest, to: 'curl' | 'postman'): Promise<string>;
}
```

### 2. CLI Integration

Leverage zap packages for command-line operations:

```bash
# CLI commands that could use zap packages internally
code --zap-import ./collection.json
code --zap-execute ./request.zap
code --zap-convert --from postman --to openapi ./input.json
```

### 3. Extension Integration

Create separate extension modules that use zap packages:

```
extensions/zap-integration/
├── package.json (with zap dependencies)
├── src/
│   ├── main.ts (Node.js context)
│   ├── webview.ts (Browser context - UI only)
│   └── services/
│       ├── requestService.ts
│       ├── collectionService.ts
│       └── converterService.ts
```

## Browser Package Safety

### Avoiding Conflicts

1. **Separate Bundle Targets**
   - Main process bundles: Include full zap packages
   - Renderer bundles: Exclude Node.js-specific zap packages
   - Use Webpack externals to prevent bundling conflicts

2. **Type-Only Imports**
   ```typescript
   // Safe for browser
   import type { ZapRequest, ZapResponse } from 'zap-schema';

   // Avoid in browser
   import { executeRequest } from 'zap-requests'; // Node.js only
   ```

3. **Conditional Loading**
   ```typescript
   // Use dynamic imports with environment checks
   if (typeof window === 'undefined') {
     const { ZapRequestExecutor } = await import('zap-requests');
     // Use executor in Node.js context only
   }
   ```

## Recommended Integration Points

### 1. Request Execution
- **Location**: Main process service
- **Packages**: `zap-requests`, `zap-auth`
- **Purpose**: Execute HTTP requests without CORS limitations
- **Communication**: IPC to send results to UI

### 2. Collection Management
- **Location**: Main process + file system
- **Packages**: `zap-collections`, `zap-schema`
- **Purpose**: Persist and organize API collections
- **Storage**: VS Code workspace settings or dedicated files

### 3. Format Conversion
- **Location**: Web worker or main process
- **Packages**: `zap-converters`, `zap-schema`
- **Purpose**: Import/export Postman, OpenAPI, etc.
- **Benefits**: Background processing without blocking UI

### 4. Query and Search
- **Location**: Main process with caching
- **Packages**: `zap-query`, `zap-collections`
- **Purpose**: Fast search across collections
- **UI Integration**: Search results passed to React components

## Implementation Phases

### Phase 1: Basic Request Execution
1. Create request service in main process
2. Integrate `zap-requests` for HTTP calls
3. Add IPC communication layer
4. Update React UI to use service

### Phase 2: Collection Management
1. Add `zap-collections` for persistence
2. Implement workspace integration
3. Add import/export capabilities with `zap-converters`

### Phase 3: Advanced Features
1. Add `zap-query` for search functionality
2. Implement testing with `zap-testing`
3. Add CLI commands for automation

### Phase 4: Extension Ecosystem
1. Create public APIs for other extensions
2. Add marketplace extensions for specific formats
3. Implement plugin architecture

## Security Considerations

### 1. Request Execution
- Execute requests in isolated context
- Implement request validation and sanitization
- Add user confirmation for destructive operations
- Respect workspace trust settings

### 2. File Operations
- Validate imported collection files
- Sanitize file paths and names
- Implement size limits for imports
- Use VS Code's file system APIs

### 3. Network Access
- Respect proxy settings
- Implement timeout mechanisms
- Add certificate validation options
- Log security-relevant operations

## Testing Strategy

### 1. Unit Testing
- Test each service independently
- Mock zap package dependencies
- Validate IPC communication

### 2. Integration Testing
- Test full request flow
- Validate UI updates
- Test error handling

### 3. Performance Testing
- Measure request execution time
- Test with large collections
- Validate memory usage

## Migration Path

### From Current Implementation
1. **Preserve existing React UI** - No changes needed initially
2. **Add service layer** - Implement gradually alongside current code
3. **Feature-by-feature migration** - Move functionality one piece at a time
4. **Backward compatibility** - Maintain existing APIs during transition

### Rollback Plan
- Keep current implementation as fallback
- Feature flags for new functionality
- Graceful degradation if zap packages fail

## Configuration

### Package.json Dependencies
```json
{
  "dependencies": {
    "zap-common": "^1.0.0",
    "zap-schema": "^1.0.0"
  },
  "optionalDependencies": {
    "zap-requests": "^1.0.0",
    "zap-converters": "^1.0.0",
    "zap-collections": "^1.0.0",
    "zap-query": "^1.0.0"
  }
}
```

### Webpack Configuration
```javascript
module.exports = {
  // For renderer process
  externals: {
    'zap-requests': 'commonjs2 zap-requests',
    'zap-converters': 'commonjs2 zap-converters'
  },
  // For main process - include all packages
};
```

## Conclusion

By following this integration approach, we can leverage the powerful codevakure/zap packages while maintaining:
- Clean separation between Node.js and browser code
- No interference with existing VS Code functionality
- Scalable architecture for future enhancements
- Safe and secure request execution
- Maintainable codebase with clear boundaries

The key is to use zap packages primarily in the main process and communicate with the React UI through well-defined interfaces, avoiding any direct browser usage of Node.js-specific packages.
