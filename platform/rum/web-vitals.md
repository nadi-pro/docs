# Web Vitals

Monitor Core Web Vitals to ensure good user experience.

## Core Web Vitals

Google's Core Web Vitals are three metrics that measure user experience:

### LCP (Largest Contentful Paint)

Measures **loading performance**.

| Rating | Time |
|--------|------|
| Good | ≤ 2.5 seconds |
| Needs Improvement | 2.5 - 4 seconds |
| Poor | > 4 seconds |

**What it measures:**
- Time until the largest content element is visible
- Usually an image or text block

**Common issues:**
- Slow server response
- Large images
- Render-blocking resources

### FID (First Input Delay)

Measures **interactivity**.

| Rating | Time |
|--------|------|
| Good | ≤ 100 ms |
| Needs Improvement | 100 - 300 ms |
| Poor | > 300 ms |

**What it measures:**
- Time from first user interaction to browser response
- Clicks, taps, key presses

**Common issues:**
- Long JavaScript tasks
- Heavy main thread work
- Third-party scripts

### CLS (Cumulative Layout Shift)

Measures **visual stability**.

| Rating | Score |
|--------|-------|
| Good | ≤ 0.1 |
| Needs Improvement | 0.1 - 0.25 |
| Poor | > 0.25 |

**What it measures:**
- Unexpected layout shifts during page life
- Content moving after initial render

**Common issues:**
- Images without dimensions
- Ads/embeds without reserved space
- Dynamically injected content

## Dashboard View

### Overview Panel

| Metric | p75 Value | Rating | % Good |
|--------|-----------|--------|--------|
| **LCP** | 2.1s | Good | 84% |
| **FID** | 45ms | Good | 91% |
| **CLS** | 0.05 | Good | 89% |

### Trends

View metrics over time:
- Daily/weekly/monthly trends
- Before/after comparisons
- Release correlations

### Distribution

See the full distribution:
- p50 (median)
- p75 (target)
- p95 (worst cases)
- p99 (outliers)

## Filtering

### By Page

```
Page                LCP      FID      CLS
─────────────────────────────────────────────
/                   1.8s     40ms     0.02
/products           2.4s     55ms     0.12
/checkout           3.1s     120ms    0.08
```

### By Device

```
Device      LCP      FID      CLS
─────────────────────────────────────
Desktop     1.9s     35ms     0.03
Mobile      2.8s     85ms     0.08
Tablet      2.3s     50ms     0.05
```

### By Geography

```
Country     LCP      Sample Size
───────────────────────────────────
US          2.0s     45,234
UK          2.2s     12,456
DE          2.1s     8,901
```

## Analysis

### Identify Problem Pages

Sort pages by:
- Worst LCP
- Worst FID
- Worst CLS

### Compare Releases

```
Release    LCP Change    FID Change    CLS Change
──────────────────────────────────────────────────
v2.1.0     +0.3s ↑      -10ms ↓       +0.02 ↑
v2.0.5     -0.1s ↓      +5ms ↑        -0.01 ↓
```

### Find Root Causes

Click into a specific metric to see:
- Element causing LCP
- Script causing FID
- Element causing CLS shifts

## Optimization

### LCP Improvements

1. **Optimize images**
   - Use modern formats (WebP, AVIF)
   - Implement lazy loading
   - Use responsive images

2. **Improve server response**
   - Enable caching
   - Use a CDN
   - Optimize database queries

3. **Remove render-blocking resources**
   - Defer non-critical JavaScript
   - Inline critical CSS
   - Preload key resources

### FID Improvements

1. **Break up long tasks**
   - Use requestIdleCallback
   - Web Workers for heavy processing
   - Code splitting

2. **Optimize JavaScript**
   - Remove unused code
   - Defer third-party scripts
   - Use async/defer

### CLS Improvements

1. **Set image dimensions**
   ```html
   <img width="600" height="400" src="..." />
   ```

2. **Reserve space for dynamic content**
   ```css
   .ad-container {
     min-height: 250px;
   }
   ```

3. **Avoid inserting content above existing content**

## Alerts

Set up alerts for Web Vitals degradation:

1. Navigate to **Alerts** → **New Rule**
2. Select metric (LCP, FID, CLS)
3. Set threshold
4. Configure notification

Example rule:
- Alert when LCP p75 > 3s for 30 minutes
- Notify via Slack

## Next Steps

- [Sessions](/platform/rum/sessions) - Track user sessions
- [Performance](/platform/rum/performance) - Page performance analysis
