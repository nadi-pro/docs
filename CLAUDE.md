# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation site for **Nadi**, an error monitoring and exception tracking platform. The site is built with VuePress 1.9.9.

## Development Commands

```bash
# Start development server
npm start

# Alternative development command
npm run docs:dev

# Build for production
npm run docs:build
```

**Node 17+ Requirement:** Use the OpenSSL legacy provider flag:
```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

## Architecture

```
.vuepress/
├── config.js          # Main VuePress configuration (site metadata, plugins, nav, sidebar)
├── 1.0.js             # Sidebar configuration for version 1.0
├── plugins/           # Custom VuePress plugins
├── theme/             # Custom theme extending default VuePress theme
├── public/            # Static assets (images, PWA manifest)
└── styles/
    ├── palette.styl   # Color variables (accent: #048cfc)
    └── index.styl     # Global styles

1.0/                   # Documentation content for version 1.0
├── README.md          # Landing page
├── introduction.md    # Platform overview
├── installation-*.md  # Installation guides
└── configuration-*.md # Configuration guides
```

## Content Guidelines

- Documentation lives in versioned folders (currently `1.0/`)
- Sidebar navigation is configured in `.vuepress/1.0.js`
- Add new pages to the sidebar config after creating markdown files
- Use the existing installation/configuration naming patterns for new docs

## Styling

- Custom styles use Stylus (`.styl` files)
- Color palette defined in `.vuepress/styles/palette.styl`
- Font: Nunito
