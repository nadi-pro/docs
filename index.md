---
layout: home

hero:
  name: Nadi
  text: Error Monitoring & Exception Tracking
  tagline: Identify, track, and resolve bugs faster with comprehensive error monitoring for PHP, JavaScript, and WordPress applications.
  image:
    src: /logo.svg
    alt: Nadi
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/nadi-pro

features:
  - icon: 🔍
    title: Real-time Error Tracking
    details: Capture exceptions, errors, and crashes as they happen with full stack traces, request data, and contextual information.
  - icon: 📊
    title: Web Vitals & RUM
    details: Monitor real user experience with Core Web Vitals, performance metrics, and session replay capabilities.
  - icon: 🚨
    title: Instant Alerts
    details: Get notified immediately via Slack, Teams, Telegram, email, or webhooks when critical issues occur.
  - icon: 🔧
    title: Multi-Platform SDKs
    details: Native SDKs for Laravel, PHP, WordPress, and JavaScript with framework-specific integrations.
  - icon: 📈
    title: Smart Aggregation
    details: Intelligently group similar errors to identify patterns, track trends, and prioritize fixes effectively.
  - icon: ⚡
    title: Lightweight & Fast
    details: Minimal performance overhead with efficient log shipping via Shipper agent and configurable sampling strategies.
---

## Quick Start

Get up and running with Nadi in minutes:

::: code-group

```bash [Laravel]
composer require nadi-pro/nadi-laravel
php artisan nadi:install
```

```bash [PHP]
composer require nadi-pro/nadi-php
```

```bash [JavaScript]
npm install @nadi-pro/browser
```

```bash [WordPress]
# Download from GitHub releases
# Upload via WordPress Plugins page
```

:::

Then install the [Shipper](/shipper/) agent to send logs to Nadi:

```bash
sudo bash < <(curl -sL https://raw.githubusercontent.com/nadi-pro/shipper/master/install)
```

[Read the full guide →](/guide/quick-start)

## Platform Requirements

| SDK | Requirements |
|-----|--------------|
| Laravel | PHP 8.1+, Laravel 9+ |
| PHP Core | PHP 8.1+ |
| WordPress | PHP 8.1+, WordPress 5.0+ |
| JavaScript | Modern browsers (ES2020+) |
| Shipper | Linux, macOS, or Windows |
