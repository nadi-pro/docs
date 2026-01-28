---
title: Legacy Documentation
---

<script setup>
import LegacyBanner from '../.vitepress/theme/components/LegacyBanner.vue'
</script>

<LegacyBanner new-path="/guide/" />

# Introduction

Welcome to the documentation of Nadi, a powerful error monitoring and exception tracking tool designed to help developers identify, track, and resolve software bugs and exceptions efficiently.

::: warning Outdated Requirements
This documentation lists PHP > 7 and Laravel 5+ requirements. Current SDKs require:
- PHP 8.1+
- Laravel 9+

Please refer to the [latest documentation](/guide/) for current requirements.
:::

## Why Nadi?

Nadi combines the best features of popular error monitoring platforms into a unified solution, enabling you to streamline your error monitoring workflow.

## Key Features

| Feature | Description |
|---------|-------------|
| Error Monitoring | Capture, collect, and analyze errors within your application |
| Real-time Alerts | Receive instant alerts via email, Slack, or other channels |
| Error Aggregation | Intelligently group similar errors to identify patterns |
| Context and Metadata | Access stack traces, request data, and user information |
| Integrations | Seamlessly integrate with popular development tools |
| Release Tracking | Associate errors with specific code releases |
| Performance Monitoring | Track application metrics and identify bottlenecks |

## Getting Started

To get started with Nadi, follow the [installation](/1.0/installation) guide.

## The Architecture

```
Application → Shipper Agent → Nadi Collector → Dashboard
```

1. The Application installed with Nadi's Client captures events and stores them to log files
2. Shipper reads the log files and sends them to Nadi Collector

## Supported Platforms

| Runtime | Framework |
|---------|-----------|
| PHP | Laravel |
| PHP | WordPress |

---

**[View the latest documentation →](/guide/)**
