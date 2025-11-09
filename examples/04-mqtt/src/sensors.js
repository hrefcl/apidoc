/**
 * IoT Sensors - MQTT Publishers
 *
 * This file demonstrates MQTT publish operations for various IoT sensors.
 * Sensors publish data to specific topics that monitoring systems subscribe to.
 */

/**
 * @mqttpublish home/sensors/temperature Temperature Sensor Data
 * @mqttpublishname PublishTemperature
 * @mqttpublishgroup Sensors
 * @mqttpublishversion 1.0.0
 * @mqttpublishdescription Publish temperature readings from smart home sensors to MQTT broker.
 *                         Data is published every 30 seconds with QoS 1 to ensure delivery.
 *
 * @mqttpublishqos 1
 * @mqttpublishretain true
 * @mqttpublishrate 30s
 *
 * @mqttpublishbody {Number} temperature Temperature in Celsius (-50 to 100)
 * @mqttpublishbody {Number} humidity Relative humidity percentage (0-100)
 * @mqttpublishbody {String} deviceId Unique sensor device identifier
 * @mqttpublishbody {String} location Room location (living_room, bedroom, kitchen, etc.)
 * @mqttpublishbody {Number} timestamp Unix timestamp of measurement
 * @mqttpublishbody {String} unit Temperature unit (celsius, fahrenheit)
 *
 * @mqttpublishexample {json} Temperature Reading:
 *     {
 *       "temperature": 22.5,
 *       "humidity": 65,
 *       "deviceId": "TEMP-001",
 *       "location": "living_room",
 *       "timestamp": 1704801600,
 *       "unit": "celsius"
 *     }
 */
function publishTemperatureData() {
  // Implementation: mqtt.publish('home/sensors/temperature', data)
}

/**
 * @mqttpublish home/sensors/humidity Humidity Sensor Data
 * @mqttpublishname PublishHumidity
 * @mqttpublishgroup Sensors
 * @mqttpublishversion 1.0.0
 * @mqttpublishdescription Publish humidity readings from environmental sensors.
 *                         Used for climate control and monitoring.
 *
 * @mqttpublishqos 1
 * @mqttpublishretain true
 * @mqttpublishrate 60s
 *
 * @mqttpublishbody {Number} humidity Relative humidity percentage (0-100)
 * @mqttpublishbody {String} deviceId Sensor device identifier
 * @mqttpublishbody {String} location Room location
 * @mqttpublishbody {Number} timestamp Measurement timestamp
 * @mqttpublishbody {String} status Sensor status (ok, warning, error)
 *
 * @mqttpublishexample {json} Humidity Reading:
 *     {
 *       "humidity": 68,
 *       "deviceId": "HUM-001",
 *       "location": "bathroom",
 *       "timestamp": 1704801660,
 *       "status": "ok"
 *     }
 */
function publishHumidityData() {
  // Implementation: mqtt.publish('home/sensors/humidity', data)
}

/**
 * @mqttpublish home/sensors/motion/+ Motion Sensor Events
 * @mqttpublishname PublishMotion
 * @mqttpublishgroup Sensors
 * @mqttpublishversion 1.0.0
 * @mqttpublishdescription Publish motion detection events from PIR sensors.
 *                         Topic includes room identifier: home/sensors/motion/living_room
 *
 * @mqttpublishqos 2
 * @mqttpublishretain false
 * @mqttpublishrate on_event
 *
 * @mqttpublishbody {Boolean} detected Motion detected (true/false)
 * @mqttpublishbody {String} deviceId Motion sensor identifier
 * @mqttpublishbody {String} location Room location
 * @mqttpublishbody {Number} timestamp Detection timestamp
 * @mqttpublishbody {Number} confidence Detection confidence (0-100)
 * @mqttpublishbody {String} eventType Event type (motion_start, motion_end)
 *
 * @mqttpublishexample {json} Motion Detected:
 *     {
 *       "detected": true,
 *       "deviceId": "MOT-001",
 *       "location": "living_room",
 *       "timestamp": 1704801720,
 *       "confidence": 95,
 *       "eventType": "motion_start"
 *     }
 */
function publishMotionEvent() {
  // Implementation: mqtt.publish('home/sensors/motion/living_room', data)
}

/**
 * @mqttpublish home/sensors/door/+/status Door Sensor Status
 * @mqttpublishname PublishDoorStatus
 * @mqttpublishgroup Sensors
 * @mqttpublishversion 1.0.0
 * @mqttpublishdescription Publish door open/close status changes.
 *                         Topic pattern: home/sensors/door/{door_id}/status
 *
 * @mqttpublishqos 2
 * @mqttpublishretain true
 * @mqttpublishrate on_change
 *
 * @mqttpublishbody {String} status Door status (open, closed, unknown)
 * @mqttpublishbody {String} deviceId Door sensor identifier
 * @mqttpublishbody {String} location Door location (front_door, back_door, garage)
 * @mqttpublishbody {Number} timestamp Status change timestamp
 * @mqttpublishbody {Number} batteryLevel Sensor battery level (0-100)
 *
 * @mqttpublishexample {json} Door Opened:
 *     {
 *       "status": "open",
 *       "deviceId": "DOOR-001",
 *       "location": "front_door",
 *       "timestamp": 1704801780,
 *       "batteryLevel": 87
 *     }
 */
function publishDoorStatus() {
  // Implementation: mqtt.publish('home/sensors/door/front/status', data)
}

/**
 * @mqttpublish home/sensors/energy Power Consumption Data
 * @mqttpublishname PublishEnergy
 * @mqttpublishgroup Sensors
 * @mqttpublishversion 1.0.0
 * @mqttpublishdescription Publish real-time power consumption measurements from smart plugs.
 *
 * @mqttpublishqos 1
 * @mqttpublishretain false
 * @mqttpublishrate 10s
 *
 * @mqttpublishbody {Number} power Current power consumption in watts
 * @mqttpublishbody {Number} voltage Line voltage in volts
 * @mqttpublishbody {Number} current Current draw in amperes
 * @mqttpublishbody {Number} energy Total energy consumed in kWh
 * @mqttpublishbody {String} deviceId Smart plug identifier
 * @mqttpublishbody {String} appliance Connected appliance name
 * @mqttpublishbody {Number} timestamp Measurement timestamp
 *
 * @mqttpublishexample {json} Power Reading:
 *     {
 *       "power": 1250,
 *       "voltage": 120,
 *       "current": 10.4,
 *       "energy": 45.5,
 *       "deviceId": "PLUG-001",
 *       "appliance": "refrigerator",
 *       "timestamp": 1704801840
 *     }
 */
function publishEnergyData() {
  // Implementation: mqtt.publish('home/sensors/energy', data)
}

/**
 * @mqttpublish home/sensors/air_quality Air Quality Measurements
 * @mqttpublishname PublishAirQuality
 * @mqttpublishgroup Sensors
 * @mqttpublishversion 1.0.0
 * @mqttpublishdescription Publish air quality measurements including CO2, VOC, and particulates.
 *
 * @mqttpublishqos 1
 * @mqttpublishretain true
 * @mqttpublishrate 120s
 *
 * @mqttpublishbody {Number} co2 CO2 level in ppm
 * @mqttpublishbody {Number} voc Volatile Organic Compounds in ppb
 * @mqttpublishbody {Number} pm25 PM2.5 particulate matter in µg/m³
 * @mqttpublishbody {Number} pm10 PM10 particulate matter in µg/m³
 * @mqttpublishbody {String} aqi Air Quality Index category (good, moderate, poor, hazardous)
 * @mqttpublishbody {String} deviceId Air quality sensor identifier
 * @mqttpublishbody {String} location Measurement location
 * @mqttpublishbody {Number} timestamp Measurement timestamp
 *
 * @mqttpublishexample {json} Air Quality Reading:
 *     {
 *       "co2": 450,
 *       "voc": 125,
 *       "pm25": 12,
 *       "pm10": 18,
 *       "aqi": "good",
 *       "deviceId": "AQ-001",
 *       "location": "bedroom",
 *       "timestamp": 1704801900
 *     }
 */
function publishAirQualityData() {
  // Implementation: mqtt.publish('home/sensors/air_quality', data)
}
