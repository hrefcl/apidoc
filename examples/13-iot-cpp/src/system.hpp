/**
 * @file system.hpp
 * @brief System utilities for ESP32
 */

#ifndef SYSTEM_HPP
#define SYSTEM_HPP

#include <stdint.h>

/**
 * @iot {function} system_get_free_heap
 * @iotName SystemGetFreeHeap
 * @iotGroup System
 * @iotVersion 1.0.0
 * @iotPlatform {ESP32,ESP8266}
 *
 * @iotDescription Retorna la cantidad de memoria heap disponible en bytes.
 * Util para monitorear uso de memoria y detectar memory leaks.
 *
 * @iotReturn {uint32_t} Bytes de memoria heap libre
 *
 * @iotExample {cpp} Monitor Memory:
 *     uint32_t free_mem = system_get_free_heap();
 *     printf("Free heap: %u bytes\n", free_mem);
 *
 *     // Alerta si memoria baja
 *     if (free_mem < 10000) {
 *         printf("WARNING: Low memory!\n");
 *     }
 *
 * @iotSince 1.0.0
 */
uint32_t system_get_free_heap();

/**
 * @iot {function} system_restart
 * @iotName SystemRestart
 * @iotGroup System
 * @iotVersion 1.0.0
 * @iotPlatform {ESP32,ESP8266,Arduino}
 *
 * @iotDescription Reinicia el ESP32. Esta funcion no retorna.
 * Usar con precaucion - guardar datos importantes antes de llamar.
 *
 * @iotReturn {void}
 *
 * @iotExample {cpp} Restart ESP32:
 *     printf("Restarting in 3 seconds...\n");
 *     vTaskDelay(3000 / portTICK_PERIOD_MS);
 *     system_restart();
 *     // Code never reaches here
 *
 * @iotSince 1.0.0
 */
void system_restart();

/**
 * @iot {function} system_get_chip_info
 * @iotName SystemGetChipInfo
 * @iotGroup System
 * @iotVersion 1.0.0
 * @iotPlatform ESP32
 *
 * @iotDescription Obtiene informacion del chip ESP32.
 *
 * @iotParam {void*} chip_info Puntero a estructura esp_chip_info_t
 *
 * @iotReturn {void}
 *
 * @iotExample {cpp} Get Chip Info:
 *     esp_chip_info_t info;
 *     system_get_chip_info(&info);
 *     printf("Cores: %d, Rev: %d\n", info.cores, info.revision);
 *     printf("WiFi: %s, BT: %s\n",
 *            info.features & CHIP_FEATURE_WIFI ? "Yes" : "No",
 *            info.features & CHIP_FEATURE_BT ? "Yes" : "No");
 *
 * @iotSince 1.0.0
 */
void system_get_chip_info(void* chip_info);

/**
 * @iot {function} system_deep_sleep
 * @iotName SystemDeepSleep
 * @iotGroup System
 * @iotVersion 1.0.0
 * @iotPlatform ESP32
 *
 * @iotDescription Pone el ESP32 en modo deep sleep para ahorro de energia.
 * El dispositivo se reinicia al despertar.
 *
 * **Consumo de energia:**
 * - Activo: ~240mA
 * - Light Sleep: ~0.8mA
 * - Deep Sleep: ~10uA
 *
 * @iotParam {uint64_t} time_us Tiempo de sleep en microsegundos (0 = indefinido)
 *
 * @iotReturn {void}
 *
 * @iotExample {cpp} Sleep 10 segundos:
 *     // Dormir por 10 segundos
 *     system_deep_sleep(10 * 1000000);
 *
 * @iotExample {cpp} Sleep hasta GPIO wake-up:
 *     // Dormir hasta GPIO wake-up
 *     gpio_wakeup_enable(GPIO_NUM_0, GPIO_INTR_LOW_LEVEL);
 *     system_deep_sleep(0);
 *
 * @iotSince 1.0.0
 */
void system_deep_sleep(uint64_t time_us);

/**
 * @iot {function} system_get_time
 * @iotName SystemGetTime
 * @iotGroup System
 * @iotVersion 1.0.0
 * @iotPlatform {ESP32,ESP8266}
 * @iotDeprecated Usar esp_timer_get_time() en su lugar
 *
 * @iotDescription Obtiene el tiempo del sistema en microsegundos desde el boot.
 *
 * @iotReturn {uint64_t} Microsegundos desde el inicio del sistema
 *
 * @iotExample {cpp} Medir tiempo:
 *     uint64_t start = system_get_time();
 *     // ... operacion ...
 *     uint64_t elapsed = system_get_time() - start;
 *     printf("Elapsed: %llu us\n", elapsed);
 *
 * @iotSee esp_timer_get_time
 * @iotSince 1.0.0
 */
uint64_t system_get_time();

/**
 * @iot {struct} ChipInfo
 * @iotName ChipInfo
 * @iotGroup System
 * @iotVersion 1.0.0
 *
 * @iotDescription Estructura con informacion del chip ESP32.
 *
 * @iotParam {uint8_t} cores Numero de nucleos CPU (1 o 2)
 * @iotParam {uint8_t} revision Revision del silicon
 * @iotParam {uint32_t} features Mascara de caracteristicas (WiFi, BT, BLE)
 * @iotParam {uint32_t} flash_size Tamano de flash en bytes
 *
 * @iotSince 1.0.0
 */
typedef struct {
    uint8_t cores;
    uint8_t revision;
    uint32_t features;
    uint32_t flash_size;
} ChipInfo;

#endif // SYSTEM_HPP
