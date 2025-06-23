# Telemetry, Surveys & Crash Reporting Configuration Guide

This guide explains how to configure telemetry collection, user surveys, and crash reporting in Void Editor. These features help collect usage data, user feedback, and crash information to improve the editor experience.

## Overview

Telemetry, surveys, and crash reporting in Void are configured through the `product.json` file in the following sections:

- `enableTelemetry` - Global telemetry enable/disable flag
- `enabledTelemetryLevels` - Granular telemetry level controls
- `removeTelemetryMachineId` - Privacy control for machine identification
- `aiConfig` - Application Insights configuration for telemetry collection
- `crashReporter` - Crash reporting service configuration
- `npsSurveyUrl` - Net Promoter Score survey URL
- `surveys` - Language and feature-specific surveys

## Important Notes

⚠️ **Privacy First**: Void Editor prioritizes user privacy. All telemetry should be:
- Completely optional and opt-in
- Transparent about what data is collected
- Anonymized when possible
- Compliant with privacy laws (GDPR, CCPA, etc.)

🔒 **Data Security**: Ensure all telemetry endpoints use HTTPS and follow security best practices.

🏠 **Self-Hosted Options**: Consider providing self-hosted alternatives for organizations.

## Current Configuration (Privacy-Focused Defaults)

The current `product.json` has privacy-focused defaults:

```json
{
  "enableTelemetry": false,
  "enabledTelemetryLevels": {
    "error": false,
    "usage": false
  },
  "removeTelemetryMachineId": true,
  "aiConfig": {},
  "crashReporter": {},
  "npsSurveyUrl": "",
  "surveys": []
}
```

## Configuration Options

### 1. Basic Telemetry Controls

#### Enable/Disable Telemetry (`enableTelemetry`)

```json
{
  "enableTelemetry": true
}
```

- `true`: Enable telemetry collection (requires user consent)
- `false`: Disable all telemetry collection (default for privacy)

#### Telemetry Levels (`enabledTelemetryLevels`)

```json
{
  "enabledTelemetryLevels": {
    "error": true,
    "usage": false
  }
}
```

**Options:**
- `error`: Collect error and crash information
- `usage`: Collect usage patterns and feature usage

**Recommendations:**
- Start with `error: true, usage: false` for minimal data collection
- Only enable `usage: true` with explicit user consent

#### Machine ID Privacy (`removeTelemetryMachineId`)

```json
{
  "removeTelemetryMachineId": true
}
```

- `true`: Remove machine ID from telemetry (default for privacy)
- `false`: Include machine ID for session correlation

### 2. Application Insights Configuration (`aiConfig`)

For telemetry collection using Azure Application Insights or compatible services:

```json
{
  "aiConfig": {
    "ariaKey": "your-instrumentation-key-here"
  }
}
```

**Example with Custom Endpoint:**

```json
{
  "aiConfig": {
    "ariaKey": "custom-key-12345",
    "endpointUrl": "https://your-telemetry.example.com/collect",
    "maxBatchSize": 100,
    "maxBatchInterval": 5000
  }
}
```

**Properties:**
- `ariaKey`: Instrumentation key for telemetry service
- `endpointUrl`: Custom telemetry collection endpoint
- `maxBatchSize`: Maximum events per batch
- `maxBatchInterval`: Maximum time between batches (ms)

### 3. Crash Reporter Configuration (`crashReporter`)

For automatic crash reporting using Electron's crash reporter or custom service:

```json
{
  "crashReporter": {
    "companyName": "Your Organization",
    "productName": "Void Editor",
    "submitURL": "https://your-crash-service.example.com/submit",
    "uploadToServer": false,
    "ignoreSystemCrashHandler": false,
    "rateLimit": true,
    "compress": true
  }
}
```

**Properties:**
- `companyName`: Organization name for crash reports
- `productName`: Product name in crash reports
- `submitURL`: Crash report submission endpoint
- `uploadToServer`: Whether to upload crashes automatically
- `ignoreSystemCrashHandler`: Use built-in crash handler
- `rateLimit`: Limit crash report frequency
- `compress`: Compress crash reports before sending

### 4. User Surveys

#### NPS Survey (`npsSurveyUrl`)

Net Promoter Score survey for user satisfaction:

```json
{
  "npsSurveyUrl": "https://your-survey.example.com/nps"
}
```

The URL will automatically receive parameters:
- `o`: Operating system platform
- `v`: Editor version
- `m`: Machine ID (if not removed)

#### Custom Surveys (`surveys`)

Language and feature-specific surveys:

```json
{
  "surveys": [
    {
      "surveyId": "python-experience-2024",
      "surveyUrl": "https://your-survey.example.com/python",
      "languageId": "python",
      "editCount": 50,
      "userProbability": 0.05
    },
    {
      "surveyId": "git-workflow-feedback",
      "surveyUrl": "https://your-survey.example.com/git",
      "languageId": "*",
      "editCount": 100,
      "userProbability": 0.02
    }
  ]
}
```

**Survey Properties:**
- `surveyId`: Unique identifier for the survey
- `surveyUrl`: Survey URL (receives same parameters as NPS)
- `languageId`: Target language ID or "*" for all languages
- `editCount`: Minimum edit count before showing survey
- `userProbability`: Probability (0.0-1.0) of showing survey to user

## Implementation Examples

### 1. Privacy-First Telemetry Setup

```json
{
  "enableTelemetry": true,
  "enabledTelemetryLevels": {
    "error": true,
    "usage": false
  },
  "removeTelemetryMachineId": true,
  "aiConfig": {
    "ariaKey": "your-key",
    "endpointUrl": "https://your-analytics.example.com/collect"
  }
}
```

This configuration:
- Enables minimal telemetry (errors only)
- Removes machine IDs for privacy
- Uses custom analytics endpoint

### 2. Self-Hosted Analytics Stack

```json
{
  "enableTelemetry": true,
  "enabledTelemetryLevels": {
    "error": true,
    "usage": true
  },
  "removeTelemetryMachineId": false,
  "aiConfig": {
    "ariaKey": "self-hosted-key",
    "endpointUrl": "https://analytics.yourcompany.com/api/events",
    "maxBatchSize": 50,
    "maxBatchInterval": 10000
  },
  "crashReporter": {
    "companyName": "Your Company",
    "productName": "Void Editor",
    "submitURL": "https://crash-reports.yourcompany.com/submit",
    "uploadToServer": true,
    "compress": true
  }
}
```

### 3. Open Source Alternatives

#### Using PostHog (Open Source Analytics)

```json
{
  "aiConfig": {
    "ariaKey": "phc_your_posthog_key",
    "endpointUrl": "https://app.posthog.com/capture/",
    "serviceName": "posthog"
  }
}
```

#### Using Plausible Analytics

```json
{
  "aiConfig": {
    "ariaKey": "your-domain.com",
    "endpointUrl": "https://plausible.io/api/event",
    "serviceName": "plausible"
  }
}
```

#### Using Matomo (Self-Hosted)

```json
{
  "aiConfig": {
    "ariaKey": "your-site-id",
    "endpointUrl": "https://your-matomo.example.com/matomo.php",
    "serviceName": "matomo"
  }
}
```

## Custom Telemetry Implementation

### 1. Replace Telemetry Appender

The existing telemetry code uses placeholders. To implement custom telemetry:

1. **Edit `src/vs/platform/telemetry/common/1dsAppender.ts`**:

```typescript
// Replace the placeholder getClient function
async function getClient(instrumentationKey: string, addInternalFlag?: boolean, xhrOverride?: any): Promise<IAppInsightsCore> {
    // Your custom telemetry client implementation
    return new YourCustomTelemetryClient(instrumentationKey);
}
```

2. **Implement your telemetry client**:

```typescript
class YourCustomTelemetryClient implements IAppInsightsCore {
    constructor(private key: string) {}
    
    track(item: ITelemetryItem): void {
        // Send to your analytics service
        fetch('https://your-analytics.example.com/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                key: this.key,
                event: item.name,
                properties: item.data,
                timestamp: item.timestamp || Date.now()
            })
        });
    }
    
    // ... implement other methods
}
```

### 2. Custom Crash Reporting

To implement custom crash reporting:

1. **Configure Electron crash reporter** in your main process
2. **Set up crash collection endpoint**
3. **Process crash dumps** for analysis

### 3. Survey Integration

To add custom surveys:

1. **Configure survey URLs** in `product.json`
2. **Implement survey triggers** based on user activity
3. **Collect and analyze** survey responses

## Privacy and Compliance Best Practices

### 1. User Consent
- Always ask for explicit consent before collecting telemetry
- Provide clear opt-out mechanisms
- Respect user preferences across updates

### 2. Data Minimization
- Only collect data necessary for improvement
- Avoid collecting personal information
- Use aggregated data when possible

### 3. Transparency
- Document what data is collected
- Provide privacy policy links
- Allow users to view collected data

### 4. Security
- Use HTTPS for all telemetry endpoints
- Encrypt sensitive data
- Implement proper authentication

## Open Source Alternatives

### Analytics Platforms
1. **PostHog** - Product analytics (https://posthog.com/)
2. **Plausible** - Privacy-focused web analytics (https://plausible.io/)
3. **Matomo** - Open source web analytics (https://matomo.org/)
4. **Umami** - Simple, fast analytics (https://umami.is/)

### Crash Reporting
1. **Sentry** - Error tracking (https://sentry.io/)
2. **Bugsnag** - Error monitoring (https://www.bugsnag.com/)
3. **Self-hosted solutions** - Custom crash collection

### Survey Tools
1. **Typeform** - User-friendly surveys (https://www.typeform.com/)
2. **SurveyJS** - Open source survey library (https://surveyjs.io/)
3. **LimeSurvey** - Self-hosted surveys (https://www.limesurvey.org/)

## Testing and Validation

### 1. Local Testing
- Test telemetry collection in development
- Verify privacy controls work correctly
- Validate data format and content

### 2. Staging Environment
- Test with real analytics services
- Verify crash reporting functionality
- Test survey triggers and display

### 3. Privacy Validation
- Confirm no personal data is collected
- Test opt-out mechanisms
- Validate data anonymization

## Troubleshooting

### Telemetry Not Working
1. Check `enableTelemetry` flag
2. Verify `aiConfig` setup
3. Check network connectivity
4. Validate instrumentation key

### Crashes Not Reported
1. Verify crash reporter configuration
2. Check crash dump directory permissions
3. Validate crash submission URL
4. Test crash reporter initialization

### Surveys Not Appearing
1. Check survey configuration
2. Verify trigger conditions (edit count, probability)
3. Test survey URL accessibility
4. Check user preference settings

---

For more information about Void Editor development, see the main [VOID_CODEBASE_GUIDE.md](./VOID_CODEBASE_GUIDE.md) and [PROPRIETARY_SERVICES_REMOVAL.md](./PROPRIETARY_SERVICES_REMOVAL.md).
