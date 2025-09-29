/**
 * @file MQTT API Documentation Examples
 *
 * This file demonstrates how to use the new MQTT documentation tags in apiDoc 4.1.0+
 * These examples show various MQTT patterns including telemetry, commands, and device management.
 */

/**
 * @api {publish} v1/{tenant}/devices/{deviceId}/telemetry Publish Device Telemetry
 * @apiName PublishTelemetry
 * @mqttGroup Mqtt
 * @mqtt publish
 * @topic v1/{tenant}/devices/{deviceId}/telemetry
 * @topicParam {String} tenant Tenant identifier (slug format, e.g., "acme")
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
 * @errors Connection refused due to invalid credentials
 * @examplePublish
 * mosquitto_pub -h mqtt.example.com -p 8883 \
 *   -u "acme:device-42" -P "secret123" \
 *   -t "v1/acme/devices/device-42/telemetry" \
 *   -q 1 \
 *   -m '{"ts":"2025-09-26T20:34:00Z","metrics":{"temp":22.5,"humidity":57,"pressure":1013.25}}'
 *
 * Publish device telemetry data to the MQTT broker. This endpoint accepts
 * sensor readings and metrics from IoT devices.
 *
 * The payload should contain timestamped metrics with sensor readings.
 * All numeric values should be in their standard units (Celsius for temperature,
 * percentage for humidity, etc.).
 */
export function publishTelemetry() {
    // Implementation would handle MQTT publishing
}

/**
 * @api {subscribe} v1/{tenant}/devices/{deviceId}/commands Subscribe to Device Commands
 * @apiName SubscribeCommands
 * @mqttGroup Mqtt
 * @mqtt subscribe
 * @topic v1/{tenant}/devices/{deviceId}/commands
 * @topicParam {String} tenant Tenant identifier
 * @topicParam {String} deviceId Device to receive commands
 * @qos 1
 * @retain false
 * @auth username Device credentials with TLS recommended
 * @payload application/json Command for actuator control
 * @payloadSchema inline
 * {
 *   "type": "object",
 *   "required": ["cmd","seq"],
 *   "properties": {
 *     "cmd": { "type": "string", "enum": ["on","off","set","reboot"] },
 *     "value": { "type": ["number","string","boolean","null"] },
 *     "seq": { "type": "integer" }
 *   }
 * }
 * @responseTopic v1/{tenant}/devices/{deviceId}/commands/ack
 * @responseExample
 * {"seq":101,"status":"ok","timestamp":"2025-09-26T20:34:05Z"}
 * @ratelimit 5/minute Command rate limit per device
 * @tags commands actuator control
 * @errors Topic access denied - insufficient permissions
 * @exampleSubscribe
 * mosquitto_sub -h mqtt.example.com -p 8883 \
 *   -u "acme:device-42" -P "secret123" \
 *   -t "v1/acme/devices/device-42/commands" \
 *   -q 1
 *
 * Subscribe to device commands from the server. Devices listen on this topic
 * to receive control commands such as actuator changes, configuration updates,
 * or operational commands.
 *
 * Commands include a sequence number for acknowledgment tracking and a command
 * type with optional parameters.
 */
export function subscribeToCommands() {
    // Implementation would handle MQTT subscription
}

/**
 * @api {publish} v1/{tenant}/devices/{deviceId}/commands/ack Publish Command Acknowledgment
 * @apiName PublishCommandAck
 * @mqttGroup Mqtt
 * @mqtt publish
 * @topic v1/{tenant}/devices/{deviceId}/commands/ack
 * @topicParam {String} tenant Tenant identifier
 * @topicParam {String} deviceId Device sending acknowledgment
 * @qos 1
 * @retain false
 *
 * Publish command acknowledgments back to the server. Devices should send
 * acknowledgments for all received commands to confirm execution status.
 *
 * The acknowledgment payload should include the original sequence number
 * and execution status.
 *
 * @example Example acknowledgment:
 * ```bash
 * mosquitto_pub -h mqtt.example.com -p 8883 \
 *   -u "acme:device-42" -P "secret123" \
 *   -t "v1/acme/devices/device-42/commands/ack" \
 *   -q 1 \
 *   -m '{"seq":1001,"status":"ok","timestamp":"2025-09-26T20:34:05Z"}'
 * ```
 */
export function publishCommandAck() {
    // Implementation would handle MQTT acknowledgment publishing
}

/**
 * @api {publish} v1/{tenant}/devices/{deviceId}/status Publish Device Status
 * @apiName PublishDeviceStatus
 * @mqttGroup Mqtt
 * @mqtt publish
 * @topic v1/{tenant}/devices/{deviceId}/status
 * @topicParam {String} tenant Tenant identifier
 * @topicParam {String} deviceId Device reporting status
 * @qos 1
 * @retain true
 *
 * Publish device online/offline status. This topic uses retain=true so the
 * broker keeps the last known status for each device.
 *
 * Status messages are lightweight and indicate device connectivity and
 * basic health information.
 *
 * @example Device online status:
 * ```bash
 * mosquitto_pub -h mqtt.example.com -p 8883 \
 *   -u "acme:device-42" -P "secret123" \
 *   -t "v1/acme/devices/device-42/status" \
 *   -q 1 -r \
 *   -m '{"status":"online","timestamp":"2025-09-26T20:34:00Z","version":"1.2.3"}'
 * ```
 *
 * @example Device offline status (sent via Last Will and Testament):
 * ```json
 * {
 *   "status": "offline",
 *   "timestamp": "2025-09-26T20:39:00Z",
 *   "reason": "connection_lost"
 * }
 * ```
 */
export function publishDeviceStatus() {
    // Implementation would handle device status publishing
}

/**
 * @api {subscribe} v1/{tenant}/devices/+/alerts Subscribe to Device Alerts
 * @apiName SubscribeAlerts
 * @mqttGroup Mqtt
 * @mqtt subscribe
 * @topic v1/{tenant}/devices/+/alerts
 * @topicParam {String} tenant Tenant identifier
 * @qos 2
 * @retain false
 *
 * Subscribe to device alerts using wildcard topic. The + wildcard matches
 * any device ID, allowing monitoring of alerts from all devices in a tenant.
 *
 * Uses QoS 2 for exactly-once delivery of critical alerts.
 *
 * @example Subscribe to all device alerts:
 * ```bash
 * mosquitto_sub -h mqtt.example.com -p 8883 \
 *   -u "acme:monitor" -P "monitor123" \
 *   -t "v1/acme/devices/+/alerts" \
 *   -q 2
 * ```
 *
 * @example Alert payload:
 * ```json
 * {
 *   "level": "critical",
 *   "type": "temperature_threshold",
 *   "message": "Temperature exceeded 40°C",
 *   "value": 42.3,
 *   "threshold": 40.0,
 *   "timestamp": "2025-09-26T20:34:00Z"
 * }
 * ```
 */
export function subscribeToAlerts() {
    // Implementation would handle alert subscription
}

/**
 * @api {subscribe} v1/{tenant}/devices/{deviceId}/config Subscribe to Device Configuration mqtt
 * @apiName SubscribeConfig
 * @mqttGroup Mqtt
 * @mqtt subscribe
 * @topic v1/{tenant}/devices/{deviceId}/config
 * @topicParam {String} tenant Tenant identifier
 * @topicParam {String} deviceId Device to receive configuration
 * @qos 0
 * @retain true
 *
 * Subscribe to device configuration updates. Configuration messages are
 * retained so devices get the latest config when they connect.
 *
 * Uses QoS 0 for fire-and-forget delivery since config messages are retained.
 *
 * @example Configuration update:
 * ```json
 * {
 *   "sampling_rate": 60,
 *   "thresholds": {
 *     "temperature": {"min": 0, "max": 40},
 *     "humidity": {"min": 20, "max": 80}
 *   },
 *   "reporting_interval": 300,
 *   "timestamp": "2025-09-26T20:34:00Z"
 * }
 * ```
 */
export function subscribeToConfig() {
    // Implementation would handle configuration subscription
}
