/**
 * @file sensors.h
 * @brief Sensor management for ESP32 IoT devices
 */

#ifndef SENSORS_H
#define SENSORS_H

#include <stdint.h>
#include <stdbool.h>

/**
 * @iot {function} temperature_read
 * @iotName TemperatureRead
 * @iotGroup Sensors
 * @iotVersion 1.0.0
 * @iotPlatform ESP32
 *
 * @iotDescription Lee la temperatura del sensor DS18B20 conectado via OneWire.
 * Soporta resoluciones de 9 a 12 bits. Mayor resolucion = mayor tiempo de conversion.
 *
 * | Resolucion | Tiempo | Precision |
 * |------------|--------|-----------|
 * | 9 bits     | 94ms   | 0.5 C     |
 * | 10 bits    | 188ms  | 0.25 C    |
 * | 11 bits    | 375ms  | 0.125 C   |
 * | 12 bits    | 750ms  | 0.0625 C  |
 *
 * @iotParam {uint8_t} gpio_pin Pin GPIO donde esta conectado el sensor (0-39)
 * @iotParam {uint8_t} resolution Bits de resolucion (9-12)
 *
 * @iotReturn {float} Temperatura en grados Celsius
 *
 * @iotError (Sensor) {int} SENSOR_NOT_FOUND Sensor no conectado o no responde
 * @iotError (Sensor) {int} SENSOR_CRC_ERROR Corrupcion de datos detectada
 * @iotError (Sensor) {int} SENSOR_TIMEOUT Timeout en operacion de lectura
 *
 * @iotExample {c} Uso basico:
 *     #include "sensors.h"
 *
 *     void app_main() {
 *         float temp = temperature_read(GPIO_NUM_4, 12);
 *         printf("Temperature: %.2f C\n", temp);
 *     }
 *
 * @iotSee humidity_read
 * @iotSince 1.0.0
 */
float temperature_read(uint8_t gpio_pin, uint8_t resolution);

/**
 * @iot {function} humidity_read
 * @iotName HumidityRead
 * @iotGroup Sensors
 * @iotVersion 1.0.0
 * @iotPlatform ESP32
 *
 * @iotDescription Lee la humedad relativa del sensor DHT22/AM2302.
 * El sensor necesita un tiempo minimo de 2 segundos entre lecturas.
 *
 * @iotParam {uint8_t} gpio_pin Pin GPIO del sensor (0-39)
 *
 * @iotReturn {float} Humedad relativa en porcentaje (0-100%)
 *
 * @iotError (Sensor) {int} SENSOR_NOT_FOUND Sensor no detectado
 * @iotError (Sensor) {int} SENSOR_TIMEOUT Timeout en lectura
 *
 * @iotExample {c} Lectura de humedad:
 *     float humidity = humidity_read(GPIO_NUM_5);
 *     printf("Humidity: %.1f%%\n", humidity);
 *
 * @iotSee temperature_read
 * @iotSince 1.0.0
 */
float humidity_read(uint8_t gpio_pin);

/**
 * @iot {function} sensor_init
 * @iotName SensorInit
 * @iotGroup Sensors
 * @iotVersion 1.0.0
 * @iotPlatform ESP32
 *
 * @iotDescription Inicializa el bus de sensores OneWire y detecta dispositivos conectados.
 * Debe llamarse antes de cualquier operacion de lectura.
 *
 * @iotParam {uint8_t} gpio_pin Pin GPIO para el bus OneWire
 * @iotParam {bool} pullup_enable Habilitar resistencia pull-up interna
 *
 * @iotReturn {int} Numero de sensores detectados (0 si no hay ninguno)
 *
 * @iotExample {c} Inicializacion:
 *     int sensors = sensor_init(GPIO_NUM_4, true);
 *     printf("Found %d sensors\n", sensors);
 *
 * @iotSince 1.0.0
 */
int sensor_init(uint8_t gpio_pin, bool pullup_enable);

/**
 * @iot {struct} SensorReading
 * @iotName SensorReading
 * @iotGroup Sensors
 * @iotVersion 1.0.0
 *
 * @iotDescription Estructura que contiene una lectura de sensor con metadata.
 *
 * @iotParam {float} temperature Temperatura en Celsius
 * @iotParam {float} humidity Humedad relativa en porcentaje
 * @iotParam {uint32_t} timestamp Unix timestamp de la lectura
 * @iotParam {uint8_t} sensor_id ID del sensor (0-255)
 * @iotParam {bool} valid Indica si la lectura es valida
 *
 * @iotSince 1.0.0
 */
typedef struct {
    float temperature;
    float humidity;
    uint32_t timestamp;
    uint8_t sensor_id;
    bool valid;
} SensorReading;

/**
 * @iot {enum} SensorStatus
 * @iotName SensorStatus
 * @iotGroup Sensors
 * @iotVersion 1.0.0
 *
 * @iotDescription Codigos de estado para operaciones de sensores.
 *
 * @iotParam {int} SENSOR_OK=0 Operacion exitosa
 * @iotParam {int} SENSOR_ERROR_TIMEOUT=1 Timeout en comunicacion
 * @iotParam {int} SENSOR_ERROR_CRC=2 Error de checksum
 * @iotParam {int} SENSOR_ERROR_DISCONNECTED=3 Sensor desconectado
 *
 * @iotSince 1.0.0
 */
typedef enum {
    SENSOR_OK = 0,
    SENSOR_ERROR_TIMEOUT = 1,
    SENSOR_ERROR_CRC = 2,
    SENSOR_ERROR_DISCONNECTED = 3
} SensorStatus;

#endif // SENSORS_H
