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

## Version Badges

Use `<VersionBadge>` to indicate feature status:

```markdown
# Feature Title <VersionBadge type="coming-soon">Coming Soon</VersionBadge>
```

| Type | Color | Usage |
|------|-------|-------|
| `required` | Red | Required version/dependency |
| `optional` | Purple | Optional feature |
| `new` | Green | New feature |
| `deprecated` | Orange | Deprecated feature |
| `coming-soon` | Blue | Feature in development |

## Coming Soon Features

The following features are marked as "Coming Soon":

- **JavaScript SDK**: React, Vue, Angular, Next.js integrations
- **JavaScript SDK**: Session Replay
- **WordPress SDK**: WooCommerce integration

## Diagrams

Use **MermaidJS** for all diagrams. The site is configured with `vitepress-plugin-mermaid`.

### Supported Diagram Types

- `flowchart` - Data flow and architecture diagrams
- `stateDiagram-v2` - State machine diagrams
- `sequenceDiagram` - Sequence diagrams
- `block-beta` - Block diagrams (for UI layouts)

### Example Usage

```markdown
\`\`\`mermaid
flowchart LR
    app["Application"] --> shipper["Shipper"] --> nadi["Nadi"]
\`\`\`
```

### Theme Configuration

Mermaid diagrams automatically adapt to light/dark mode via CSS in `.vitepress/theme/styles/custom.css`:

| Mode | Text Color | Node Fill | Node Border | Background |
|------|------------|-----------|-------------|------------|
| Light | #1e293b | #dbeafe | #0284c7 | #f1f5f9 |
| Dark | #e2e8f0 | #1e3a5f | #38bdf8 | #0f172a |

All diagram types are supported: flowchart, stateDiagram, block-beta, etc.

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
