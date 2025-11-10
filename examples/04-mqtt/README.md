# MQTT Protocol Example

## Overview

This example demonstrates complete MQTT protocol documentation for IoT systems using APIDoc v5. It shows how to document both publish and subscribe operations, including topics, payloads, QoS levels, and JSON schemas.

## Parser Used

**Parser**: `mqtt` (MQTT Protocol Parser)

This parser processes MQTT-specific annotations for documenting publish/subscribe operations in IoT and messaging systems. It supports MQTT v3.1.1 and v5.0 protocols.

## How it Works

The `mqtt` parser extracts MQTT-specific documentation from specially formatted comments. It processes these key annotations:

### MQTT-Specific Tags

- `@api {publish|subscribe} topic title` - Defines an MQTT operation
- `@mqtt publish|subscribe` - Specifies operation type
- `@topic` - MQTT topic pattern (supports wildcards)
- `@topicParam` - Parameters in topic template (e.g., `{deviceId}`)
- `@qos 0|1|2` - Quality of Service level
- `@retain true|false` - Message retention flag
- `@auth` - Authentication requirements
- `@payload` - Payload content type
- `@payloadSchema` - JSON Schema for payload validation
- `@ratelimit` - Publishing/subscribing rate limits
- `@tags` - Topic categorization tags
- `@examplePublish` - Publishing example with mosquitto_pub or code

### Quality of Service Levels

- **QoS 0**: At most once delivery (fire and forget)
- **QoS 1**: At least once delivery (acknowledged)
- **QoS 2**: Exactly once delivery (assured)

## Example Code

```javascript
/**
 * @api {publish} home/sensors/temperature Temperature Sensor Data
 * @apiName PublishTemperature
 * @mqttGroup Sensors
 * @apiVersion 1.0.0
 * @apiDescription Publish temperature readings from smart home sensors.
 *
 * @mqtt publish
 * @topic home/sensors/temperature
 * @qos 1
 * @retain true
 * @ratelimit 30s Publishing rate
 * @payload application/json Temperature and humidity data
 * @payloadSchema inline
 * {
 *   "$schema": "http://json-schema.org/draft-07/schema#",
 *   "type": "object",
 *   "required": ["temperature", "deviceId", "timestamp"],
 *   "properties": {
 *     "temperature": { "type": "number", "minimum": -50, "maximum": 100 },
 *     "humidity": { "type": "number", "minimum": 0, "maximum": 100 },
 *     "deviceId": { "type": "string" },
 *     "timestamp": { "type": "integer" }
 *   }
 * }
 * @tags temperature sensor smart-home
 * @examplePublish Temperature Reading:
 * {
 *   "temperature": 22.5,
 *   "humidity": 65,
 *   "deviceId": "TEMP-001",
 *   "timestamp": 1704801600
 * }
 */
function publishTemperatureData() {
  // Implementation: mqtt.publish('home/sensors/temperature', data)
}
```

## Files Structure

```
04-mqtt/
├── apidoc.json          # Configuration file
├── README.md            # This file
└── src/
    ├── sensors.js       # Publisher endpoints (sensors publishing data)
    └── actuators.js     # Subscriber endpoints (actuators receiving commands)
```

## Key Features

- **Publish Operations**: Document sensor data publishing
- **Subscribe Operations**: Document actuator command subscriptions
- **Topic Patterns**: Support for wildcards (`+`, `#`) and parameters (`{deviceId}`)
- **QoS Levels**: Document QoS 0, 1, and 2 requirements
- **Payload Schemas**: Inline JSON Schema validation
- **Rate Limiting**: Document publishing/subscribing rates
- **Authentication**: Document auth requirements
- **Retained Messages**: Specify message retention
- **Multi-tenant**: Support for tenant-based topics

## Configuration (apidoc.json)

```json
{
  "name": "MQTT IoT Example",
  "version": "1.0.0",
  "title": "Smart Home IoT - MQTT Protocol Example",
  "url": "mqtt://broker.example.com:1883",
  "inputs": {
    "docs": ["/"],
    "mqtt": ["src"]
  },
  "order": ["Sensors", "Actuators"]
}
```

### Inputs Configuration

- `"docs": ["/"]` - Includes this README.md in the documentation
- `"mqtt": ["src"]` - Processes `@mqtt` annotations in src/ directory
  - Looks for `@mqtt publish` and `@mqtt subscribe` operations
  - Extracts topic patterns and payload schemas
  - Generates MQTT-specific documentation

## Testing

Generate documentation:

```bash
# From the example directory
apidoc generate -i src -o doc

# Or from project root
npm run example:mqtt
```

Preview documentation:

```bash
npx serve doc
# Open http://localhost:3000
```

Test with mosquitto:

```bash
# Publish temperature data
mosquitto_pub -h mqtt.example.com -p 1883 \
  -t "home/sensors/temperature" \
  -q 1 \
  -m '{"temperature":22.5,"deviceId":"TEMP-001","timestamp":1704801600}'

# Subscribe to all sensors
mosquitto_sub -h mqtt.example.com -p 1883 \
  -t "home/sensors/#" \
  -q 1
```

## What You'll Learn

1. How to document MQTT publish operations
2. How to document MQTT subscribe operations
3. Using topic parameters and wildcards
4. Documenting QoS levels and retention
5. Defining payload schemas with JSON Schema
6. Rate limiting for IoT devices
7. Authentication and security requirements
8. Multi-tenant topic patterns

## Related Examples

- **01-basic-api**: For REST API documentation comparison
- **02-openapi**: For standard API protocols
- **10-markdown**: For detailed protocol documentation
