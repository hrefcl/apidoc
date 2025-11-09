# Example 04: MQTT Protocol Documentation

Este ejemplo demuestra cómo documentar sistemas basados en MQTT (Message Queue Telemetry Transport) usando las anotaciones MQTT especializadas de APIDoc v5.

## 🎯 Objetivo

Mostrar la documentación completa de:
- **MQTT Publish**: Publicación de mensajes a topics
- **MQTT Subscribe**: Suscripción a topics para recibir mensajes
- **QoS Levels**: Documentación de Quality of Service (0, 1, 2)
- **Retained Messages**: Mensajes retenidos en el broker
- **Payloads**: Estructuras de datos en formato JSON

## 📁 Estructura

```
04-mqtt/
├── README.md
├── apidoc.json
└── src/
    ├── sensors.js        # IoT sensors (temperature, humidity)
    └── actuators.js      # IoT actuators (lights, motors)
```

## 🌐 Sistema de IoT Demostrado

**Smart Home IoT System** - Sistema de sensores y actuadores

Características:
- 🌡️ **Sensores**: Temperature, Humidity, Motion
- 💡 **Actuadores**: Lights, Motors, Alarms
- 📊 **Telemetría**: Real-time monitoring
- ⚙️ **Control**: Remote device control

## 🔧 Características MQTT Demostradas

### 1. MQTT Publish
```javascript
/**
 * @mqttpublish {topic} home/sensors/temperature Temperature Data
 * @mqttpublishqos 1
 * @mqttpublishretain true
 */
```

### 2. MQTT Subscribe
```javascript
/**
 * @mqttsubscribe {topic} home/actuators/lights/+/command Light Commands
 * @mqttsubscribeqos 2
 */
```

### 3. QoS Levels
- **QoS 0**: At most once (fire and forget)
- **QoS 1**: At least once (acknowledged delivery)
- **QoS 2**: Exactly once (guaranteed delivery)

### 4. Topic Wildcards
- **+**: Single level wildcard (`home/sensors/+/data`)
- **#**: Multi level wildcard (`home/sensors/#`)

## 📚 Uso

### Generar Documentación
```bash
# Desde la raíz del proyecto
npm run example:04

# O directamente
./bin/apidoc generate -i examples/04-mqtt/src/ -o examples/04-mqtt/output
npx serve examples/04-mqtt/output -p 8080
```

### Modo MQTT-Only
```bash
# Solo documentar endpoints MQTT, ignorar REST
./bin/apidoc generate -i examples/04-mqtt/src/ -o examples/04-mqtt/output --mqtt-only
```

### Ver Documentación
Abrir en navegador: `http://localhost:8080`

## 🎓 Conceptos Aprendidos

1. **@mqttpublish**: Documentar publicación de mensajes MQTT
2. **@mqttsubscribe**: Documentar suscripción a topics MQTT
3. **QoS Levels**: Configurar y documentar Quality of Service
4. **Retained Messages**: Mensajes retenidos en el broker
5. **Topic Patterns**: Usar wildcards + y # en topics
6. **Payload Schemas**: Estructuras JSON de mensajes MQTT

## 🔗 Referencias

- [MQTT Protocol](https://mqtt.org/)
- [APIDoc MQTT Documentation](../../md/en/10-mqtt.md)
- [QoS Levels Explained](https://www.hivemq.com/blog/mqtt-essentials-part-6-mqtt-quality-of-service-levels/)

## ⚙️ Configuración

El archivo `apidoc.json` incluye:
```json
{
  "name": "MQTT IoT Example",
  "version": "1.0.0",
  "title": "Smart Home IoT - MQTT Protocol Example",
  "template": {
    "forceLanguage": "en"
  }
}
```

## 📝 Notas Técnicas

- Los topics MQTT siguen la convención `home/{type}/{device}/{action}`
- QoS 1 recomendado para sensores (balance entre velocidad y confiabilidad)
- QoS 2 recomendado para comandos críticos de actuadores
- Los mensajes retenidos (retain) útiles para estados persistentes
- Usar JSON para payloads facilita la integración
