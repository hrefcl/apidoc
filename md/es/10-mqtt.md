# 📡 Protocolo MQTT

APIDoc 5.0.0 introduce soporte completo para documentar protocolos MQTT, permitiendo documentar patrones publish/subscribe junto con APIs REST tradicionales.

## 🚀 Introducción a MQTT en APIDoc

MQTT (Message Queuing Telemetry Transport) es un protocolo de mensajería ligero para comunicación machine-to-machine (M2M) e Internet of Things (IoT).

### Características principales

- **📡 Documentación MQTT completa** - 16 tags especializados para MQTT
- **🎨 UI distintiva** - Tema morado para endpoints MQTT
- **🏷️ Tags enriquecidos** - Soporte para topics, QoS, retain flags, autenticación
- **🔄 Templates interactivos** - Documentación colapsible con detalles completos
- **📋 Agrupación inteligente** - Separación automática de documentación MQTT y REST
- **💡 Listo para IoT** - Perfecto para dispositivos IoT, sistemas en tiempo real

## 🎯 Ejemplo Rápido

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

## 🏷️ Tags MQTT Completos

### Tags Principales

| Tag | Sintaxis | Descripción | Ejemplo |
|-----|----------|-------------|---------|
| `@mqtt` | `{publish\|subscribe\|inline}` | Tipo de operación MQTT | `@mqtt publish` |
| `@mqttGroup` | `{String}` | Agrupa endpoints MQTT por separado | `@mqttGroup IoT` |
| `@topic` | `{String}` | Patrón de topic MQTT con parámetros | `@topic v1/{tenant}/devices/{id}/data` |
| `@topicParam` | `{Type} name Description` | Documentación de parámetros de topic | `@topicParam {String} tenant Tenant ID` |

### Tags de Configuración

| Tag | Sintaxis | Descripción | Ejemplo |
|-----|----------|-------------|---------|
| `@qos` | `{Number}` | Nivel de Quality of Service (0,1,2) | `@qos 1` |
| `@retain` | `{Boolean}` | Flag de retención de mensaje | `@retain true` |
| `@auth` | `{String}` | Método de autenticación | `@auth username Device credentials` |

### Tags de Payload

| Tag | Sintaxis | Descripción | Ejemplo |
|-----|----------|-------------|---------|
| `@payload` | `{MIME} Description` | Formato de payload del mensaje | `@payload application/json Sensor data` |
| `@payloadSchema` | `{Type}` | JSON Schema para validación de payload | `@payloadSchema inline` |
| `@responseTopic` | `{String}` | Patrón de topic de respuesta | `@responseTopic v1/{tenant}/ack` |
| `@responseExample` | `data` | Ejemplos de payload de respuesta | JSON response data |

### Tags de Ejemplos

| Tag | Sintaxis | Descripción | Ejemplo |
|-----|----------|-------------|---------|
| `@examplePublish` | `command` | Ejemplos de comandos de publicación | `mosquitto_pub -h broker...` |
| `@exampleSubscribe` | `command` | Ejemplos de comandos de suscripción | `mosquitto_sub -h broker...` |

### Tags Adicionales

| Tag | Sintaxis | Descripción | Ejemplo |
|-----|----------|-------------|---------|
| `@ratelimit` | `{String}` | Reglas de limitación de tasa | `@ratelimit 10/second` |
| `@errors` | `{String}` | Escenarios de error | `@errors Connection refused` |
| `@tags` | `{String}` | Tags específicos de MQTT | `@tags telemetry iot sensor` |

## 🔄 Tipos de Operación MQTT

### Operaciones Publish

Documentan cómo publicar mensajes a un topic:

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

### Operaciones Subscribe

Documentan cómo suscribirse a topics:

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

### Documentación Inline

Para topics de configuración o documentación general:

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

## 🎨 Características Visuales

### Tema Morado Distintivo

- **🟣 Color púrpura** para endpoints MQTT
- **📊 Badges de método** clara para publish/subscribe/inline
- **🎯 Visualización de topics** con resaltado de parámetros
- **📊 Indicadores QoS** niveles de calidad de servicio
- **🔄 Flags de retain** estado de retención de mensajes
- **📱 Responsive** visualización perfecta en móvil y escritorio

### Elementos de UI

- **Headers distintivos** con iconos MQTT
- **Secciones colapsibles** para información detallada
- **Syntax highlighting** para ejemplos de comandos
- **Tablas organizadas** para parámetros y respuestas
- **Badges informativos** para QoS, retain, auth

## 🌟 Casos de Uso

### 🏭 Plataformas IoT

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

### 📱 Apps en Tiempo Real

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

### 🔧 Microservicios

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

## 📊 Configuración MQTT

### Configuración de Broker

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

### Esquemas de Autenticación

```javascript
/**
 * @auth username Username/password authentication required
 * @auth certificate X.509 client certificates
 * @auth token JWT token in username field
 * @auth oauth OAuth 2.0 integration
 */
```

## 🔧 Integración con REST APIs

Puedes documentar MQTT y REST en el mismo proyecto:

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

## 📚 Recursos Adicionales

- **[📋 Configuración](./01-configuration.md)** - Configuración general de APIDoc
- **[📖 Parámetros APIDoc](./05-apidoc-params.md)** - Referencia completa de parámetros
- **[📝 Ejemplos](./06-examples.md)** - Más ejemplos prácticos

## 💡 Mejores Prácticas

### Naming Conventions

- **Topics jerárquicos**: `company/department/device/metric`
- **Parámetros descriptivos**: Use nombres claros para `{deviceId}`, `{sensorType}`
- **Consistencia**: Mantenga un esquema de naming consistente

### Documentación Completa

- **QoS apropiado**: Documente el nivel QoS según la criticidad
- **Retain flags**: Especifique cuándo usar retain=true
- **Rate limiting**: Documente limitaciones de frecuencia
- **Ejemplos reales**: Use comandos mosquitto_pub/sub funcionales

### Seguridad

- **Autenticación**: Siempre documente requerimientos de auth
- **TLS**: Recomiende TLS para producción
- **Permisos**: Documente ACLs y permisos de topics