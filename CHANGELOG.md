# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.0.0-alpha.2] - 2025-09-30

### 🚀 NEW FEATURE - Interactive MQTT Testing with Real Broker Connections

**APIDoc v5 now includes a complete interactive MQTT client for testing MQTT endpoints directly in the documentation!**

#### ✨ Interactive MQTT Features
- **🔌 Real Broker Connections**: Connect to actual MQTT brokers using WebSocket (ws/wss) or native MQTT protocols
- **🔐 Security First**: Preconfigured credentials are masked with secure placeholders (`••••••••`)
- **📡 Full Protocol Support**: Publish, Subscribe, and Inline MQTT operations
- **🎯 QoS Levels**: Support for QoS 0, 1, and 2 (At most once, At least once, Exactly once)
- **🔒 SSL/TLS Support**: Complete SSL/TLS with CA certificates, client certificates, and private keys
- **📨 Message Log**: Real-time message logging with timestamps and type indicators
- **🎨 Visual Feedback**: Status indicators with emojis (✅ connected, ❌ error, ⚠️ offline, 🔄 reconnecting)

#### 🛡️ Security & Configuration
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
      "username": "user",
      "password": "secret",
      "clientId": "apidoc-client"
    },
    "ssl": {
      "enabled": true,
      "rejectUnauthorized": true,
      "ca": "-----BEGIN CERTIFICATE-----...",
      "cert": "-----BEGIN CERTIFICATE-----...",
      "key": "-----BEGIN PRIVATE KEY-----..."
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

#### 🔐 Security Features
- **Masked Credentials**: Username, password, and certificates are hidden with placeholders
- **Configuration Badge**: Visual "Configurado" badge on sensitive fields
- **Disclaimer Banner**: Blue banner indicating preconfigured secure connection
- **Read-Only Mode**: Sensitive fields are disabled when preconfigured
- **No Data Exposure**: Private keys and passwords never displayed in UI

#### 🎯 MQTT Operations
1. **PUBLISH**: Send messages to MQTT topics with QoS selection
   - JSON payload validation
   - Plain text support
   - QoS 0, 1, 2 selection
   - Success/error feedback

2. **SUBSCRIBE**: Listen to MQTT topics in real-time
   - QoS selection
   - Automatic message reception
   - Unsubscribe functionality
   - Message history (last 50 messages)

3. **INLINE**: Combined publish/subscribe operations
   - Dual functionality in single interface
   - Separate controls for each operation

#### 🔧 Technical Implementation
- **NEW**: `MqttTryItOut.vue` component with mqtt.js integration
- **NEW**: Dual configuration system (real config + display config)
- **NEW**: Security masking for sensitive data
- **NEW**: Real-time MQTT event handling (connect, disconnect, message, error, offline, reconnect)
- **NEW**: Automatic cleanup on component unmount
- **ENHANCED**: ApiContent.vue detects MQTT endpoints automatically
- **ENHANCED**: cat.meta.json includes MQTT configuration

#### 📡 Supported MQTT Methods
- `PUBLISH` - Publish messages to topics
- `SUBSCRIBE` - Subscribe to topics and receive messages
- `INLINE` - Combined publish/subscribe operations

#### 🎨 UI/UX Features
- **Tab Interface**: Separate "Configuración" and "Probar" tabs
- **Connection Status**: Real-time status with visual indicators
- **Message Log**: Timestamped message history with type badges (publish/subscribe/received)
- **Action Buttons**:
  - Connect/Disconnect (green/red)
  - Publish (blue)
  - Subscribe/Unsubscribe (purple/orange)
- **Dark Mode**: Full dark mode support

#### 📦 Dependencies
- **mqtt.js**: WebSocket and native MQTT client library
- **lucide-vue-next**: Icons for UI elements

#### 📚 Documentation
- **NEW**: Complete MQTT testing guide in `md/es/18-mqtt-testing.md` and `md/en/18-mqtt-testing.md`
- **UPDATED**: MQTT protocol documentation with interactive examples
- **ENHANCED**: Security best practices for MQTT configurations

### 🔄 Backend Enhancements
- **ENHANCED**: `apidoc-to-apicat.ts` adapter includes MQTT, repository, bugs, homepage fields
- **ENHANCED**: `apicat.ts` plugin copies all metadata to cat.meta.json
- **IMPROVED**: Metadata propagation from apidoc.json to frontend

### 🐛 Bug Fixes
- **FIXED**: Dark mode color contrast in disclaimer banners
- **FIXED**: SSL/TLS configuration display for preconfigured settings
- **IMPROVED**: Error handling for MQTT connection failures
