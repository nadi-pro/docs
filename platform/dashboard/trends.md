# Trends

Analyze error patterns over time to understand the health of your application.

## Overview

The Trends view helps you:

- Identify error spikes
- Track error rates over time
- Compare releases
- Understand user impact

## Error Timeline

### Chart Types

- **Area chart** - Total errors over time
- **Line chart** - Compare metrics
- **Bar chart** - Errors by category

### Time Ranges

- Last hour (1-minute intervals)
- Last 24 hours (1-hour intervals)
- Last 7 days (daily intervals)
- Last 30 days (daily intervals)
- Custom range

### Metrics

| Metric | Description |
|--------|-------------|
| **Events** | Total error occurrences |
| **Issues** | Unique error types |
| **Users** | Affected users |
| **Rate** | Errors per request |

## Grouping

### By Issue

See which issues contribute most errors:

```
Issue                               Events    %
─────────────────────────────────────────────────
TypeError: Cannot read 'name'       1,234    45%
ConnectionError: Timeout            567      21%
ValidationError: Invalid email      234       9%
Other (15 issues)                   678      25%
```

### By Release

Compare error rates across releases:

```
Release    Events    Error Rate    Change
───────────────────────────────────────────
v2.1.0     234       0.12%        +0.03%
v2.0.5     456       0.09%        -0.01%
v2.0.4     789       0.10%         base
```

### By Environment

```
Environment    Events    Users    Error Rate
────────────────────────────────────────────
production     1,234     456      0.08%
staging        567       123      0.12%
development    2,345     12       0.45%
```

### By Browser/Device

```
Browser         Events    %
────────────────────────────
Chrome 120      567      45%
Safari 17       234      19%
Firefox 120     123      10%
Other           321      26%
```

## Identifying Patterns

### Spike Detection

When error rate increases significantly:

1. **Alert triggered** - If alert configured
2. **Timeline marked** - Visual indicator on chart
3. **Related changes** - Deployments, config changes

### Time-Based Patterns

Identify recurring issues:

- Daily peaks (business hours)
- Weekly patterns (Monday deployments)
- Monthly cycles (billing, reports)

### Release Correlation

See if errors correlate with releases:

1. Deploy markers on timeline
2. Before/after comparison
3. Error delta per release

## Drill Down

### From Trend to Issues

1. Click on a time point
2. See issues active during that period
3. Filter dashboard to that time range

### From Group to Details

1. Click on a release/browser/etc.
2. See all issues for that group
3. Compare with other groups

## Comparison

### Compare Time Periods

- This week vs last week
- This release vs previous
- Before/after a change

### Compare Projects

If you have multiple projects:

- Side-by-side metrics
- Relative error rates
- Shared issues

## Reports

### Scheduled Reports

Receive email reports:

1. Go to **Settings** → **Reports**
2. Configure frequency (daily, weekly)
3. Select recipients
4. Choose metrics

### Export Data

Export trend data:

- CSV for spreadsheets
- JSON for programmatic access
- PDF for presentations

## Alerts Based on Trends

Create alerts for:

- Error rate exceeds threshold
- New issue in release
- Spike detection
- Regression detection

[Configure alerts →](/platform/alerts/rules)

## Best Practices

### Regular Review

- Daily: Check for spikes
- Weekly: Review top issues
- Monthly: Trend analysis
- Per release: Before/after comparison

### Setting Baselines

1. Establish normal error rate
2. Set alert thresholds above baseline
3. Adjust as you fix issues

### Tracking Improvements

- Mark when fixes are deployed
- Compare before/after
- Track error rate reduction

## Next Steps

- [Alerts](/platform/alerts/) - Set up notifications
- [Issues](/platform/dashboard/issues) - Manage issues
