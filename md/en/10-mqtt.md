# 📡 MQTT Protocol

APIDoc 5.0.0 introduces complete support for documenting MQTT protocols, enabling you to document publish/subscribe patterns alongside traditional REST APIs.

## 🚀 MQTT Introduction in APIDoc

MQTT (Message Queuing Telemetry Transport) is a lightweight messaging protocol for machine-to-machine (M2M) communication and Internet of Things (IoT).

### Main Features

- **📡 Complete MQTT documentation** - 16 specialized tags for MQTT
- **🎨 Distinctive UI** - Purple theme for MQTT endpoints
- **🏷️ Enriched tags** - Support for topics, QoS, retain flags, authentication
- **🔄 Interactive templates** - Collapsible documentation with complete details
- **📋 Smart grouping** - Automatic separation of MQTT and REST documentation
- **💡 IoT ready** - Perfect for IoT devices, real-time systems

## 🎯 Quick Example

```javascript
/**
 * @api {publish} v1/{tenant}/devices/{deviceId}/telemetry Publish Device Telemetry
 * @apiName PublishTelemetry
 * @mqttGroup Mqtt
 * @mqtt publish
 * @topic v1/{tenant}/devices/{deviceId}/telemetry
 * @topicParam {String} tenant Tenant identifier (slug format)
 * @topicParam {String} deviceId Unique device identifier
 * @qos 1
 * @retain false
 * @auth username Device credentials with TLS recommended
 * @payload application/json Telemetry with multiple sensor channels
 * @payloadSchema inline
 * {
 *   "$schema": "http://json-schema.org/draft-07/schema#",
 *   "type": "object",
 *   "required": ["ts","metrics"],
 *   "properties": {
 *     "ts": { "type": "string", "format": "date-time" },
 *     "metrics": {
 *       "type": "object",
 *       "additionalProperties": { "type": "number" }
 *     }
 *   }
 * }
 * @ratelimit 10/second Maximum telemetry frequency per device
 * @tags telemetry sensor iot-data
 * @examplePublish
 * mosquitto_pub -h mqtt.example.com -p 8883 \
 *   -u "acme:device-42" -P "secret123" \
 *   -t "v1/acme/devices/device-42/telemetry" \
 *   -q 1 \
 *   -m '{"ts":"2025-01-27T20:34:00Z","metrics":{"temp":22.5,"humidity":57}}'
 */
export function publishTelemetry() {
    // Implementation would handle MQTT publishing
}
```

## 🏷️ Complete MQTT Tags

### Main Tags

| Tag | Syntax | Description | Example |
|-----|--------|-------------|---------|
| `@mqtt` | `{publish\|subscribe\|inline}` | MQTT operation type | `@mqtt publish` |
| `@mqttGroup` | `{String}` | Groups MQTT endpoints separately | `@mqttGroup IoT` |
| `@topic` | `{String}` | MQTT topic pattern with parameters | `@topic v1/{tenant}/devices/{id}/data` |
| `@topicParam` | `{Type} name Description` | Topic parameter documentation | `@topicParam {String} tenant Tenant ID` |

### Configuration Tags

| Tag | Syntax | Description | Example |
|-----|--------|-------------|---------|
| `@qos` | `{Number}` | Quality of Service level (0,1,2) | `@qos 1` |
| `@retain` | `{Boolean}` | Message retention flag | `@retain true` |
| `@auth` | `{String}` | Authentication method | `@auth username Device credentials` |

### Payload Tags

| Tag | Syntax | Description | Example |
|-----|--------|-------------|---------|
| `@payload` | `{MIME} Description` | Message payload format | `@payload application/json Sensor data` |
| `@payloadSchema` | `{Type}` | JSON Schema for payload validation | `@payloadSchema inline` |
| `@responseTopic` | `{String}` | Response topic pattern | `@responseTopic v1/{tenant}/ack` |
| `@responseExample` | `data` | Response payload examples | JSON response data |

### Example Tags

| Tag | Syntax | Description | Example |
|-----|--------|-------------|---------|
| `@examplePublish` | `command` | Publish command examples | `mosquitto_pub -h broker...` |
| `@exampleSubscribe` | `command` | Subscribe command examples | `mosquitto_sub -h broker...` |

### Additional Tags

| Tag | Syntax | Description | Example |
|-----|--------|-------------|---------|
| `@ratelimit` | `{String}` | Rate limiting rules | `@ratelimit 10/second` |
| `@errors` | `{String}` | Error scenarios | `@errors Connection refused` |
| `@tags` | `{String}` | MQTT-specific tags | `@tags telemetry iot sensor` |

## 🔄 MQTT Operation Types

### Publish Operations

Document how to publish messages to a topic:

```javascript
/**
 * @api {publish} v1/sensors/{id}/data Publish Sensor Data
 * @apiName PublishSensorData
 * @mqttGroup Sensors
 * @mqtt publish
 * @topic v1/sensors/{id}/data
 * @topicParam {String} id Sensor unique identifier
 * @qos 1
 * @retain false
 * @payload application/json Sensor reading data
 * @auth username Sensor credentials required
 *
 * @examplePublish
 * mosquitto_pub -h mqtt.example.com -p 1883 \
 *   -u "sensor-001" -P "secret123" \
 *   -t "v1/sensors/temp-01/data" \
 *   -q 1 \
 *   -m '{"temperature": 22.5, "humidity": 65, "timestamp": "2023-01-15T10:30:00Z"}'
 */
```

### Subscribe Operations

Document how to subscribe to topics:

```javascript
/**
 * @api {subscribe} v1/alerts/+ Subscribe to All Alerts
 * @apiName SubscribeAlerts
 * @mqttGroup Notifications
 * @mqtt subscribe
 * @topic v1/alerts/+
 * @qos 2
 * @retain false
 * @payload application/json Alert notification data
 *
 * @exampleSubscribe
 * mosquitto_sub -h mqtt.example.com -p 1883 \
 *   -u "admin" -P "adminpass" \
 *   -t "v1/alerts/+" \
 *   -q 2
 *
 * @responseExample {json} Alert Message:
 * {
 *   "alertId": "alert-123",
 *   "type": "temperature",
 *   "severity": "high",
 *   "message": "Temperature exceeds threshold",
 *   "timestamp": "2023-01-15T10:35:00Z",
 *   "deviceId": "sensor-001"
 * }
 */
```

### Inline Documentation

For configuration topics or general documentation:

```javascript
/**
 * @api {inline} v1/config/# Configuration Topics
 * @apiName ConfigurationTopics
 * @mqttGroup Configuration
 * @mqtt inline
 * @topic v1/config/#
 * @retain true
 * @payload application/json Configuration data
 * @auth admin Admin credentials required
 *
 * @apiDescription This topic hierarchy contains system configuration
 * messages that are retained by the broker. Clients can subscribe
 * to receive current configuration upon connection.
 */
```

## 🎨 Visual Features

### Distinctive Purple Theme

- **🟣 Purple color** for MQTT endpoints
- **📊 Method badges** clear for publish/subscribe/inline
- **🎯 Topic visualization** with parameter highlighting
- **📊 QoS indicators** quality of service levels
- **🔄 Retain flags** message retention status
- **📱 Responsive** perfect display on mobile and desktop

### UI Elements

- **Distinctive headers** with MQTT icons
- **Collapsible sections** for detailed information
- **Syntax highlighting** for command examples
- **Organized tables** for parameters and responses
- **Informative badges** for QoS, retain, auth

## 🌟 Use Cases

### 🏭 IoT Platforms

```javascript
/**
 * @api {publish} industrial/{site}/machines/{machineId}/status Machine Status Update
 * @mqttGroup Industrial
 * @mqtt publish
 * @topic industrial/{site}/machines/{machineId}/status
 * @topicParam {String} site Industrial site identifier
 * @topicParam {String} machineId Machine unique identifier
 * @qos 1
 * @retain true
 * @payload application/json Machine operational status
 * @ratelimit 1/minute Status update frequency
 */
```

### 📱 Real-time Apps

```javascript
/**
 * @api {subscribe} chat/{roomId}/messages Subscribe to Chat Messages
 * @mqttGroup Chat
 * @mqtt subscribe
 * @topic chat/{roomId}/messages
 * @topicParam {String} roomId Chat room identifier
 * @qos 0
 * @retain false
 * @payload application/json Chat message data
 */
```

### 🔧 Microservices

```javascript
/**
 * @api {publish} services/{serviceId}/events/{eventType} Service Event
 * @mqttGroup Microservices
 * @mqtt publish
 * @topic services/{serviceId}/events/{eventType}
 * @topicParam {String} serviceId Microservice identifier
 * @topicParam {String} eventType Event type (created, updated, deleted)
 * @qos 1
 * @retain false
 * @payload application/json Event payload data
 */
```

### 🏠 Smart Home

```javascript
/**
 * @api {publish} home/{room}/devices/{deviceId}/command Device Command
 * @mqttGroup SmartHome
 * @mqtt publish
 * @topic home/{room}/devices/{deviceId}/command
 * @topicParam {String} room Room identifier (living-room, kitchen, etc.)
 * @topicParam {String} deviceId Device unique identifier
 * @qos 1
 * @retain false
 * @payload application/json Device command data
 */
```

## 📊 MQTT Configuration

### Broker Configuration

```javascript
/**
 * @api {inline} broker/config MQTT Broker Configuration
 * @mqttGroup System
 * @mqtt inline
 *
 * @apiDescription MQTT Broker Configuration:
 * - **Host**: mqtt.example.com
 * - **Ports**: 1883 (unsecured), 8883 (TLS)
 * - **WebSocket**: 9001 (unsecured), 9443 (TLS)
 * - **Max QoS**: 2
 * - **Retain Support**: Yes
 * - **Clean Session**: Supported
 */
```

### Authentication Schemes

```javascript
/**
 * @auth username Username/password authentication required
 * @auth certificate X.509 client certificates
 * @auth token JWT token in username field
 * @auth oauth OAuth 2.0 integration
 */
```

## 🔧 Integration with REST APIs

You can document MQTT and REST in the same project:

```javascript
// REST API
/**
 * @api {post} /api/devices Create Device
 * @apiName CreateDevice
 * @apiGroup Devices
 */

// MQTT API
/**
 * @api {subscribe} devices/{id}/telemetry Device Telemetry
 * @apiName DeviceTelemetry
 * @mqttGroup MQTT
 * @mqtt subscribe
 */
```

## 📚 Additional Resources

- **[📋 Configuration](./01-configuration.md)** - General APIDoc configuration
- **[📖 APIDoc Parameters](./05-apidoc-params.md)** - Complete parameter reference
- **[📝 Examples](./06-examples.md)** - More practical examples

## 💡 Best Practices

### Naming Conventions

- **Hierarchical topics**: `company/department/device/metric`
- **Descriptive parameters**: Use clear names for `{deviceId}`, `{sensorType}`
- **Consistency**: Maintain a consistent naming scheme

### Complete Documentation

- **Appropriate QoS**: Document QoS level according to criticality
- **Retain flags**: Specify when to use retain=true
- **Rate limiting**: Document frequency limitations
- **Real examples**: Use functional mosquitto_pub/sub commands

### Security

- **Authentication**: Always document auth requirements
- **TLS**: Recommend TLS for production
- **Permissions**: Document ACLs and topic permissions
