# Shipper

Shipper is a lightweight agent that reads log files from your application and sends them to Nadi.

## Overview

Shipper is written in Go and designed to be:

- **Lightweight** - Minimal CPU and memory usage (~10MB RAM)
- **Reliable** - Automatic retries and delivery tracking
- **Efficient** - Batched requests and compression
- **Simple** - Easy to install and configure

## How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Your App       │     │    Shipper      │     │     Nadi        │
│                 │     │                 │     │                 │
│  Writes logs    │────▶│  Reads logs     │────▶│  Receives &     │
│  to files       │     │  Sends to Nadi  │     │  processes      │
│                 │     │  Tracks progress│     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. Your application writes error events to log files
2. Shipper monitors the log directory
3. Shipper reads new events and sends them to Nadi
4. Shipper tracks what's been sent (no duplicate delivery)
5. Optionally cleans up old log files

## Requirements

- Linux (x64, ARM64), macOS (x64, ARM64), or Windows (x64)
- Network access to nadi.pro

## Quick Start

### Install

::: code-group

```bash [Linux & macOS]
sudo bash < <(curl -sL https://raw.githubusercontent.com/nadi-pro/shipper/master/install)
```

```powershell [Windows]
powershell -command "(New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/nadi-pro/shipper/master/install.ps1', '%TEMP%\install.ps1') && %TEMP%\install.ps1 && del %TEMP%\install.ps1"
```

:::

### Configure

Edit the configuration file:

| OS | Location |
|----|----------|
| Linux | `/opt/nadi-pro/shipper/nadi.yaml` |
| macOS | `/usr/local/nadi-pro/shipper/nadi.yaml` |
| Windows | `C:\ProgramData\Nadi-Pro\Shipper\nadi.yaml` |

```yaml
nadi:
  endpoint: https://nadi.pro/api/
  apiKey: your-api-key
  token: your-application-key
  storage: /var/log/nadi
```

### Run

```bash
shipper --record
```

## Features

| Feature | Description |
|---------|-------------|
| File Watching | Monitors log directory for new files |
| Batching | Groups events for efficient network usage |
| Compression | Compresses payloads to reduce bandwidth |
| Retries | Automatic retry with exponential backoff |
| Progress Tracking | Knows what's been sent, survives restarts |
| Log Rotation | Optionally cleans up old logs |

## Supported Platforms

| Platform | Architecture | Support |
|----------|--------------|---------|
| Linux | x64 | Full |
| Linux | ARM64 | Full |
| macOS | x64 (Intel) | Full |
| macOS | ARM64 (Apple Silicon) | Full |
| Windows | x64 | Full |

## Next Steps

- [Installation](/shipper/installation) - Detailed installation guide
- [Configuration](/shipper/configuration) - Configuration reference
- [Deployment](/shipper/deployment) - Production deployment
- [Troubleshooting](/shipper/troubleshooting) - Common issues
