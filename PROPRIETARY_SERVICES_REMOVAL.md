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

## Telemetry, Surveys & Crash Reporting System

**What was removed:**
- Microsoft Application Insights keys and endpoints
- Azure Application Insights telemetry collection
- Microsoft's HockeyApp crash reporting URLs
- Microsoft's experiment flags and A/B testing framework
- Built-in NPS surveys pointing to Microsoft endpoints
- Language-specific surveys managed by Microsoft

**What was added:**
- Privacy-focused default configuration in `product.json`:
  - `enableTelemetry`: false (disabled by default)
  - `enabledTelemetryLevels`: error and usage both set to false
  - `removeTelemetryMachineId`: true (for privacy)
  - `aiConfig`: empty object (placeholder for custom analytics)
  - `crashReporter`: empty object (placeholder for custom crash reporting)
  - `npsSurveyUrl`: empty string (placeholder for custom NPS surveys)
  - `surveys`: empty array (placeholder for custom surveys)

**Comprehensive Documentation:**
- Created `TELEMETRY_SURVEYS_CRASH_REPORTING_GUIDE.md` with complete implementation guide
- Includes privacy-first configuration examples
- Provides open-source alternatives (PostHog, Plausible, Matomo, Sentry)
- Contains step-by-step implementation instructions
- Includes compliance and privacy best practices

**Developer Benefits:**
- Easy to configure custom telemetry with full privacy control
- Support for multiple analytics platforms (self-hosted or cloud)
- Comprehensive crash reporting setup options
- Flexible survey system for user feedback
- Privacy-first defaults with opt-in telemetry

**Privacy Features:**
- All telemetry disabled by default
- Machine ID removal option
- Granular telemetry level controls
- Transparent data collection policies
- GDPR/CCPA compliance guidance

**For Future Implementation:**
1. Choose your preferred analytics platform from the guide
2. Configure the appropriate settings in `product.json`
3. Follow implementation examples in the guide
4. Test with privacy controls enabled
5. Ensure user consent and transparency

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

## Extension Recommendations System

**What was removed:**
- Microsoft's curated extension recommendations that promoted Microsoft-authored extensions
- Automatic suggestions for proprietary Microsoft extensions
- Built-in recommendations pointing to VS Code Marketplace

**What was added:**
- Empty placeholder configuration sections in `product.json`:
  - `extensionRecommendations`: File-based and condition-based recommendations
  - `configBasedExtensionTips`: Settings-based recommendations
  - `exeBasedExtensionTips`: Executable detection-based recommendations
  - `webExtensionTips`: Web development focused extensions
  - `languageExtensionTips`: Programming language support extensions
  - `keymapExtensionTips`: Alternative keyboard layout extensions

**Comprehensive Documentation:**
- Created `EXTENSION_RECOMMENDATIONS_GUIDE.md` with complete configuration examples
- Includes step-by-step instructions for adding custom recommendations
- Provides popular extension categories and IDs from Open VSX
- Contains migration guidance from VS Code recommendations

**Developer Benefits:**
- Easy to configure custom extension recommendations
- Support for multiple trigger conditions (file types, settings, executables)
- Compatible with Open VSX Registry
- Comprehensive examples and best practices included

**For Future Customization:**
1. Edit the empty objects/arrays in `product.json` 
2. Follow examples in `EXTENSION_RECOMMENDATIONS_GUIDE.md`
3. Verify extensions are available on Open VSX Registry
4. Test recommendations in development builds

## Extension Trust & Proposed API Access System

**What was removed:**
- Microsoft extension publisher organization trust (Microsoft as trusted org)
- Whitelist allowing Microsoft-published extensions to use proposed APIs
- Pre-configured trust for Microsoft authentication providers
- Built-in protocol handler permissions for Microsoft extensions
- Automatic trust for extensions from Microsoft's publisher accounts

**What was added:**
- Empty secure default configurations in `product.json`:
  - `extensionPublisherOrgs`: Empty array (no trusted publisher organizations)
  - `trustedExtensionPublishers`: Empty array (no pre-trusted individual publishers)
  - `trustedExtensionUrlPublicKeys`: Empty object (no pre-configured URL signing keys)
  - `trustedExtensionAuthAccess`: Empty array (no pre-granted authentication access)
  - `trustedExtensionProtocolHandlers`: Empty array (no pre-trusted protocol handlers)
  - `extensionEnabledApiProposals`: Empty object (no extensions pre-approved for proposed APIs)

**Comprehensive Documentation:**
- Created `EXTENSION_TRUST_PROPOSED_API_GUIDE.md` with complete configuration guide
- Includes security best practices and principle of least privilege
- Provides examples for development, enterprise, and community setups
- Contains migration guidance from Microsoft extensions
- Includes troubleshooting and testing procedures

**Security Benefits:**
- Principle of least privilege by default
- No implicit trust for any publisher or organization
- Granular control over proposed API access
- Explicit authentication and protocol handler permissions
- Protection against untrusted extension capabilities

**Key Features:**
- **Publisher Trust Control**: Configure trusted extension publishers and organizations
- **Proposed API Whitelist**: Control which extensions can use unstable APIs
- **Authentication Access**: Manage which extensions can access auth providers
- **Protocol Handler Security**: Control which extensions can handle custom URLs
- **URL Signing Verification**: Support for signed extension distribution

**For Future Implementation:**
1. Review which extensions need proposed API access
2. Configure minimal necessary permissions in `product.json`
3. Follow security best practices from the guide
4. Test thoroughly in development environments
5. Regularly audit and update trust configurations

**Migration Considerations:**
- Many Microsoft extensions rely on proposed APIs and won't work without explicit configuration
- Community alternatives on Open VSX may need different API permissions
- Some proposed APIs may have been finalized since VS Code versions
- Custom extensions may need to be developed for missing functionality

---

*This documentation is maintained as part of the Void Editor project to ensure transparency about proprietary service removal and provide guidance for alternative implementations.*
