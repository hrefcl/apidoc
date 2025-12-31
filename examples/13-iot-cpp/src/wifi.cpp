/**
 * @file wifi.cpp
 * @brief WiFi management for ESP32
 */

#include <stdint.h>
#include <stdbool.h>

/**
 * @iot {function} wifi_init
 * @iotName WifiInit
 * @iotGroup WiFi
 * @iotVersion 1.0.0
 * @iotPlatform {ESP32,ESP8266}
 *
 * @iotDescription Inicializa el subsistema WiFi del ESP32.
 * Debe llamarse antes de cualquier operacion WiFi.
 *
 * @iotReturn {int} ESP_OK si la inicializacion fue exitosa
 *
 * @iotExample {cpp} Inicializacion WiFi:
 *     #include "wifi.h"
 *
 *     void setup() {
 *         int result = wifi_init();
 *         if (result != ESP_OK) {
 *             printf("WiFi init failed\n");
 *         }
 *     }
 *
 * @iotSee wifi_connect
 * @iotSince 1.0.0
 */
int wifi_init();

/**
 * @iot {function} wifi_connect
 * @iotName WifiConnect
 * @iotGroup WiFi
 * @iotVersion 1.0.0
 * @iotPlatform {ESP32,ESP8266}
 *
 * @iotDescription Conecta el ESP32 a una red WiFi. La funcion es bloqueante
 * y espera hasta establecer conexion o timeout.
 *
 * @iotParam {char*} ssid Nombre de la red WiFi (max 32 caracteres)
 * @iotParam {char*} password Contrasena WPA2 (max 64 caracteres)
 * @iotParam {uint32_t} timeout_ms Tiempo maximo de espera en milisegundos
 *
 * @iotReturn {int} ESP_OK si la conexion fue exitosa
 *
 * @iotError (WiFi) {int} ESP_ERR_WIFI_NOT_INIT WiFi no inicializado
 * @iotError (WiFi) {int} ESP_ERR_WIFI_CONN Fallo de conexion
 * @iotError (WiFi) {int} ESP_ERR_TIMEOUT Timeout alcanzado
 *
 * @iotExample {cpp} Conexion a red:
 *     #include "wifi.h"
 *
 *     void setup_wifi() {
 *         wifi_init();
 *         int result = wifi_connect("MyNetwork", "password123", 10000);
 *         if (result == ESP_OK) {
 *             printf("Connected! IP: %s\n", wifi_get_ip());
 *         }
 *     }
 *
 * @iotSee wifi_disconnect
 * @iotSince 1.0.0
 */
int wifi_connect(const char* ssid, const char* password, uint32_t timeout_ms);

/**
 * @iot {function} wifi_disconnect
 * @iotName WifiDisconnect
 * @iotGroup WiFi
 * @iotVersion 1.0.0
 * @iotPlatform {ESP32,ESP8266}
 *
 * @iotDescription Desconecta el ESP32 de la red WiFi actual.
 *
 * @iotReturn {int} ESP_OK si se desconecto correctamente
 *
 * @iotExample {cpp} Desconexion:
 *     wifi_disconnect();
 *     printf("Disconnected from WiFi\n");
 *
 * @iotSee wifi_connect
 * @iotSince 1.0.0
 */
int wifi_disconnect();

/**
 * @iot {function} wifi_get_rssi
 * @iotName WifiGetRssi
 * @iotGroup WiFi
 * @iotVersion 1.0.0
 * @iotPlatform {ESP32,ESP8266}
 *
 * @iotDescription Obtiene la intensidad de senal WiFi (RSSI) en dBm.
 *
 * | RSSI (dBm) | Calidad      |
 * |------------|--------------|
 * | -30 a -50  | Excelente    |
 * | -50 a -60  | Buena        |
 * | -60 a -70  | Regular      |
 * | -70 a -80  | Debil        |
 * | < -80      | Muy debil    |
 *
 * @iotReturn {int8_t} RSSI en dBm (valor negativo)
 *
 * @iotExample {cpp} Check Signal:
 *     int8_t rssi = wifi_get_rssi();
 *     printf("Signal: %d dBm\n", rssi);
 *
 *     if (rssi > -50) {
 *         printf("Excellent signal!\n");
 *     } else if (rssi > -70) {
 *         printf("Good signal\n");
 *     } else {
 *         printf("Weak signal, consider moving closer\n");
 *     }
 *
 * @iotSince 1.0.0
 */
int8_t wifi_get_rssi();

/**
 * @iot {callback} wifi_event_handler
 * @iotName WifiEventHandler
 * @iotGroup WiFi
 * @iotVersion 1.0.0
 * @iotPlatform ESP32
 *
 * @iotDescription Callback para manejar eventos WiFi como conexion,
 * desconexion, obtencion de IP, etc.
 *
 * @iotParam {void*} arg Argumento de usuario
 * @iotParam {int} event_id ID del evento WiFi
 * @iotParam {void*} event_data Datos del evento
 *
 * @iotReturn {void}
 *
 * @iotExample {cpp} Event Handler:
 *     void wifi_event_handler(void* arg, int event_id, void* data) {
 *         switch(event_id) {
 *             case WIFI_EVENT_STA_CONNECTED:
 *                 printf("Connected to AP\n");
 *                 break;
 *             case WIFI_EVENT_STA_DISCONNECTED:
 *                 printf("Disconnected, reconnecting...\n");
 *                 wifi_connect(ssid, pass, 5000);
 *                 break;
 *         }
 *     }
 *
 * @iotSince 1.0.0
 */
void wifi_event_handler(void* arg, int event_id, void* event_data);
