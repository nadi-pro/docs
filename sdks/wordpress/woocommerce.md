# WooCommerce Integration

Enhanced error tracking for WooCommerce stores.

## Overview

The Nadi WordPress plugin includes built-in WooCommerce integration that provides:

- Order-related error tracking
- Payment gateway error capture
- Checkout process monitoring
- Cart and product error tracking

## Automatic Features

When WooCommerce is active, the plugin automatically:

- Tags errors with WooCommerce context
- Captures checkout errors
- Tracks payment failures
- Monitors order processing

## Configuration

### Enable WooCommerce Integration

Via wp-config.php:

```php
define('NADI_WOOCOMMERCE_ENABLED', true);
```

Or via filter:

```php
add_filter('nadi_woocommerce_enabled', '__return_true');
```

### Configure WooCommerce Tags

```php
add_filter('nadi_tags', function($tags) {
    if (function_exists('WC')) {
        $tags['woocommerce_version'] = WC()->version;
        $tags['store_currency'] = get_woocommerce_currency();
    }
    return $tags;
});
```

## Checkout Errors

### Automatic Capture

Checkout errors are automatically captured with context:

```json
{
  "message": "Payment processing failed",
  "tags": {
    "woocommerce": "checkout",
    "payment_gateway": "stripe"
  },
  "extra": {
    "order_id": 12345,
    "order_total": "99.99",
    "payment_method": "stripe",
    "billing_country": "US"
  }
}
```

### Custom Checkout Tracking

```php
add_action('woocommerce_checkout_process', function() {
    nadi_add_breadcrumb([
        'category' => 'woocommerce.checkout',
        'message' => 'Checkout form submitted',
        'data' => [
            'cart_total' => WC()->cart->get_total('edit'),
            'cart_items' => WC()->cart->get_cart_contents_count(),
        ],
    ]);
});
```

## Payment Errors

### Track Payment Failures

```php
add_action('woocommerce_payment_complete_order_status', function($status, $order_id) {
    if ($status === 'failed') {
        $order = wc_get_order($order_id);

        nadi_capture_message('Payment failed', 'error', [
            'tags' => [
                'woocommerce' => 'payment',
                'payment_method' => $order->get_payment_method(),
            ],
            'extra' => [
                'order_id' => $order_id,
                'order_total' => $order->get_total(),
                'customer_id' => $order->get_customer_id(),
            ],
        ]);
    }

    return $status;
}, 10, 2);
```

### Gateway-Specific Tracking

```php
// Track Stripe errors
add_action('wc_stripe_process_payment_error', function($error, $order) {
    nadi_capture_exception($error, [
        'tags' => [
            'payment_gateway' => 'stripe',
            'error_type' => $error->get_error_code(),
        ],
        'extra' => [
            'order_id' => $order->get_id(),
            'stripe_error' => $error->get_error_message(),
        ],
    ]);
}, 10, 2);
```

## Order Errors

### Track Order Status Changes

```php
add_action('woocommerce_order_status_changed', function($order_id, $old_status, $new_status) {
    nadi_add_breadcrumb([
        'category' => 'woocommerce.order',
        'message' => "Order #{$order_id} status changed: {$old_status} → {$new_status}",
        'level' => 'info',
    ]);

    // Capture failed orders
    if ($new_status === 'failed') {
        $order = wc_get_order($order_id);

        nadi_capture_message('Order failed', 'error', [
            'tags' => ['woocommerce' => 'order_failed'],
            'extra' => [
                'order_id' => $order_id,
                'previous_status' => $old_status,
                'order_total' => $order->get_total(),
                'payment_method' => $order->get_payment_method(),
            ],
        ]);
    }
}, 10, 3);
```

### Track Order Processing Errors

```php
add_action('woocommerce_order_status_processing', function($order_id) {
    try {
        // Custom order processing
        process_order($order_id);
    } catch (Exception $e) {
        nadi_capture_exception($e, [
            'tags' => ['woocommerce' => 'order_processing'],
            'extra' => ['order_id' => $order_id],
        ]);
    }
});
```

## Cart Errors

### Track Cart Issues

```php
add_action('woocommerce_add_to_cart', function($cart_item_key, $product_id, $quantity) {
    nadi_add_breadcrumb([
        'category' => 'woocommerce.cart',
        'message' => 'Product added to cart',
        'data' => [
            'product_id' => $product_id,
            'quantity' => $quantity,
        ],
    ]);
}, 10, 3);

add_action('woocommerce_cart_item_removed', function($cart_item_key, $cart) {
    nadi_add_breadcrumb([
        'category' => 'woocommerce.cart',
        'message' => 'Product removed from cart',
    ]);
}, 10, 2);
```

### Track Stock Errors

```php
add_action('woocommerce_product_set_stock_status', function($product_id, $status) {
    if ($status === 'outofstock') {
        nadi_capture_message('Product out of stock', 'warning', [
            'tags' => ['woocommerce' => 'inventory'],
            'extra' => [
                'product_id' => $product_id,
                'product_name' => get_the_title($product_id),
            ],
        ]);
    }
}, 10, 2);
```

## Customer Context

### Enrich User Data

```php
add_filter('nadi_user_context', function($user) {
    if (is_user_logged_in() && function_exists('WC')) {
        $customer = new WC_Customer(get_current_user_id());

        $user['woocommerce'] = [
            'customer_id' => $customer->get_id(),
            'order_count' => $customer->get_order_count(),
            'total_spent' => $customer->get_total_spent(),
            'billing_country' => $customer->get_billing_country(),
        ];
    }

    return $user;
});
```

## API Errors

### Track REST API Errors

```php
add_filter('woocommerce_rest_check_permissions', function($permission, $context, $object_id, $post_type) {
    if (!$permission) {
        nadi_add_breadcrumb([
            'category' => 'woocommerce.api',
            'message' => 'Permission denied',
            'level' => 'warning',
            'data' => [
                'context' => $context,
                'post_type' => $post_type,
            ],
        ]);
    }
    return $permission;
}, 10, 4);
```

## Webhook Errors

### Track Webhook Failures

```php
add_action('woocommerce_webhook_delivery', function($http_args, $response, $duration, $arg, $webhook_id) {
    $response_code = wp_remote_retrieve_response_code($response);

    if ($response_code >= 400 || is_wp_error($response)) {
        nadi_capture_message('Webhook delivery failed', 'error', [
            'tags' => ['woocommerce' => 'webhook'],
            'extra' => [
                'webhook_id' => $webhook_id,
                'response_code' => $response_code,
                'duration' => $duration,
                'error' => is_wp_error($response) ? $response->get_error_message() : null,
            ],
        ]);
    }
}, 10, 5);
```

## Performance Monitoring

### Track Slow Operations

```php
add_action('woocommerce_after_checkout_validation', function() {
    $start = microtime(true);

    add_action('woocommerce_checkout_order_created', function($order) use ($start) {
        $duration = (microtime(true) - $start) * 1000;

        if ($duration > 5000) { // > 5 seconds
            nadi_capture_message('Slow checkout detected', 'warning', [
                'tags' => ['woocommerce' => 'performance'],
                'extra' => [
                    'duration_ms' => $duration,
                    'order_id' => $order->get_id(),
                ],
            ]);
        }
    });
});
```

## Best Practices

### Do

- Track payment failures with gateway context
- Monitor order processing errors
- Capture checkout abandonment signals
- Include order/customer context in errors

### Don't

- Log sensitive payment data (card numbers, CVV)
- Capture every cart update (creates noise)
- Expose customer PII unnecessarily
- Ignore webhook delivery failures

## Troubleshooting

### Orders Not Tracked

1. Verify WooCommerce integration is enabled
2. Check hooks are firing (`woocommerce_*`)
3. Enable debug mode and check logs

### Missing Context

1. Verify WC() is available
2. Check order/customer IDs are valid
3. Review filter hooks for modifications

## Next Steps

- [Configuration](/sdks/wordpress/configuration) - Full configuration reference
- [Error Tracking](/sdks/wordpress/error-tracking) - General error tracking
