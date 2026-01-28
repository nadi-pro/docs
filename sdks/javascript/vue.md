# Vue Integration

Integrate Nadi with Vue.js applications for comprehensive error tracking.

## Installation

```bash
npm install @nadi-pro/browser @nadi-pro/vue
```

## Setup

### Vue 3

```javascript
// main.js
import { createApp } from 'vue'
import { init } from '@nadi-pro/browser'
import { NadiPlugin } from '@nadi-pro/vue'
import App from './App.vue'

init({
  appKey: 'your-app-key',
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_APP_VERSION,
})

const app = createApp(App)
app.use(NadiPlugin)
app.mount('#app')
```

### Vue 2

```javascript
// main.js
import Vue from 'vue'
import { init } from '@nadi-pro/browser'
import { NadiPlugin } from '@nadi-pro/vue'
import App from './App.vue'

init({
  appKey: 'your-app-key',
  environment: process.env.NODE_ENV,
  release: process.env.VUE_APP_VERSION,
})

Vue.use(NadiPlugin)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
```

## Error Handling

### Global Error Handler

The plugin automatically captures Vue errors:

```javascript
app.use(NadiPlugin, {
  attachErrorHandler: true, // default: true
})
```

### Component-Level Error Handling

```vue
<script setup>
import { captureException } from '@nadi-pro/browser'

async function loadData() {
  try {
    const data = await fetchData()
    return data
  } catch (error) {
    captureException(error, {
      tags: { component: 'DataLoader' },
    })
    throw error
  }
}
</script>
```

### Error Boundary Component

```vue
<!-- ErrorBoundary.vue -->
<template>
  <slot v-if="!error" />
  <div v-else class="error-container">
    <h2>Something went wrong</h2>
    <p>{{ error.message }}</p>
    <button @click="resetError">Try again</button>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { captureException } from '@nadi-pro/browser'

const error = ref(null)

onErrorCaptured((err, instance, info) => {
  error.value = err
  captureException(err, {
    extra: {
      componentInfo: info,
      componentName: instance?.$options?.name,
    },
  })
  return false // Prevent propagation
})

function resetError() {
  error.value = null
}
</script>
```

Usage:

```vue
<template>
  <ErrorBoundary>
    <RiskyComponent />
  </ErrorBoundary>
</template>
```

## Composition API

### useNadi Composable

```vue
<script setup>
import { useNadi } from '@nadi-pro/vue'

const nadi = useNadi()

function handleAction() {
  nadi.addBreadcrumb({
    category: 'user-action',
    message: 'Clicked important button',
  })

  try {
    performAction()
  } catch (error) {
    nadi.captureException(error)
  }
}
</script>
```

### Custom Composable

```javascript
// composables/useNadiTracking.js
import { useNadi } from '@nadi-pro/vue'
import { onMounted, onUnmounted } from 'vue'

export function useNadiTracking(componentName) {
  const nadi = useNadi()

  onMounted(() => {
    nadi.addBreadcrumb({
      category: 'component',
      message: `${componentName} mounted`,
    })
  })

  onUnmounted(() => {
    nadi.addBreadcrumb({
      category: 'component',
      message: `${componentName} unmounted`,
    })
  })

  return nadi
}
```

## Options API

### Vue 3

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  inject: ['$nadi'],
  methods: {
    handleError(error) {
      this.$nadi.captureException(error)
    },
  },
})
</script>
```

### Vue 2

```vue
<script>
export default {
  methods: {
    handleError(error) {
      this.$nadi.captureException(error)
    },
  },
}
</script>
```

## Vue Router Integration

### Track Navigation

```javascript
// router/index.js
import { createRouter } from 'vue-router'
import { addBreadcrumb } from '@nadi-pro/browser'

const router = createRouter({
  // ... config
})

router.beforeEach((to, from) => {
  addBreadcrumb({
    category: 'navigation',
    message: `Navigating to ${to.path}`,
    level: 'info',
    data: {
      from: from.path,
      to: to.path,
      params: to.params,
    },
  })
})

export default router
```

### Track Navigation Errors

```javascript
router.onError((error, to, from) => {
  captureException(error, {
    tags: {
      type: 'navigation',
    },
    extra: {
      to: to.fullPath,
      from: from.fullPath,
    },
  })
})
```

## Pinia Integration

### Track Store Actions

```javascript
// stores/index.js
import { createPinia } from 'pinia'
import { addBreadcrumb } from '@nadi-pro/browser'

const pinia = createPinia()

pinia.use(({ store }) => {
  store.$onAction(({ name, args, after, onError }) => {
    addBreadcrumb({
      category: 'pinia.action',
      message: `${store.$id}.${name}`,
      level: 'info',
    })

    onError((error) => {
      addBreadcrumb({
        category: 'pinia.action',
        message: `${store.$id}.${name} failed`,
        level: 'error',
        data: { error: error.message },
      })
    })
  })
})

export default pinia
```

## Vuex Integration

### Plugin

```javascript
// store/plugins/nadi.js
import { addBreadcrumb } from '@nadi-pro/browser'

export function nadiPlugin(store) {
  store.subscribe((mutation, state) => {
    addBreadcrumb({
      category: 'vuex.mutation',
      message: mutation.type,
      level: 'info',
      data: {
        type: mutation.type,
        payload: mutation.payload,
      },
    })
  })
}

// store/index.js
import { createStore } from 'vuex'
import { nadiPlugin } from './plugins/nadi'

export default createStore({
  plugins: [nadiPlugin],
  // ... modules
})
```

## User Context

### After Authentication

```javascript
// composables/useAuth.js
import { ref, watch } from 'vue'
import { setUser } from '@nadi-pro/browser'

export function useAuth() {
  const user = ref(null)

  watch(user, (newUser) => {
    if (newUser) {
      setUser({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      })
    } else {
      setUser(null)
    }
  })

  return { user }
}
```

## Form Tracking

### Track Form Submissions

```vue
<script setup>
import { addBreadcrumb, captureException } from '@nadi-pro/browser'

async function submitForm(formData) {
  addBreadcrumb({
    category: 'form',
    message: 'Form submission started',
    data: { formId: 'contact-form' },
  })

  try {
    await api.submitForm(formData)
    addBreadcrumb({
      category: 'form',
      message: 'Form submission successful',
    })
  } catch (error) {
    captureException(error, {
      tags: { form: 'contact' },
    })
    throw error
  }
}
</script>
```

## Testing

### Mock Plugin

```javascript
// tests/mocks/nadi.js
export const NadiPlugin = {
  install(app) {
    app.config.globalProperties.$nadi = {
      captureException: vi.fn(),
      addBreadcrumb: vi.fn(),
    }
    app.provide('$nadi', app.config.globalProperties.$nadi)
  },
}
```

### Test Component

```javascript
import { mount } from '@vue/test-utils'
import { NadiPlugin } from './mocks/nadi'

test('captures error on submit', async () => {
  const wrapper = mount(MyForm, {
    global: {
      plugins: [NadiPlugin],
    },
  })

  await wrapper.find('form').trigger('submit')

  expect(wrapper.vm.$nadi.captureException).toHaveBeenCalled()
})
```

## Nuxt.js

See [Nuxt.js Integration](/sdks/javascript/nextjs#nuxtjs-alternative) for Nuxt-specific setup.

## Best Practices

### Do

- Use the plugin for automatic error capture
- Track route navigation
- Set user context after auth
- Use error boundaries for isolation

### Don't

- Catch errors silently
- Put sensitive data in breadcrumbs
- Over-track (creates noise)
- Forget to test error handling

## Troubleshooting

### Plugin Not Working

Ensure plugin is registered before mounting:

```javascript
const app = createApp(App)
app.use(NadiPlugin) // Before mount
app.mount('#app')
```

### Errors Not Captured

Check Vue version compatibility:
- `@nadi-pro/vue@3.x` for Vue 3
- `@nadi-pro/vue@2.x` for Vue 2

## Next Steps

- [Angular Integration](/sdks/javascript/angular) - Angular setup
- [Source Maps](/sdks/javascript/source-maps) - Debug minified code
- [Breadcrumbs](/sdks/javascript/breadcrumbs) - Track user actions
