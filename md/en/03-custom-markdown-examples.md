---
title: "Custom Markdown Examples & Templates"
category: "Customization"
order: 3.1
---

# 📋 Custom Markdown Examples & Templates

Comprehensive collection of ready-to-use custom markdown templates and examples for APIDoc's custom content system, showcasing advanced formatting and practical use cases.

## 🚀 Quick Start Templates

### Basic Company Overview
```markdown
<!-- content/company-overview.md -->
# Welcome to Our API Documentation

## 🏢 About Our Company

We're a leading technology company providing innovative solutions through our comprehensive REST API. Our platform serves millions of users worldwide with 99.9% uptime and enterprise-grade security.

### Key Features
- **High Performance**: Sub-100ms response times
- **Global Scale**: Available in 15 regions worldwide
- **Enterprise Security**: SOC 2 Type II certified
- **Developer First**: Comprehensive SDKs and tools

## 📞 Support

Need help? Our developer support team is available 24/7:

- **Documentation**: [docs.example.com](https://docs.example.com)
- **Email**: [support@example.com](mailto:support@example.com)
- **Discord**: [Join our community](https://discord.gg/example)
- **GitHub**: [github.com/example/api](https://github.com/example/api)
```

### Getting Started Guide
```markdown
<!-- content/getting-started.md -->
# 🚀 Getting Started

## Prerequisites

Before you begin, ensure you have:

- ✅ An active API account
- ✅ Your API key (get one [here](https://console.example.com))
- ✅ Basic knowledge of REST APIs
- ✅ Your preferred programming language

## Quick Setup

### 1. Authentication

All API requests require authentication using your API key:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.example.com/v1/users
```

### 2. First API Call

Test your setup with a simple GET request:

```javascript
const response = await fetch('https://api.example.com/v1/status', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

### 3. Expected Response

```json
{
  "status": "operational",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Next Steps

1. Explore the [User Management](#Users) endpoints
2. Check out our [SDKs and Libraries](#section-sdks)
3. Join our [Discord community](https://discord.gg/example)
```

## 🎨 Advanced Formatting Examples

### Rich Content with Multimedia
```markdown
<!-- content/multimedia-guide.md -->
# 🎬 Multimedia Integration Guide

## API Overview Video

<div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 2rem 0;">
  <iframe
    src="https://www.youtube.com/embed/API_OVERVIEW_VIDEO_ID"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>

## Architecture Diagram

<div style="text-align: center; margin: 2rem 0;">
  <img src="./assets/api-architecture.svg"
       alt="API Architecture Diagram"
       style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">
</div>

## Interactive Examples

<div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
  <h3>🧪 Try It Live</h3>
  <p>Use our interactive API explorer to test endpoints in real-time:</p>

  <a href="https://api-explorer.example.com"
     style="display: inline-block; background: #007bff; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 4px; font-weight: 600;">
    Launch API Explorer →
  </a>
</div>

## Performance Metrics

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0;">
  <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; text-align: center;">
    <h4 style="margin: 0 0 0.5rem 0; color: #1976d2;">Response Time</h4>
    <p style="font-size: 2rem; font-weight: bold; margin: 0; color: #1976d2;">< 100ms</p>
  </div>

  <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px; text-align: center;">
    <h4 style="margin: 0 0 0.5rem 0; color: #388e3c;">Uptime</h4>
    <p style="font-size: 2rem; font-weight: bold; margin: 0; color: #388e3c;">99.9%</p>
  </div>

  <div style="background: #fff3e0; padding: 1rem; border-radius: 8px; text-align: center;">
    <h4 style="margin: 0 0 0.5rem 0; color: #f57c00;">Requests/Month</h4>
    <p style="font-size: 2rem; font-weight: bold; margin: 0; color: #f57c00;">10M+</p>
  </div>
</div>
```

### Code Showcase with Multiple Languages
```markdown
<!-- content/code-examples.md -->
# 💻 Code Examples

## SDK Examples

<div style="margin: 2rem 0;">

### JavaScript/Node.js

```javascript
// Install: npm install @example/api-client
import { ExampleAPI } from '@example/api-client';

const client = new ExampleAPI({
  apiKey: process.env.EXAMPLE_API_KEY,
  environment: 'production' // or 'sandbox'
});

// Create a new user
const user = await client.users.create({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'member'
});

console.log('User created:', user.id);
```

### Python

```python
# Install: pip install example-api-client
from example_api import ExampleAPI
import os

client = ExampleAPI(
    api_key=os.getenv('EXAMPLE_API_KEY'),
    environment='production'
)

# Create a new user
user = client.users.create(
    name='John Doe',
    email='john@example.com',
    role='member'
)

print(f'User created: {user.id}')
```

### PHP

```php
<?php
// Install: composer require example/api-client
require_once 'vendor/autoload.php';

use Example\ApiClient;

$client = new ApiClient([
    'api_key' => $_ENV['EXAMPLE_API_KEY'],
    'environment' => 'production'
]);

// Create a new user
$user = $client->users->create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'role' => 'member'
]);

echo "User created: " . $user->id;
?>
```

### cURL

```bash
# Create a new user
curl -X POST https://api.example.com/v1/users \
  -H "Authorization: Bearer $EXAMPLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }'
```

</div>
```

## 📊 Dashboard and Analytics

### Metrics Dashboard
```markdown
<!-- content/analytics-dashboard.md -->
# 📊 Analytics Dashboard

## Real-Time Metrics

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px; margin: 2rem 0;">
  <h2 style="margin: 0 0 1rem 0;">🚀 API Performance</h2>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
    <div style="text-align: center;">
      <h3 style="margin: 0; font-size: 2.5rem;">99.9%</h3>
      <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Uptime</p>
    </div>
    <div style="text-align: center;">
      <h3 style="margin: 0; font-size: 2.5rem;">45ms</h3>
      <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Avg Response</p>
    </div>
    <div style="text-align: center;">
      <h3 style="margin: 0; font-size: 2.5rem;">1.2M</h3>
      <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Daily Requests</p>
    </div>
  </div>
</div>

## Usage Analytics

### Top Endpoints
| Endpoint | Requests/Day | Avg Response Time | Success Rate |
|----------|--------------|-------------------|--------------|
| `GET /users` | 245,432 | 23ms | 99.8% |
| `POST /users` | 15,678 | 156ms | 98.9% |
| `GET /users/:id` | 187,234 | 18ms | 99.9% |
| `PUT /users/:id` | 8,945 | 134ms | 97.8% |
| `DELETE /users/:id` | 1,234 | 89ms | 99.2% |

### Error Rates by Status Code

<div style="margin: 2rem 0;">
  <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
    <h4>HTTP Status Code Distribution (Last 24h)</h4>
    <div style="display: flex; align-items: center; margin: 0.5rem 0;">
      <span style="display: inline-block; width: 15px; height: 15px; background: #28a745; margin-right: 0.5rem;"></span>
      <strong>2xx Success:</strong> 98.2%
    </div>
    <div style="display: flex; align-items: center; margin: 0.5rem 0;">
      <span style="display: inline-block; width: 15px; height: 15px; background: #ffc107; margin-right: 0.5rem;"></span>
      <strong>4xx Client Error:</strong> 1.5%
    </div>
    <div style="display: flex; align-items: center; margin: 0.5rem 0;">
      <span style="display: inline-block; width: 15px; height: 15px; background: #dc3545; margin-right: 0.5rem;"></span>
      <strong>5xx Server Error:</strong> 0.3%
    </div>
  </div>
</div>

## Service Health

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 2rem 0;">
  <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem;">
    <h4 style="margin: 0 0 1rem 0; display: flex; align-items: center;">
      <span style="color: #28a745; margin-right: 0.5rem;">●</span>
      API Gateway
    </h4>
    <p style="margin: 0; color: #666;">Operational</p>
    <small style="color: #999;">Last check: 30 seconds ago</small>
  </div>

  <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem;">
    <h4 style="margin: 0 0 1rem 0; display: flex; align-items: center;">
      <span style="color: #28a745; margin-right: 0.5rem;">●</span>
      Database
    </h4>
    <p style="margin: 0; color: #666;">Operational</p>
    <small style="color: #999;">Last check: 15 seconds ago</small>
  </div>

  <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem;">
    <h4 style="margin: 0 0 1rem 0; display: flex; align-items: center;">
      <span style="color: #ffc107; margin-right: 0.5rem;">●</span>
      Cache Layer
    </h4>
    <p style="margin: 0; color: #666;">Degraded Performance</p>
    <small style="color: #999;">Last check: 1 minute ago</small>
  </div>
</div>
```

## 🔧 Integration Guides

### Webhook Configuration
```markdown
<!-- content/webhooks-guide.md -->
# 🔔 Webhooks Integration

## Overview

Webhooks allow your application to receive real-time notifications when specific events occur in our system. Instead of polling our API repeatedly, you can configure webhook endpoints to receive instant updates.

## Supported Events

<div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">

### User Events
- `user.created` - New user registration
- `user.updated` - User profile changes
- `user.deleted` - User account deletion
- `user.suspended` - Account suspension
- `user.reactivated` - Account reactivation

### Payment Events
- `payment.succeeded` - Successful payment
- `payment.failed` - Failed payment attempt
- `payment.refunded` - Payment refund processed
- `payment.dispute` - Chargeback/dispute initiated

### System Events
- `system.maintenance` - Scheduled maintenance
- `system.incident` - Service incident
- `system.recovery` - Service recovery

</div>

## Configuration

### 1. Create Webhook Endpoint

```javascript
// Example webhook endpoint (Express.js)
app.post('/webhooks/example', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-example-signature'];
  const payload = req.body;

  // Verify webhook signature
  if (!verifySignature(payload, signature)) {
    return res.status(401).send('Unauthorized');
  }

  const event = JSON.parse(payload);

  switch (event.type) {
    case 'user.created':
      handleUserCreated(event.data);
      break;
    case 'payment.succeeded':
      handlePaymentSucceeded(event.data);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send('OK');
});
```

### 2. Register Webhook URL

```bash
curl -X POST https://api.example.com/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/example",
    "events": ["user.created", "payment.succeeded"],
    "active": true
  }'
```

### 3. Handle Webhook Events

```python
import hmac
import hashlib
import json

def verify_signature(payload, signature, secret):
    """Verify webhook signature"""
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(f"sha256={expected_signature}", signature)

def handle_webhook(request):
    """Handle incoming webhook"""
    signature = request.headers.get('x-example-signature')
    payload = request.get_data()

    if not verify_signature(payload, signature, WEBHOOK_SECRET):
        return 'Unauthorized', 401

    event = json.loads(payload)

    if event['type'] == 'user.created':
        # Send welcome email
        send_welcome_email(event['data']['user'])
    elif event['type'] == 'payment.succeeded':
        # Activate premium features
        activate_premium(event['data']['user_id'])

    return 'OK', 200
```

## Security Best Practices

<div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
  <h4 style="margin: 0 0 0.5rem 0; color: #856404;">🔐 Security Recommendations</h4>
  <ul style="margin: 0; padding-left: 1.5rem;">
    <li>Always verify webhook signatures</li>
    <li>Use HTTPS for webhook endpoints</li>
    <li>Implement idempotency handling</li>
    <li>Set appropriate timeout values</li>
    <li>Log webhook events for debugging</li>
  </ul>
</div>
```

## 🎯 Interactive Elements

### FAQ Section
```markdown
<!-- content/faq.md -->
# ❓ Frequently Asked Questions

<details style="margin: 1rem 0; border: 1px solid #ddd; border-radius: 8px;">
<summary style="padding: 1rem; background: #f8f9fa; cursor: pointer; font-weight: 600;">
  🔑 How do I get an API key?
</summary>
<div style="padding: 1rem;">
  <p>To get an API key:</p>
  <ol>
    <li>Sign up for an account at <a href="https://console.example.com">console.example.com</a></li>
    <li>Navigate to the "API Keys" section</li>
    <li>Click "Generate New Key"</li>
    <li>Choose your key permissions and expiration</li>
    <li>Copy and securely store your key</li>
  </ol>

  <div style="background: #e3f2fd; padding: 1rem; border-radius: 4px; margin: 1rem 0;">
    <strong>💡 Pro Tip:</strong> Use different API keys for different environments (development, staging, production).
  </div>
</div>
</details>

<details style="margin: 1rem 0; border: 1px solid #ddd; border-radius: 8px;">
<summary style="padding: 1rem; background: #f8f9fa; cursor: pointer; font-weight: 600;">
  ⚡ What are the rate limits?
</summary>
<div style="padding: 1rem;">
  <p>Rate limits vary by plan:</p>

  <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
    <thead>
      <tr style="background: #f8f9fa;">
        <th style="padding: 0.75rem; border: 1px solid #ddd; text-align: left;">Plan</th>
        <th style="padding: 0.75rem; border: 1px solid #ddd; text-align: left;">Requests/Minute</th>
        <th style="padding: 0.75rem; border: 1px solid #ddd; text-align: left;">Requests/Day</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 0.75rem; border: 1px solid #ddd;">Free</td>
        <td style="padding: 0.75rem; border: 1px solid #ddd;">60</td>
        <td style="padding: 0.75rem; border: 1px solid #ddd;">1,000</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; border: 1px solid #ddd;">Pro</td>
        <td style="padding: 0.75rem; border: 1px solid #ddd;">600</td>
        <td style="padding: 0.75rem; border: 1px solid #ddd;">50,000</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; border: 1px solid #ddd;">Enterprise</td>
        <td style="padding: 0.75rem; border: 1px solid #ddd;">Custom</td>
        <td style="padding: 0.75rem; border: 1px solid #ddd;">Custom</td>
      </tr>
    </tbody>
  </table>
</div>
</details>

<details style="margin: 1rem 0; border: 1px solid #ddd; border-radius: 8px;">
<summary style="padding: 1rem; background: #f8f9fa; cursor: pointer; font-weight: 600;">
  🌍 Which regions do you support?
</summary>
<div style="padding: 1rem;">
  <p>Our API is available in multiple regions for optimal performance:</p>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
    <div style="border: 1px solid #ddd; border-radius: 4px; padding: 1rem; text-align: center;">
      <h4 style="margin: 0 0 0.5rem 0;">🇺🇸 US East</h4>
      <p style="margin: 0; font-size: 0.9em; color: #666;">us-east-1.api.example.com</p>
    </div>
    <div style="border: 1px solid #ddd; border-radius: 4px; padding: 1rem; text-align: center;">
      <h4 style="margin: 0 0 0.5rem 0;">🇺🇸 US West</h4>
      <p style="margin: 0; font-size: 0.9em; color: #666;">us-west-1.api.example.com</p>
    </div>
    <div style="border: 1px solid #ddd; border-radius: 4px; padding: 1rem; text-align: center;">
      <h4 style="margin: 0 0 0.5rem 0;">🇪🇺 Europe</h4>
      <p style="margin: 0; font-size: 0.9em; color: #666;">eu-west-1.api.example.com</p>
    </div>
    <div style="border: 1px solid #ddd; border-radius: 4px; padding: 1rem; text-align: center;">
      <h4 style="margin: 0 0 0.5rem 0;">🇦🇺 Asia Pacific</h4>
      <p style="margin: 0; font-size: 0.9em; color: #666;">ap-southeast-1.api.example.com</p>
    </div>
  </div>
</div>
</details>
```

## 📋 Configuration Templates

### apidoc.json with Custom Markdown
```json
{
  "name": "Example API",
  "version": "1.0.0",
  "description": "Comprehensive API with custom content",
  "title": "Example API Documentation",
  "url": "https://api.example.com/v1",
  "sampleUrl": "https://api.example.com/v1",
  "settings": {
    "Welcome": {
      "title": "🏠 Welcome",
      "icon": "fa-home",
      "filename": "./content/company-overview.md"
    },
    "Getting Started": {
      "title": "🚀 Getting Started",
      "icon": "fa-rocket",
      "filename": "./content/getting-started.md"
    },
    "Authentication": {
      "title": "🔐 Authentication",
      "icon": "fa-lock",
      "filename": "./content/auth-guide.md"
    },
    "Users": {
      "title": "👥 User Management",
      "icon": "fa-users"
    },
    "Payments": {
      "title": "💳 Payments",
      "icon": "fa-credit-card"
    },
    "Webhooks": {
      "title": "🔔 Webhooks",
      "icon": "fa-bell",
      "filename": "./content/webhooks-guide.md"
    },
    "SDKs": {
      "title": "📦 SDKs & Libraries",
      "icon": "fa-code",
      "filename": "./content/sdks.md"
    },
    "Analytics": {
      "title": "📊 Analytics",
      "icon": "fa-chart-line",
      "filename": "./content/analytics-dashboard.md"
    },
    "FAQ": {
      "title": "❓ FAQ",
      "icon": "fa-question-circle",
      "filename": "./content/faq.md"
    }
  },
  "order": [
    "Welcome",
    "Getting Started",
    "Authentication",
    "Users",
    "Payments",
    "Webhooks",
    "SDKs",
    "Analytics",
    "FAQ"
  ],
  "template": {
    "withGenerator": false,
    "customCSS": "./assets/custom-styles.css"
  }
}
```

This comprehensive collection provides ready-to-use templates for creating professional, engaging API documentation with APIDoc's custom markdown system.