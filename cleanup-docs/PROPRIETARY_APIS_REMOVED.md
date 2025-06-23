# Microsoft Proprietary APIs Removed

This document details the Microsoft proprietary dependencies and APIs that have been removed from this open-source compatible version of VS Code.

## Removed Proprietary Dependencies

The following Microsoft proprietary dependencies have been removed from `package.json`:

### Telemetry Services
- **`@microsoft/1ds-core-js: ^3.2.13`** - Microsoft's 1DS (One Data Science) telemetry core service
- **`@microsoft/1ds-post-js: ^3.2.13`** - Microsoft's 1DS telemetry data posting service
- **`tas-client-umd: 0.2.0`** - Microsoft's Treatment Assignment Service (TAS) client for A/B testing

## Removed Code Components

### 1. Experimentation Service (`github-authentication` extension)
**File**: `extensions/github-authentication/src/common/experimentationService.ts`

**Original functionality**:
- Connected to Microsoft's Treatment Assignment Service (TAS)
- Provided A/B testing and feature experimentation
- Population targeting (Public, Insiders, Internal, Team)
- Advanced telemetry collection

**Current implementation**:
- Simplified to use basic telemetry only
- No-op implementation for experimentation features
- Maintains API compatibility
- Removed proprietary backend connections

### 2. TextDecoder Import Issues
**Files**: Multiple language feature extensions
- `css-language-features/client/src/node/cssClientMain.ts`
- `css-language-features/client/src/browser/cssClientMain.ts`
- `html-language-features/client/src/node/htmlClientMain.ts`
- `html-language-features/client/src/browser/htmlClientMain.ts`

**Changes**:
- Removed incorrect `import { TextDecoder } from 'util';`
- Standardized to use global `TextDecoder`
- Fixed type compatibility issues

### 3. Type Definition Version Fixes
**File**: `extensions/notebook-renderers/package.json`

**Changes**:
- Downgraded `@types/vscode-notebook-renderer` from `^1.72.0` to `1.60.0`
- Fixed 39 compilation errors related to `renderOutputItem` signature mismatch
- Ensured compatibility with official vscode implementation

## Commercial API Placeholders

The current implementation includes placeholders for commercial APIs that can be extended:

### AI/ML Services
- `@anthropic-ai/sdk` - Anthropic Claude API
- `@google/genai` - Google Generative AI
- `@mistralai/mistralai` - Mistral AI API
- `openai` - OpenAI API
- `ollama` - Local AI models
- `groq-sdk` - Groq API

### Analytics Services
- `posthog-node` - PostHog analytics (open-source alternative to Microsoft telemetry)

## Developer Extension Guide

If you need to add experimentation or advanced telemetry features, consider these alternatives:

### A/B Testing Solutions
- **LaunchDarkly** - Feature flag and experimentation platform
- **Optimizely** - Experimentation platform
- **Custom implementation** - Build your own feature flag system

### Telemetry Solutions
- **PostHog** - Open-source product analytics
- **Mixpanel** - Product analytics
- **Amplitude** - Digital analytics platform
- **Custom implementation** - Build your own telemetry system

### Integration Steps
1. Add your preferred service dependencies to `package.json`
2. Update the experimentation service implementation in `experimentationService.ts`
3. Add configuration for your service endpoints
4. Update type definitions as needed
5. Test integration with your service APIs

## Compilation Status

✅ **All extensions now compile successfully**
- CSS/HTML language features: 0 errors
- Notebook renderers: 0 errors  
- GitHub authentication: 0 errors
- All proprietary dependencies removed
- API compatibility maintained

## Files Modified

1. `package.json` - Removed Microsoft proprietary dependencies
2. `extensions/github-authentication/src/common/experimentationService.ts` - Simplified implementation
3. Multiple language feature client files - Fixed TextDecoder imports
4. `extensions/notebook-renderers/package.json` - Fixed type definition versions

This creates a clean, open-source compatible implementation while providing clear pathways for commercial extension.
