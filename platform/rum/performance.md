# Performance

Analyze page-level and application performance metrics.

## Overview

The Performance view provides insights into:

- Page load times
- Resource loading
- API response times
- User-perceived performance

## Page Performance

### Metrics Per Page

| Metric | Description |
|--------|-------------|
| **Load Time** | Total page load time |
| **TTFB** | Time to First Byte |
| **DOM Ready** | DOMContentLoaded timing |
| **Resources** | Total resource load time |
| **API Calls** | Average API response time |

### Page List

```
Page                Load Time    TTFB     Views     Trend
──────────────────────────────────────────────────────────
/                   1.2s         180ms    45,234    ↓
/products           2.1s         220ms    23,456    →
/products/:id       1.8s         200ms    12,345    ↓
/checkout           2.8s         350ms    5,678     ↑
```

### Slow Pages

Identify pages that need optimization:

1. Sort by load time
2. Filter by traffic (focus on high-impact pages)
3. Compare to benchmarks

## Resource Analysis

### Resource Breakdown

```
Resource Type    Size      Load Time    Count
───────────────────────────────────────────────
JavaScript       450KB     1.2s         12
CSS              85KB      0.3s         3
Images           1.2MB     2.1s         25
Fonts            120KB     0.4s         4
API              -         0.8s         8
```

### Large Resources

Find resources impacting load time:

```
Resource                               Size      Time
───────────────────────────────────────────────────────
/images/hero-banner.jpg                850KB     1.5s
/js/vendor.bundle.js                   320KB     0.8s
/images/product-gallery.jpg            420KB     0.9s
```

### Render-Blocking Resources

Identify resources blocking first paint:

```
Resource                               Type      Impact
───────────────────────────────────────────────────────
/css/main.css                          CSS       High
/js/critical.js                        JS        Medium
https://fonts.googleapis.com/...       Font      Low
```

## API Performance

### Endpoint Performance

```
Endpoint                    Avg Time    p95      Calls
───────────────────────────────────────────────────────
GET /api/products           120ms       250ms    12,345
POST /api/cart              180ms       400ms    5,678
GET /api/user/profile       80ms        150ms    8,901
POST /api/checkout          450ms       1.2s     1,234
```

### Slow Endpoints

Find APIs that need optimization:

1. Sort by p95 latency
2. Identify high-traffic slow endpoints
3. Track trends over time

### Errors by Endpoint

```
Endpoint                    Success    4xx      5xx      Error %
───────────────────────────────────────────────────────────────
POST /api/checkout          1,200      34       12       3.7%
GET /api/inventory          8,500      120      5        1.5%
POST /api/payment           980        45       22       6.4%
```

## Waterfall Analysis

See the loading sequence for a page:

```
Resource                          0s    1s    2s    3s
───────────────────────────────────────────────────────
HTML                              ███
CSS (main.css)                       ████
JS (vendor.js)                          █████
JS (app.js)                                ████
Image (hero.jpg)                           ██████████
Font (roboto.woff2)                     ███
API (profile)                              ██
```

### Identifying Issues

- Long bars = slow resources
- Sequential loading = blocking resources
- Late resources = priority issues

## Performance Budgets

### Set Budgets

Define performance targets:

```
Metric              Budget      Current     Status
────────────────────────────────────────────────────
Total Load Time     3s          2.1s        ✓
JavaScript Size     500KB       450KB       ✓
LCP                 2.5s        2.8s        ✗
API Response (p95)  500ms       380ms       ✓
```

### Budget Alerts

Alert when budgets are exceeded:

1. Go to **Alerts** → **New Rule**
2. Select **Performance Budget**
3. Configure metric and threshold
4. Set notification channel

## Trends

### Performance Over Time

Track improvements and regressions:

```
Week        Load Time    Change
──────────────────────────────────
Jan 21      2.3s         +0.2s
Jan 14      2.1s         -0.1s
Jan 7       2.2s         base
```

### Release Impact

See how deploys affect performance:

```
Release    Load Time    JS Size    API Time
───────────────────────────────────────────────
v2.1.0     2.1s (-5%)   420KB      180ms
v2.0.5     2.2s         450KB      175ms
v2.0.4     2.3s         480KB      190ms
```

## Optimization Recommendations

Based on your data, Nadi suggests:

### High Impact

- Compress images on /products (save 400KB)
- Enable gzip for API responses
- Defer vendor.js loading

### Medium Impact

- Use font-display: swap
- Implement resource hints (preload, prefetch)
- Cache API responses

### Low Impact

- Minimize CSS
- Remove unused JavaScript
- Optimize font loading

## Export Data

Export performance data for:

- Stakeholder reports
- Historical analysis
- Custom dashboards

Formats:
- CSV
- JSON
- PDF report

## Next Steps

- [Web Vitals](/platform/rum/web-vitals) - Core Web Vitals
- [Sessions](/platform/rum/sessions) - User sessions
- [Alerts](/platform/alerts/) - Performance alerts
