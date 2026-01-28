import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Nadi',
  description: 'Your App\'s Nervous System — Errors, traces, real user monitoring unified in one dashboard. 5-minute setup for PHP, JavaScript, and more.',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap', rel: 'stylesheet' }],
    ['meta', { name: 'theme-color', content: '#008BFF' }],
    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Nadi' }],
    ['meta', { property: 'og:title', content: 'Nadi — Your App\'s Nervous System' }],
    ['meta', { property: 'og:description', content: 'Errors, traces, real user monitoring unified in one dashboard. 5-minute setup for PHP, JavaScript, and more.' }],
    ['meta', { property: 'og:image', content: 'https://docs.nadi.pro/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://docs.nadi.pro' }],
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Nadi — Your App\'s Nervous System' }],
    ['meta', { name: 'twitter:description', content: 'Errors, traces, real user monitoring unified in one dashboard. 5-minute setup for PHP, JavaScript, and more.' }],
    ['meta', { name: 'twitter:image', content: 'https://docs.nadi.pro/og-image.png' }],
  ],

  themeConfig: {
    logo: {
      light: '/logo.svg',
      dark: '/logo-dark.svg',
      alt: 'Nadi'
    },
    siteTitle: false,

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'SDKs', link: '/sdks/' },
      { text: 'Shipper', link: '/shipper/' },
      { text: 'Platform', link: '/platform/' },
      {
        text: 'v2.0',
        items: [
          { text: 'v2.0 (Current)', link: '/' },
          { text: 'v1.0 (Legacy)', link: '/1.0/' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Authentication', link: '/guide/authentication' }
          ]
        }
      ],
      '/sdks/': [
        {
          text: 'SDK Overview',
          items: [
            { text: 'Introduction', link: '/sdks/' }
          ]
        },
        {
          text: 'Laravel',
          collapsed: false,
          items: [
            { text: 'Installation', link: '/sdks/laravel/' },
            { text: 'Configuration', link: '/sdks/laravel/configuration' },
            { text: 'Error Tracking', link: '/sdks/laravel/error-tracking' },
            { text: 'Context & Metadata', link: '/sdks/laravel/context' },
            { text: 'User Identification', link: '/sdks/laravel/user-identification' },
            { text: 'Performance Monitoring', link: '/sdks/laravel/performance' },
            { text: 'Sampling', link: '/sdks/laravel/sampling' },
            { text: 'Testing', link: '/sdks/laravel/testing' },
            { text: 'Troubleshooting', link: '/sdks/laravel/troubleshooting' }
          ]
        },
        {
          text: 'PHP',
          collapsed: true,
          items: [
            { text: 'Installation', link: '/sdks/php/' },
            { text: 'Configuration', link: '/sdks/php/configuration' },
            { text: 'Transporters', link: '/sdks/php/transporters' },
            { text: 'Sampling', link: '/sdks/php/sampling' },
            { text: 'Advanced Usage', link: '/sdks/php/advanced' }
          ]
        },
        {
          text: 'JavaScript',
          collapsed: true,
          items: [
            { text: 'Installation', link: '/sdks/javascript/' },
            { text: 'Configuration', link: '/sdks/javascript/configuration' },
            { text: 'Error Tracking', link: '/sdks/javascript/error-tracking' },
            { text: 'Breadcrumbs', link: '/sdks/javascript/breadcrumbs' },
            { text: 'Web Vitals', link: '/sdks/javascript/web-vitals' },
            { text: 'Session Replay (Coming Soon)', link: '/sdks/javascript/session-replay' },
            { text: 'Source Maps', link: '/sdks/javascript/source-maps' },
            { text: 'React (Coming Soon)', link: '/sdks/javascript/react' },
            { text: 'Vue (Coming Soon)', link: '/sdks/javascript/vue' },
            { text: 'Angular (Coming Soon)', link: '/sdks/javascript/angular' },
            { text: 'Next.js (Coming Soon)', link: '/sdks/javascript/nextjs' }
          ]
        },
        {
          text: 'WordPress',
          collapsed: true,
          items: [
            { text: 'Installation', link: '/sdks/wordpress/' },
            { text: 'Configuration', link: '/sdks/wordpress/configuration' },
            { text: 'Error Tracking', link: '/sdks/wordpress/error-tracking' },
            { text: 'WooCommerce (Coming Soon)', link: '/sdks/wordpress/woocommerce' }
          ]
        }
      ],
      '/shipper/': [
        {
          text: 'Shipper',
          items: [
            { text: 'Introduction', link: '/shipper/' },
            { text: 'Installation', link: '/shipper/installation' },
            { text: 'Configuration', link: '/shipper/configuration' },
            { text: 'Deployment', link: '/shipper/deployment' },
            { text: 'Troubleshooting', link: '/shipper/troubleshooting' }
          ]
        }
      ],
      '/platform/': [
        {
          text: 'Platform',
          items: [
            { text: 'Overview', link: '/platform/' }
          ]
        },
        {
          text: 'Dashboard',
          collapsed: false,
          items: [
            { text: 'Getting Started', link: '/platform/dashboard/' },
            { text: 'Issues', link: '/platform/dashboard/issues' },
            { text: 'Error Details', link: '/platform/dashboard/error-details' },
            { text: 'Trends', link: '/platform/dashboard/trends' }
          ]
        },
        {
          text: 'Real User Monitoring',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/platform/rum/' },
            { text: 'Web Vitals', link: '/platform/rum/web-vitals' },
            { text: 'Sessions', link: '/platform/rum/sessions' },
            { text: 'Performance', link: '/platform/rum/performance' }
          ]
        },
        {
          text: 'Alerts',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/platform/alerts/' },
            { text: 'Alert Rules', link: '/platform/alerts/rules' },
            { text: 'Slack', link: '/platform/alerts/slack' },
            { text: 'Microsoft Teams', link: '/platform/alerts/teams' },
            { text: 'Telegram', link: '/platform/alerts/telegram' },
            { text: 'Webhooks', link: '/platform/alerts/webhooks' }
          ]
        },
        {
          text: 'Teams & Settings',
          collapsed: true,
          items: [
            { text: 'Team Management', link: '/platform/teams/' },
            { text: 'Projects', link: '/platform/teams/projects' },
            { text: 'API Keys', link: '/platform/teams/api-keys' }
          ]
        }
      ],
      '/1.0/': [
        {
          text: 'Legacy Documentation (v1.0)',
          items: [
            { text: 'Introduction', link: '/1.0/' },
            { text: 'Installation', link: '/1.0/installation' },
            { text: 'API & App Keys', link: '/1.0/installation-nadi-api-app-key' },
            { text: 'Nadi Client', link: '/1.0/installation-nadi-client' },
            { text: 'Nadi Shipper', link: '/1.0/installation-nadi-shipper' },
            { text: 'Testing', link: '/1.0/installation-nadi-testing' },
            { text: 'Service', link: '/1.0/installation-nadi-service' },
            { text: 'Sampling', link: '/1.0/configuration-nadi-sampling' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nadi-pro' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Nadi Pro'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/nadi-pro/docs/edit/main/:path',
      text: 'Edit this page on GitHub'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        css: {
          additionalData: ''
        }
      }
    }
  },

  mermaid: {
    theme: 'neutral'
  },

  mermaidPlugin: {
    class: 'mermaid'
  }
}))
