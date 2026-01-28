# Introduction

Welcome to Nadi, a powerful error monitoring and exception tracking platform designed to help developers identify, track, and resolve software bugs efficiently.

## What is Nadi?

Nadi is a comprehensive error monitoring solution that captures, aggregates, and analyzes errors across your applications. Whether you're building with Laravel, vanilla PHP, WordPress, or JavaScript, Nadi provides the tools you need to maintain healthy, reliable software.

## Key Features

| Feature | Description |
|---------|-------------|
| **Error Monitoring** | Capture exceptions, errors, and crashes with full stack traces and context |
| **Real-time Alerts** | Instant notifications via Slack, Teams, Telegram, email, or webhooks |
| **Error Aggregation** | Smart grouping of similar errors to identify patterns |
| **Context & Metadata** | Full request data, user information, and custom context |
| **Web Vitals** | Monitor Core Web Vitals and real user performance |
| **Session Replay** | Replay user sessions to understand how errors occurred |
| **Release Tracking** | Associate errors with specific code releases |
| **Performance Monitoring** | Track application performance and identify bottlenecks |

## How It Works

Nadi uses a simple but powerful architecture:

```mermaid
flowchart LR
    app["Application + SDK"]
    shipper["Shipper Agent"]
    collector["Nadi Collector"]
    dashboard["Dashboard"]

    app -->|"logs"| shipper -->|"ships"| collector -->|"analyzes"| dashboard
```

1. **Application SDK** - Installed in your application to capture errors, exceptions, and performance data
2. **Shipper Agent** - A lightweight agent that reads log files and sends them to Nadi
3. **Nadi Collector** - Receives, processes, and stores error data for analysis

## Supported Platforms

### Production Ready

| Platform | Package | Requirements |
|----------|---------|--------------|
| Laravel | `nadi-pro/nadi-laravel` | PHP 8.1+, Laravel 9+ |
| PHP | `nadi-pro/nadi-php` | PHP 8.1+ |
| WordPress | `nadi-pro/nadi-wordpress` | PHP 8.1+, WordPress 5.0+ |
| JavaScript | `@nadi-pro/browser` | Modern browsers |

### Shipper Agent

| Platform | Supported |
|----------|-----------|
| Linux | x64, ARM64 |
| macOS | x64, ARM64 (Apple Silicon) |
| Windows | x64 |

## Getting Started

Ready to get started? Follow our [Quick Start Guide](/guide/quick-start) to set up Nadi in your application in under 5 minutes.

### Installation Overview

1. **Get your API keys** - Create an application in the [Nadi Dashboard](https://nadi.pro)
2. **Install the SDK** - Add the appropriate SDK to your application
3. **Install Shipper** - Deploy the Shipper agent to ship logs
4. **Verify setup** - Trigger a test error to confirm everything works

## Next Steps

- [Quick Start Guide](/guide/quick-start) - Get up and running fast
- [Architecture](/guide/architecture) - Understand how Nadi works
- [Authentication](/guide/authentication) - Learn about API and App keys
- [SDK Documentation](/sdks/) - Deep dive into specific SDKs
