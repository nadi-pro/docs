import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './styles/custom.css'

// Import custom components
import SdkTabs from './components/SdkTabs.vue'
import VersionBadge from './components/VersionBadge.vue'
import ApiEndpoint from './components/ApiEndpoint.vue'
import LegacyBanner from './components/LegacyBanner.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register custom components globally
    app.component('SdkTabs', SdkTabs)
    app.component('VersionBadge', VersionBadge)
    app.component('ApiEndpoint', ApiEndpoint)
    app.component('LegacyBanner', LegacyBanner)
  }
} satisfies Theme
