# Void Editor: Microsoft Proprietary Services Removal Documentation

## Overview

This document outlines the Microsoft proprietary services that were removed from the Void Editor codebase and provides guidance on implementing alternative solutions.

## Removed Microsoft Proprietary Services

### 1. Microsoft 1DS (One Data Strategy) Telemetry Service

**Files affected:**
- `src/vs/platform/telemetry/common/1dsAppender.ts`
- All `package.json` files

**What it was:**
Microsoft's proprietary telemetry collection service that sends usage data directly to Microsoft's servers.

**Dependencies removed:**
- `@microsoft/1ds-core-js`
- `@microsoft/1ds-post-js`

**Current status:**
Replaced with placeholder implementation that maintains interface compatibility while avoiding proprietary dependencies.

### 2. Microsoft TAS (Treatment Assignment Service)

**Files affected:**
- `src/vs/platform/assignment/common/assignmentService.ts`
- `src/vs/workbench/services/assignment/common/assignmentService.ts`
- Extension package.json files

**What it was:**
Microsoft's proprietary A/B testing and experimentation service for feature flags and gradual rollouts.

**Dependencies removed:**
- `tas-client-umd`
- `vscode-tas-client`

**Current status:**
Replaced with configuration-based feature flags that can be controlled via VS Code settings.

### 3. Microsoft Build Scripts

**Scripts removed:**
- `valid-layers-check` - References Microsoft's source code organization
- `update-distro` - Microsoft's internal distribution system

## Alternative Solutions

### For Telemetry (1DS Replacement)

#### Open Source Options:
1. **PostHog** - Open source product analytics
   - Website: https://posthog.com
   - Self-hosted or cloud options
   - Privacy-focused with GDPR compliance

2. **Plausible Analytics** - Privacy-focused analytics
   - Website: https://plausible.io
   - Simple, lightweight, GDPR compliant
   - Open source and self-hostable

3. **Matomo** - Open source web analytics
   - Website: https://matomo.org
   - Full-featured analytics platform
   - 100% data ownership

4. **Custom Implementation**
   - Implement your own telemetry endpoint
   - Use existing analytics services via APIs
   - Consider user privacy and make telemetry opt-in

#### Implementation Guide:
```typescript
// Example custom telemetry implementation
export class CustomTelemetryAppender implements ITelemetryAppender {
    private endpoint = 'https://your-analytics-service.com/collect';
    
    log(eventName: string, data?: any): void {
        // Send to your analytics service
        fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: eventName, data })
        }).catch(error => {
            console.error('Telemetry failed:', error);
        });
    }
}
```

### For A/B Testing (TAS Replacement)

#### Open Source Options:
1. **Unleash** - Open source feature toggle service
   - Website: https://www.getunleash.io/
   - Self-hosted with web UI
   - Advanced targeting and rollout strategies

2. **Flagsmith** - Open source feature flag management
   - Website: https://flagsmith.com/
   - Real-time feature flags
   - Multi-environment support

3. **PostHog Feature Flags** - Combined with analytics
   - Website: https://posthog.com/feature-flags
   - Integrated with analytics platform
   - A/B testing capabilities

4. **Configuration-based Feature Flags** (Current Implementation)
   - Use VS Code settings for feature toggles
   - Environment variables for deployment flags
   - Simple and reliable

#### Implementation Examples:

**Using VS Code Settings:**
```json
// settings.json
{
  "features.newEditor": true,
  "features.experimentalApi": false,
  "experiments.override.betaFeature": true
}
```

**Using Unleash:**
```typescript
import { UnleashClient } from 'unleash-client';

const unleash = new UnleashClient({
    url: 'https://your-unleash-instance.com/api',
    appName: 'void-editor',
    instanceId: 'instance-1'
});

// Check feature flag
if (unleash.isEnabled('new-feature')) {
    // Enable feature
}
```

## Configuration Guide

### Current Feature Flag System

Void Editor now uses a configuration-based approach for feature flags:

1. **Override flags for development:**
   ```json
   "experiments.override.featureName": true
   ```

2. **Feature flags via settings:**
   ```json
   "features.featureName": true
   ```

3. **Environment-based flags:**
   Set via environment variables or build-time configuration.

### Adding New Feature Flags

1. Add to configuration schema in your configuration registry
2. Use `configurationService.getValue('features.yourFeature')` to check status
3. Implement fallback behavior when feature is disabled

## Privacy Considerations

### Telemetry Best Practices:
- Make telemetry collection opt-in by default
- Clearly document what data is collected
- Provide easy opt-out mechanisms
- Consider GDPR and other privacy regulations
- Use data minimization principles

### User Settings:
```json
{
  "telemetry.enableTelemetry": false,
  "telemetry.enableCrashReporter": false
}
```

## Migration Checklist

- [x] Remove Microsoft 1DS dependencies from all package.json files
- [x] Remove TAS dependencies from all package.json files
- [x] Replace 1dsAppender.ts with placeholder implementation
- [x] Replace assignment services with configuration-based system
- [x] Remove proprietary build scripts
- [x] Update extension packages to remove TAS dependencies
- [ ] Implement custom telemetry solution (if desired)
- [ ] Implement custom feature flag service (if needed)
- [ ] Update documentation for contributors
- [ ] Test build process without proprietary dependencies

## Development Notes

### Building Without Proprietary Dependencies

The codebase now builds without any Microsoft proprietary services. All interfaces are maintained for compatibility, but implementations are placeholder/configuration-based.

### Testing

The placeholder implementations allow the codebase to compile and run without runtime errors. Feature flags will use configuration values, and telemetry will log to console by default.

### Contributing

When adding new features:
- Use configuration-based feature flags instead of A/B testing
- Implement privacy-conscious telemetry practices
- Document any new analytics or feature flag requirements

## Support

For questions about implementing alternative services or configuration:
- Check the individual service documentation
- Review the placeholder implementations for interface requirements
- Consider the privacy implications of any telemetry implementation

## Extension Marketplace Migration

### Microsoft VS Code Marketplace → Open VSX Registry

**What was changed:**
- Updated `product.json` to use Open VSX Registry instead of Microsoft's VS Code Marketplace
- Changed `extensionsGallery.serviceUrl` from `https://marketplace.visualstudio.com/_apis/public/gallery` to `https://open-vsx.org/vscode/gallery`
- Changed `extensionsGallery.itemUrl` from `https://marketplace.visualstudio.com/items` to `https://open-vsx.org/vscode/item`
- Added proper Open VSX URL templates for extension and resource downloads
- Updated window implementation to use Open VSX domain for header injection
- Removed references to Microsoft's vsassets.io CDN

**Why this was necessary:**
- Microsoft's VS Code Marketplace is proprietary and has licensing restrictions
- Using Microsoft's marketplace creates dependency on Microsoft services
- Open VSX is the open-source alternative specifically designed for VS Code forks

**About Open VSX Registry:**
- Open source extension registry maintained by the Eclipse Foundation
- Compatible with VS Code extension format
- Many popular extensions are available, though some Microsoft-specific ones may not be
- Publishers can upload their extensions for free
- Self-hostable for organizations

**Extension Availability Notes:**
- Most popular community extensions are available on Open VSX
- Some Microsoft-authored extensions (like Python, C#) may not be available due to licensing
- Extension authors need to manually publish to Open VSX (it's not automatic from VS Code Marketplace)
- You can encourage extension authors to publish to Open VSX for better Void compatibility

**For Extension Publishers:**
If you're an extension author and want your extension available in Void:
1. Visit https://open-vsx.org/
2. Sign in with GitHub
3. Upload your extension (same .vsix file as VS Code Marketplace)
4. No cost to publish

---

*This documentation is maintained as part of the Void Editor project to ensure transparency about proprietary service removal and provide guidance for alternative implementations.*
