---
title: "MQTT Protocol Documentation"
category: "Protocols"
order: 10
---

# 📡 MQTT Protocol Documentation

APIDoc 4.0 provides comprehensive support for documenting MQTT (Message Queuing Telemetry Transport) protocols, making it perfect for IoT systems, real-time messaging, and event-driven architectures.

## 🚀 Overview

### What is MQTT Support?
APIDoc's MQTT support includes:
- **16 specialized MQTT tags** for comprehensive documentation
- **Publish/Subscribe patterns** documentation
- **Quality of Service (QoS)** levels
- **Topic hierarchies** and wildcards
- **Payload schemas** with validation
- **Authentication** and security documentation

### MQTT vs REST
| Feature | REST API | MQTT |
|---------|----------|------|
| **Communication** | Request/Response | Publish/Subscribe |
| **Protocol** | HTTP/HTTPS | MQTT over TCP |
| **Payload** | JSON/XML | Any format |
| **Topics** | URLs | Topic hierarchy |
| **QoS** | Not applicable | 0, 1, 2 levels |

## 📋 Available MQTT Tags

### Core MQTT Tags
| Tag | Description | Example |
|-----|-------------|---------|
| `@mqtt` | Define MQTT operation | `@mqtt {publish} topic Publish data` |
| `@mqttGroup` | Group MQTT operations | `@mqttGroup IoT` |
| `@topic` | Topic pattern | `@topic sensors/{deviceId}/data` |
| `@topicParam` | Topic parameters | `@topicParam {String} deviceId Device ID` |
| `@payload` | Payload description | `@payload {Object} data Sensor data` |
| `@payloadSchema` | Payload schema | `@payloadSchema {SensorData} data` |
| `@qos` | Quality of Service | `@qos 1` |
| `@retain` | Retain message flag | `@retain true` |

### Advanced Tags
| Tag | Description | Example |
|-----|-------------|---------|
| `@auth` | Authentication info | `@auth {Bearer} token JWT token` |
| `@errors` | Error conditions | `@errors Connection lost` |
| `@examplePublish` | Publish example | `@examplePublish {json} Data` |
| `@exampleSubscribe` | Subscribe example | `@exampleSubscribe {json} Response` |
| `@responseExample` | Response format | `@responseExample {json} Success` |
| `@responseTopic` | Response topic | `@responseTopic device/{id}/response` |
| `@ratelimit` | Rate limiting | `@ratelimit 100/minute` |
| `@tags` | Custom tags | `@tags iot,sensors,telemetry` |

## 🔧 Basic Usage

### Simple Publish Operation
```javascript
/**
 * @mqtt {publish} sensors/temperature Device Temperature
 * @mqttGroup IoT
 * @topic sensors/temperature
 * @payload {Object} data Temperature reading
 * @payload {Number} data.value Temperature in Celsius
 * @payload {String} data.unit Temperature unit
 * @payload {Number} data.timestamp Unix timestamp
 * @qos 1
 * @retain false
 *
 * @examplePublish {json} Temperature Data:
 * {
 *   "value": 23.5,
 *   "unit": "celsius",
 *   "timestamp": 1640995200
 * }
 */
```

### Subscribe Operation
```javascript
/**
 * @mqtt {subscribe} sensors/+/status Device Status Updates
 * @mqttGroup IoT
 * @topic sensors/{deviceId}/status
 * @topicParam {String} deviceId Unique device identifier
 * @payload {Object} status Device status information
 * @payload {String} status.state Device state (online|offline|error)
 * @payload {Number} status.battery Battery percentage (0-100)
 * @payload {String} status.lastSeen ISO timestamp of last activity
 * @qos 2
 *
 * @exampleSubscribe {json} Status Update:
 * {
 *   "state": "online",
 *   "battery": 87,
 *   "lastSeen": "2024-01-15T10:30:00Z"
 * }
 */
```

## 🌐 Advanced Features

### Topic Parameters and Wildcards
```javascript
/**
 * @mqtt {publish} devices/{deviceId}/sensors/{sensorType}/data Sensor Data
 * @mqttGroup IoT Devices
 * @topic devices/{deviceId}/sensors/{sensorType}/data
 * @topicParam {String} deviceId Device unique identifier (alphanumeric)
 * @topicParam {String} sensorType Sensor type (temperature|humidity|pressure)
 *
 * @payload {Object} reading Sensor reading data
 * @payload {Number} reading.value Measured value
 * @payload {String} reading.unit Measurement unit
 * @payload {Number} reading.accuracy Sensor accuracy (0-100%)
 * @payload {String} reading.calibration Last calibration date
 *
 * @qos 1
 * @retain true
 * @ratelimit 10/second
 * @tags iot,sensors,telemetry,monitoring
 */
```

### Payload Schema Integration
```javascript
/**
 * @mqtt {publish} vehicles/{vehicleId}/telemetry Vehicle Telemetry
 * @mqttGroup Vehicle Tracking
 * @topic vehicles/{vehicleId}/telemetry
 * @topicParam {String} vehicleId Vehicle VIN or fleet ID
 *
 * @payloadSchema {VehicleTelemetry} telemetry
 * @payloadSchemaFile ./schemas/vehicle-telemetry.ts
 *
 * @qos 1
 * @retain false
 *
 * @examplePublish {json} Telemetry Data:
 * {
 *   "location": {
 *     "latitude": 40.7128,
 *     "longitude": -74.0060,
 *     "altitude": 10.5
 *   },
 *   "speed": 65.5,
 *   "fuel": 75.2,
 *   "engine": {
 *     "temperature": 195,
 *     "rpm": 2500,
 *     "status": "normal"
 *   }
 * }
 */
```

### Request/Response Pattern
```javascript
/**
 * @mqtt {publish} commands/{deviceId}/execute Remote Command Execution
 * @mqttGroup Device Control
 * @topic commands/{deviceId}/execute
 * @topicParam {String} deviceId Target device identifier
 *
 * @payload {Object} command Command to execute
 * @payload {String} command.action Command action (restart|update|configure)
 * @payload {Object} command.parameters Command parameters
 * @payload {String} command.requestId Unique request identifier
 *
 * @responseTopic commands/{deviceId}/response
 * @responseExample {json} Command Response:
 * {
 *   "requestId": "cmd_123456",
 *   "status": "success",
 *   "result": {
 *     "executionTime": 1500,
 *     "output": "Device restarted successfully"
 *   },
 *   "timestamp": "2024-01-15T10:30:00Z"
 * }
 *
 * @qos 2
 * @errors Device offline,Invalid command,Execution timeout
 */
```

## 🔐 Authentication & Security

### JWT Authentication
```javascript
/**
 * @mqtt {publish} secure/data/{userId} Secure Data Upload
 * @mqttGroup Secure Operations
 * @topic secure/data/{userId}
 * @topicParam {String} userId Authenticated user ID
 *
 * @auth {JWT} token JWT authentication token required
 * @auth {Scope} write:data Required scope for data writing
 *
 * @payload {Object} data Encrypted data payload
 * @payload {String} data.encrypted Base64 encoded encrypted content
 * @payload {String} data.algorithm Encryption algorithm used
 * @payload {String} data.keyId Key identifier for decryption
 *
 * @qos 2
 * @retain false
 * @ratelimit 50/minute
 */
```

### Certificate-Based Authentication
```javascript
/**
 * @mqtt {subscribe} admin/system/+ System Administration
 * @mqttGroup Administration
 * @topic admin/system/{component}
 * @topicParam {String} component System component (logs|metrics|alerts)
 *
 * @auth {Certificate} clientCert X.509 client certificate required
 * @auth {Permission} admin Administrative permissions required
 *
 * @qos 2
 * @errors Insufficient permissions,Certificate expired,Invalid certificate
 */
```

## 📊 Quality of Service (QoS)

### QoS Levels
```javascript
/**
 * @mqtt {publish} notifications/user/{userId} User Notifications
 * @mqttGroup Notifications
 * @topic notifications/user/{userId}
 * @topicParam {String} userId Target user identifier
 *
 * @payload {Object} notification Notification data
 * @payload {String} notification.type Notification type
 * @payload {String} notification.title Notification title
 * @payload {String} notification.message Notification message
 * @payload {String} notification.priority Priority level (low|normal|high|urgent)
 *
 * @qos 0 Fire and forget - best effort delivery
 * @retain false
 *
 * @examplePublish {json} Notification:
 * {
 *   "type": "system_alert",
 *   "title": "System Maintenance",
 *   "message": "Scheduled maintenance in 30 minutes",
 *   "priority": "normal"
 * }
 */

/**
 * @mqtt {publish} orders/{orderId}/status Order Status Update
 * @mqttGroup E-commerce
 * @topic orders/{orderId}/status
 * @topicParam {String} orderId Order identifier
 *
 * @payload {Object} status Order status information
 * @payload {String} status.state New order state
 * @payload {String} status.updatedAt Update timestamp
 *
 * @qos 1 At least once delivery guaranteed
 * @retain true
 */

/**
 * @mqtt {publish} payments/{transactionId}/confirmation Payment Confirmation
 * @mqttGroup Financial
 * @topic payments/{transactionId}/confirmation
 * @topicParam {String} transactionId Transaction identifier
 *
 * @payload {Object} confirmation Payment confirmation data
 * @payload {Number} confirmation.amount Transaction amount
 * @payload {String} confirmation.status Payment status
 *
 * @qos 2 Exactly once delivery guaranteed
 * @retain true
 */
```

## 🔄 Real-World Examples

### IoT Sensor Network
```javascript
/**
 * @mqtt {publish} factory/sensors/{zoneId}/{sensorType} Factory Sensor Data
 * @mqttGroup Factory Automation
 * @topic factory/sensors/{zoneId}/{sensorType}
 * @topicParam {String} zoneId Factory zone identifier (A1-Z9)
 * @topicParam {String} sensorType Sensor type (temperature|pressure|vibration|air_quality)
 *
 * @payload {Object} reading Sensor reading
 * @payload {Number} reading.value Measured value
 * @payload {String} reading.unit Measurement unit
 * @payload {Number} reading.timestamp Unix timestamp
 * @payload {Object} reading.metadata Additional sensor metadata
 * @payload {String} reading.metadata.sensorId Physical sensor identifier
 * @payload {String} reading.metadata.calibration Last calibration date
 * @payload {Number} reading.metadata.accuracy Accuracy percentage
 *
 * @qos 1
 * @retain true
 * @ratelimit 1/second
 * @tags factory,iot,sensors,automation
 *
 * @examplePublish {json} Temperature Reading:
 * {
 *   "value": 85.6,
 *   "unit": "celsius",
 *   "timestamp": 1640995200,
 *   "metadata": {
 *     "sensorId": "TEMP_A1_001",
 *     "calibration": "2024-01-01",
 *     "accuracy": 99.2
 *   }
 * }
 */
```

### Smart Home Automation
```javascript
/**
 * @mqtt {subscribe} home/{roomId}/devices/+/status Smart Device Status
 * @mqttGroup Smart Home
 * @topic home/{roomId}/devices/{deviceType}/status
 * @topicParam {String} roomId Room identifier (living_room|bedroom|kitchen)
 * @topicParam {String} deviceType Device type (lights|thermostat|security|audio)
 *
 * @payload {Object} status Device status
 * @payload {Boolean} status.online Device connectivity status
 * @payload {String} status.state Current device state
 * @payload {Object} status.settings Current device settings
 * @payload {Number} status.battery Battery level (if applicable)
 * @payload {String} status.firmware Firmware version
 *
 * @qos 1
 * @retain true
 *
 * @exampleSubscribe {json} Thermostat Status:
 * {
 *   "online": true,
 *   "state": "heating",
 *   "settings": {
 *     "targetTemp": 22,
 *     "currentTemp": 20.5,
 *     "mode": "auto"
 *   },
 *   "firmware": "v2.1.4"
 * }
 */
```

## 🛠️ CLI Options for MQTT

### MQTT-Specific Generation
```bash
# Generate only MQTT documentation
apidoc -i src/ -o docs/ --mqtt-only

# Fail on MQTT schema errors
apidoc -i src/ -o docs/ --fail-on-mqtt-schema-error

# Enable MQTT debugging
apidoc -i src/ -o docs/ --debug --verbose
```

### Configuration in apidoc.json
```json
{
  "mqtt": {
    "enabled": true,
    "onlyMqtt": false,
    "failOnSchemaError": true,
    "brokerUrl": "mqtt://broker.example.com:1883",
    "defaultQos": 1,
    "showRetain": true,
    "groupSeparately": true
  }
}
```

## 📈 Best Practices

### 1. Topic Design
```javascript
// ✅ Good: Hierarchical and descriptive
@topic sensors/building1/floor2/room203/temperature

// ❌ Avoid: Flat structure
@topic temp_building1_floor2_room203

// ✅ Good: Use parameters for dynamic parts
@topic sensors/{buildingId}/floor/{floorId}/room/{roomId}/temperature
```

### 2. Payload Documentation
```javascript
// ✅ Good: Complete payload documentation
@payload {Object} data Sensor data container
@payload {Number} data.value Temperature reading in Celsius
@payload {String} data.timestamp ISO 8601 timestamp
@payload {Object} data.metadata Additional sensor information

// ❌ Incomplete: Missing details
@payload {Object} data Some data
```

### 3. QoS Selection
- **QoS 0**: Sensor readings, logs, non-critical data
- **QoS 1**: Important notifications, status updates
- **QoS 2**: Financial transactions, critical commands

### 4. Error Handling
```javascript
@errors Connection timeout,Invalid payload format,Topic not authorized,Broker unavailable
```

MQTT documentation in APIDoc 4.0 provides comprehensive tools for documenting IoT systems, real-time messaging, and event-driven architectures with professional-grade documentation standards.