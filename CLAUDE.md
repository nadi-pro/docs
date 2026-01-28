# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation site for **Nadi**, an error monitoring and exception tracking platform. The site is built with **VitePress 1.x** (migrated from VuePress 1.9.9 in v2.0).

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

```
.vitepress/
├── config.ts              # Main VitePress configuration (site metadata, nav, sidebar)
├── theme/
│   ├── index.ts           # Custom theme setup
│   ├── components/        # Custom Vue components (SdkTabs, VersionBadge, etc.)
│   └── styles/
│       └── custom.css     # Brand colors, typography, custom styles

guide/                     # Getting Started documentation
├── index.md               # Introduction
├── quick-start.md         # Quick start guide
├── architecture.md        # System architecture
└── authentication.md      # API & App keys

sdks/                      # SDK Documentation
├── index.md               # SDK overview
├── laravel/               # Laravel SDK (9 pages)
├── php/                   # PHP Core SDK (5 pages)
├── javascript/            # JavaScript SDK (11 pages + framework guides)
└── wordpress/             # WordPress SDK (4 pages)

shipper/                   # Shipper Agent Documentation
├── index.md               # Overview
├── installation.md        # Installation guide
├── configuration.md       # Configuration reference
├── deployment.md          # Production deployment
└── troubleshooting.md     # Troubleshooting guide

platform/                  # Platform Documentation
├── index.md               # Platform overview
├── dashboard/             # Dashboard guides
├── rum/                   # Real User Monitoring
├── alerts/                # Alerts and integrations
└── teams/                 # Team management

1.0/                       # Legacy documentation (archived)
public/                    # Static assets (logo, favicon)
```

## Content Guidelines

- Main documentation is in root-level folders (guide/, sdks/, etc.)
- Legacy v1.0 docs are archived in `1.0/` with legacy banners
- Sidebar navigation is configured in `.vitepress/config.ts`
- Custom components available: `<SdkTabs>`, `<VersionBadge>`, `<ApiEndpoint>`, `<LegacyBanner>`

## Styling

- Custom styles in `.vitepress/theme/styles/custom.css`
- Color palette evolved from #048cfc (brand-1: #0284c7, brand-2: #0ea5e9, brand-3: #38bdf8)
- Primary font: Inter
- Code font: JetBrains Mono
- Fallback font: Nunito (brand continuity)

## SDK Requirements

| SDK | Package | Requirements |
|-----|---------|--------------|
| Laravel | `nadi-pro/nadi-laravel` | PHP 8.1+, Laravel 9+ |
| PHP | `nadi-pro/nadi-php` | PHP 8.1+ |
| WordPress | `nadi-pro/nadi-wordpress` | PHP 8.1+, WordPress 5.0+ |
| JavaScript | `@nadi-pro/browser` | Modern browsers (ES2020+) |
