# Web Vitals

Monitor Core Web Vitals and real user performance metrics.

## Overview

Web Vitals are Google's metrics for measuring real-world user experience. Nadi automatically captures these metrics to help you understand and improve your site's performance.

## Core Web Vitals

| Metric | Full Name | Good | Needs Improvement | Poor |
|--------|-----------|------|-------------------|------|
| **LCP** | Largest Contentful Paint | ≤ 2.5s | 2.5s - 4s | > 4s |
| **FID** | First Input Delay | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** | Cumulative Layout Shift | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

## Additional Metrics

| Metric | Full Name | Description |
|--------|-----------|-------------|
| **FCP** | First Contentful Paint | Time to first content render |
| **TTFB** | Time to First Byte | Server response time |
| **INP** | Interaction to Next Paint | Overall responsiveness |

## Configuration

### Enable Web Vitals

```javascript
import { init } from '@nadi-pro/browser'

init({
  appKey: 'your-app-key',
  enableWebVitals: true,
})
```

### Select Specific Metrics

```javascript
init({
  appKey: 'your-app-key',
  enableWebVitals: true,
  webVitals: ['LCP', 'FID', 'CLS'], // Only these metrics
})
```

### Configure Reporting

```javascript
init({
  appKey: 'your-app-key',
  enableWebVitals: true,

  // Report after collecting this many metrics
  webVitalsReportThreshold: 3,

  // Sample rate for Web Vitals (0-1)
  webVitalsSampleRate: 0.1, // 10% of page loads
})
```

## Understanding Each Metric

### LCP (Largest Contentful Paint)

Measures loading performance - when the main content becomes visible.

**What's measured:**
- `<img>` elements
- `<video>` poster images
- Elements with background images
- Text blocks

**Optimization tips:**
- Optimize images (compression, format, lazy loading)
- Use a CDN for static assets
- Implement preloading for critical resources
- Minimize render-blocking CSS/JS

### FID (First Input Delay)

Measures interactivity - time from first interaction to browser response.

**What's measured:**
- Clicks
- Taps
- Key presses

**Optimization tips:**
- Break up long JavaScript tasks
- Use web workers for heavy processing
- Optimize JavaScript execution
- Implement code splitting

### CLS (Cumulative Layout Shift)

Measures visual stability - how much content shifts unexpectedly.

**What's measured:**
- Layout shifts without user interaction
- Shifts of visible content

**Optimization tips:**
- Set explicit dimensions for images/videos
- Reserve space for ads/embeds
- Avoid inserting content above existing content
- Use CSS transform for animations

### FCP (First Contentful Paint)

Time until first content renders.

**Optimization tips:**
- Reduce server response time
- Eliminate render-blocking resources
- Preload critical resources

### TTFB (Time to First Byte)

Server response time.

**Optimization tips:**
- Optimize server-side code
- Use caching
- Use a CDN
- Optimize database queries

## Custom Performance Metrics

Track custom performance metrics:

```javascript
import { recordMetric } from '@nadi-pro/browser'

// Time a specific operation
const start = performance.now()
await fetchDashboardData()
const duration = performance.now() - start

recordMetric({
  name: 'dashboard_load',
  value: duration,
  unit: 'milliseconds',
  tags: {
    user_type: user.type,
  },
})
```

### Using Performance API

```javascript
// Measure with Performance API
performance.mark('api-start')
await apiCall()
performance.mark('api-end')
performance.measure('api-call', 'api-start', 'api-end')

const measure = performance.getEntriesByName('api-call')[0]
recordMetric({
  name: 'api_call_duration',
  value: measure.duration,
})
```

## Viewing Metrics

### Dashboard

In the Nadi dashboard:

1. Navigate to **Performance** or **RUM**
2. View aggregate metrics over time
3. Filter by page, device, or connection
4. Identify pages with poor performance

### With Error Context

Web Vitals are included with error events:

```javascript
{
  "error": { ... },
  "webVitals": {
    "LCP": 2340,
    "FID": 45,
    "CLS": 0.05
  }
}
```

## Segmentation

### By Page

```javascript
// Metrics are automatically tagged with the current URL
// View per-page metrics in the dashboard
```

### By User Type

```javascript
import { setTag } from '@nadi-pro/browser'

// Tag metrics with user information
setTag('user_type', user.subscription)
setTag('country', user.country)
```

### By Device

Automatically captured:
- Device type (mobile, tablet, desktop)
- Connection type (4g, 3g, wifi)
- Browser and version

## Performance Budgets

Alert when metrics exceed thresholds:

```javascript
import { onWebVitalReport } from '@nadi-pro/browser'

onWebVitalReport((metric) => {
  const thresholds = {
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
  }

  if (metric.value > thresholds[metric.name]) {
    console.warn(`${metric.name} exceeded budget: ${metric.value}`)

    // Send alert or log
    captureMessage(`Performance budget exceeded: ${metric.name}`, 'warning', {
      extra: metric,
    })
  }
})
```

## Debugging Performance

### Debug Mode

```javascript
init({
  appKey: 'your-app-key',
  enableWebVitals: true,
  debug: true, // Logs metrics to console
})
```

### Manual Metric Inspection

```javascript
import { getWebVitals } from '@nadi-pro/browser'

const metrics = getWebVitals()
console.log('Current Web Vitals:', metrics)
```

## Integration with Analytics

Send metrics to other analytics tools:

```javascript
import { onWebVitalReport } from '@nadi-pro/browser'

onWebVitalReport((metric) => {
  // Send to Google Analytics
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  })
})
```

## Best Practices

### Do

- Monitor all Core Web Vitals
- Set performance budgets
- Segment by page and user type
- Track trends over time

### Don't

- Ignore poor performance pages
- Over-optimize based on single measurements
- Forget about mobile users
- Dismiss small CLS issues

## Troubleshooting

### Metrics Not Appearing

1. Check `enableWebVitals` is `true`
2. Verify the page fully loads (metrics fire after page interaction)
3. Check browser support (LCP/CLS need Chrome 77+)

### Inconsistent Values

- Web Vitals vary based on device and network
- Focus on percentiles (p75, p95) not averages
- Check for layout shifts from ads/embeds

## Next Steps

- [Session Replay](/sdks/javascript/session-replay) - Replay user sessions
- [Breadcrumbs](/sdks/javascript/breadcrumbs) - Track user actions
- [Source Maps](/sdks/javascript/source-maps) - Debug minified code
