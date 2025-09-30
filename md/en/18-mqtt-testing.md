# 18. Interactive MQTT Testing

APIDoc v5 includes a powerful **interactive MQTT client** that allows you to test MQTT endpoints directly in your documentation with real broker connections.

## Table of Contents
- [Overview](#overview)
- [Configuration](#configuration)
- [Security Features](#security-features)
- [Using the MQTT Client](#using-the-mqtt-client)
- [MQTT Operations](#mqtt-operations)
- [Message Log](#message-log)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The interactive MQTT testing feature provides:

- ✅ **Real Broker Connections** - Connect to actual MQTT brokers using WebSocket or native protocols
- 🔐 **Secure by Default** - Credentials are masked and never exposed in the UI
- 📡 **Full Protocol Support** - PUBLISH, SUBSCRIBE, and INLINE operations
- 🎯 **QoS Levels** - Support for Quality of Service levels 0, 1, and 2
- 🔒 **SSL/TLS** - Complete SSL/TLS support with certificates
- 📨 **Real-Time Messages** - Live message log with timestamps

## Configuration

### Basic MQTT Configuration

Add MQTT configuration to your `apidoc.json`:

```json
{
  "mqtt": {
    "enabled": true,
    "broker": {
      "host": "mqtt.example.com",
      "port": 8883,
      "protocol": "wss"
    },
    "authentication": {
      "username": "demo-user",
      "password": "demo-pass",
      "clientId": "apidoc-mqtt-client"
    },
    "ssl": {
      "enabled": true,
      "rejectUnauthorized": true
    },
    "options": {
      "keepalive": 60,
      "connectTimeout": 30000,
      "reconnectPeriod": 1000,
      "clean": true
    }
  }
}
```

### Configuration Options

#### Broker Settings
| Field | Type | Description |
|-------|------|-------------|
| `host` | string | MQTT broker hostname |
| `port` | number | MQTT broker port |
| `protocol` | string | Protocol: `ws`, `wss`, `mqtt`, `mqtts` |

#### Authentication
| Field | Type | Description |
|-------|------|-------------|
| `username` | string | MQTT username |
| `password` | string | MQTT password |
| `clientId` | string | Unique client identifier |

#### SSL/TLS Options
| Field | Type | Description |
|-------|------|-------------|
| `enabled` | boolean | Enable SSL/TLS |
| `rejectUnauthorized` | boolean | Verify server certificates |
| `ca` | string | CA certificate (PEM format) |
| `cert` | string | Client certificate (PEM format) |
| `key` | string | Client private key (PEM format) |

#### Connection Options
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `keepalive` | number | 60 | Keepalive interval (seconds) |
| `connectTimeout` | number | 30000 | Connection timeout (ms) |
| `reconnectPeriod` | number | 1000 | Reconnect interval (ms) |
| `clean` | boolean | true | Clean session flag |

## Security Features

### Credential Masking

When MQTT configuration is provided in `apidoc.json`, **sensitive information is automatically hidden**:

- ✅ **Usernames** - Displayed as `••••••••`
- ✅ **Passwords** - Displayed as `••••••••`
- ✅ **Private Keys** - Hidden with placeholder
- ✅ **Certificates** - Masked with "Configurado" badge

### Security Disclaimer

When configuration is preconfigured, users see a blue banner:

```
🔵 Configuración Preestablecida

Esta conexión MQTT ya está configurada con credenciales seguras.
La información sensible como contraseñas y claves privadas está
oculta por seguridad. Puedes probar la conexión directamente en
la pestaña "Probar".
```

### Read-Only Mode

Preconfigured sensitive fields are:
- ❌ **Disabled** - Cannot be edited
- 🔒 **Masked** - Values hidden from view
- ✅ **Functional** - Still used for connections

## Using the MQTT Client

### 1. Configuration Tab

The **Configuración** tab shows:

- **Broker Settings** - Host, port, protocol (editable)
- **Authentication** - Username, password, client ID (masked if preconfigured)
- **SSL/TLS** - Certificate settings (masked if preconfigured)
- **Save Button** - Save configuration to localStorage

### 2. Testing Tab (Probar)

The **Probar** tab provides:

#### Connection Controls
- 🟢 **Connect** - Establish connection to broker
- 🔴 **Disconnect** - Close connection

#### MQTT Operations
- 🔵 **Publish** - Send message to topic (PUBLISH/INLINE endpoints)
- 🟣 **Subscribe** - Listen to topic (SUBSCRIBE/INLINE endpoints)
- 🟠 **Unsubscribe** - Stop listening to topic

#### Topic Configuration
- **Topic** - MQTT topic path (supports wildcards for subscribe)
- **QoS** - Quality of Service level (0, 1, or 2)
- **Payload** - Message content (JSON or plain text)

### 3. Connection Status

Real-time status indicators:

- ✅ **Conectado** - Successfully connected (green)
- ❌ **Error** - Connection failed (red)
- ⚠️ **Offline** - Client disconnected (yellow)
- 🔄 **Reconectando** - Attempting reconnection (blue)

## MQTT Operations

### Publishing Messages

1. Select **PUBLISH** or **INLINE** endpoint
2. Go to **Probar** tab
3. Click **Conectar**
4. Enter **Topic** (e.g., `v1/tenant/devices/device-1/telemetry`)
5. Select **QoS** (0, 1, or 2)
6. Enter **Payload**:
   ```json
   {
     "ts": "2025-09-30T10:00:00Z",
     "metrics": {
       "temperature": 22.5,
       "humidity": 65
     }
   }
   ```
7. Click **Publicar**

### Subscribing to Topics

1. Select **SUBSCRIBE** or **INLINE** endpoint
2. Go to **Probar** tab
3. Click **Conectar**
4. Enter **Topic** (supports wildcards):
   - `v1/tenant/devices/+/alerts` (single level)
   - `v1/tenant/devices/#` (multi-level)
5. Select **QoS**
6. Click **Suscribirse**
7. Received messages appear in the **Message Log**

### Unsubscribing

1. While subscribed, the button changes to **Desuscribirse** (orange)
2. Click **Desuscribirse** to stop receiving messages

## Message Log

The message log displays:

- 📨 **Received Messages** - Messages from subscribed topics
- 📤 **Published Messages** - Messages you've sent
- 🔔 **Subscriptions** - Subscribe/unsubscribe events
- ⏰ **Timestamps** - Time of each event
- 🎯 **QoS Levels** - Quality of Service for each message

**Log Features:**
- Shows last **50 messages**
- Color-coded by type
- Expandable JSON payloads
- Clear log button

## Examples

### Example 1: IoT Telemetry Publishing

**Configuration:**
```json
{
  "mqtt": {
    "broker": {
      "host": "iot.example.com",
      "port": 8883,
      "protocol": "wss"
    },
    "authentication": {
      "username": "device-001",
      "password": "secret",
      "clientId": "device-001-client"
    },
    "ssl": {
      "enabled": true
    }
  }
}
```

**MQTT Endpoint:**
```javascript
/**
 * @api {publish} v1/{tenant}/devices/{deviceId}/telemetry Publish Telemetry
 * @apiName PublishTelemetry
 * @apiGroup IoT
 * @mqtt publish
 * @topic v1/{tenant}/devices/{deviceId}/telemetry
 * @qos 1
 * @payload application/json Device telemetry data
 */
```

**Usage:**
1. Navigate to endpoint
2. Click **Conectar** (credentials are preconfigured)
3. Topic auto-fills: `v1/my-tenant/devices/device-001/telemetry`
4. Enter payload and click **Publicar**

### Example 2: Alert Subscription

**MQTT Endpoint:**
```javascript
/**
 * @api {subscribe} v1/{tenant}/devices/+/alerts Subscribe to Alerts
 * @apiName SubscribeAlerts
 * @apiGroup IoT
 * @mqtt subscribe
 * @topic v1/{tenant}/devices/+/alerts
 * @qos 1
 */
```

**Usage:**
1. Navigate to endpoint
2. Click **Conectar**
3. Topic: `v1/my-tenant/devices/+/alerts`
4. Click **Suscribirse**
5. View incoming alerts in message log

### Example 3: AWS IoT Core (Certificate Authentication)

**Configuration:**
```json
{
  "mqtt": {
    "broker": {
      "host": "xxxxx-ats.iot.us-east-1.amazonaws.com",
      "port": 443,
      "protocol": "wss"
    },
    "authentication": {
      "clientId": "my-device-001"
    },
    "ssl": {
      "enabled": true,
      "rejectUnauthorized": true,
      "ca": "-----BEGIN CERTIFICATE-----\nMIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF\n...\n-----END CERTIFICATE-----",
      "cert": "-----BEGIN CERTIFICATE-----\nMIIDWjCCAkKgAwIBAgIVAKN0H...\n-----END CERTIFICATE-----",
      "key": "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----"
    }
  }
}
```

**Archivos de Certificados AWS IoT:**
- **CA File**: `AmazonRootCA1.pem` - Root certificate de Amazon
- **Client Certificate**: `certificate.pem.crt` - Certificado del dispositivo
- **Client Key File**: `private.pem.key` - Clave privada del dispositivo

**Características:**
- ✅ No requiere usuario/contraseña
- ✅ Autenticación solo por certificados
- ✅ WebSocket sobre puerto 443
- ✅ Conexión segura con SSL/TLS

**Usage:**
1. Obtener certificados desde AWS IoT Console
2. Copiar contenido de cada certificado al campo correspondiente
3. Client ID debe coincidir con el Thing Name o Policy
4. Connect to AWS IoT broker

### Example 4: Public Broker Testing

**Configuration:**
```json
{
  "mqtt": {
    "broker": {
      "host": "test.mosquitto.org",
      "port": 8081,
      "protocol": "wss"
    },
    "authentication": {
      "clientId": "apidoc-test-client"
    },
    "ssl": {
      "enabled": true,
      "rejectUnauthorized": false
    }
  }
}
```

**Usage:**
- Connect to public test broker
- Publish to: `test/apidoc/demo`
- Subscribe to: `test/apidoc/#`
- Test without authentication

## Troubleshooting

### Connection Issues

**Problem:** Cannot connect to broker

**Solutions:**
1. ✅ Check broker host and port
2. ✅ Verify protocol (ws/wss/mqtt/mqtts)
3. ✅ Check SSL/TLS settings
4. ✅ Verify credentials
5. ✅ Check browser console for errors

### Certificate Errors

**Problem:** SSL/TLS certificate errors

**Solutions:**
1. Set `rejectUnauthorized: false` for self-signed certificates
2. Provide correct CA certificate
3. Verify certificate format (PEM)

### Message Not Received

**Problem:** Subscribed but not receiving messages

**Solutions:**
1. ✅ Verify topic pattern (check wildcards)
2. ✅ Check QoS level compatibility
3. ✅ Ensure publisher is sending to same topic
4. ✅ Check message log for errors

### Browser Compatibility

**Requirements:**
- ✅ Modern browser with WebSocket support
- ✅ HTTPS for wss:// connections
- ✅ CORS configured on broker for WebSocket

### Payload Validation

**Problem:** JSON payload errors

**Solutions:**
1. Validate JSON syntax
2. Use plain text if not JSON
3. Check for special characters
4. Verify encoding (UTF-8)

## Best Practices

### Security
1. ✅ Always use SSL/TLS in production
2. ✅ Never commit passwords to version control
3. ✅ Use environment variables for sensitive data
4. ✅ Rotate credentials regularly
5. ✅ Use client certificates for device authentication

### Performance
1. ⚡ Use appropriate QoS levels
2. ⚡ Clean session for stateless clients
3. ⚡ Implement message throttling
4. ⚡ Monitor connection stability

### Testing
1. 🧪 Test with public brokers first (test.mosquitto.org)
2. 🧪 Verify topics with MQTT explorer tools
3. 🧪 Test different QoS levels
4. 🧪 Validate payload schemas

## Related Documentation

- [MQTT Protocol Support](./10-mqtt.md) - MQTT documentation tags and patterns
- [Configuration Guide](./01-configuration.md) - Complete apidoc.json reference
- [Security Best Practices](./12-authentication.md) - Authentication and security

## Technical Details

### Dependencies
- **mqtt.js** - MQTT client library for browser
- **WebSocket** - Required for ws/wss protocols

### Implementation
- Vue 3 Composition API
- Reactive state management
- Event-driven message handling
- Automatic reconnection
- Clean disconnection on unmount

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**Next:** Learn about [Building and Deployment](./19-build-tools.md)
