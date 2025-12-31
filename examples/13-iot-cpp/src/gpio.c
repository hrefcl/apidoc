/**
 * @file gpio.c
 * @brief GPIO control functions for ESP32
 */

#include <stdint.h>
#include <stdbool.h>

/**
 * @iot {define} GPIO_MODE_INPUT
 * @iotName GPIO_MODE_INPUT
 * @iotGroup GPIO
 * @iotVersion 1.0.0
 *
 * @iotDescription Constante para configurar pin como entrada.
 *
 * @iotSince 1.0.0
 */
#define GPIO_MODE_INPUT  1

/**
 * @iot {define} GPIO_MODE_OUTPUT
 * @iotName GPIO_MODE_OUTPUT
 * @iotGroup GPIO
 * @iotVersion 1.0.0
 *
 * @iotDescription Constante para configurar pin como salida.
 *
 * @iotSince 1.0.0
 */
#define GPIO_MODE_OUTPUT 2

/**
 * @iot {function} gpio_set_level
 * @iotName GpioSetLevel
 * @iotGroup GPIO
 * @iotVersion 1.0.0
 * @iotPlatform {ESP32,ESP8266,Arduino}
 *
 * @iotDescription Establece el nivel logico de un pin GPIO configurado como salida.
 *
 * @iotParam {uint8_t} gpio_num Numero de GPIO (0-39)
 * @iotParam {uint8_t} level Nivel logico (0=LOW, 1=HIGH)
 *
 * @iotReturn {int} ESP_OK (0) si la operacion fue exitosa
 *
 * @iotError (GPIO) {int} ESP_ERR_INVALID_ARG GPIO invalido o no configurado como salida
 *
 * @iotExample {c} LED Blink:
 *     gpio_set_direction(GPIO_NUM_2, GPIO_MODE_OUTPUT);
 *     while(1) {
 *         gpio_set_level(GPIO_NUM_2, 1);  // LED ON
 *         vTaskDelay(500 / portTICK_PERIOD_MS);
 *         gpio_set_level(GPIO_NUM_2, 0);  // LED OFF
 *         vTaskDelay(500 / portTICK_PERIOD_MS);
 *     }
 *
 * @iotSee gpio_get_level
 * @iotSince 1.0.0
 */
int gpio_set_level(uint8_t gpio_num, uint8_t level);

/**
 * @iot {function} gpio_get_level
 * @iotName GpioGetLevel
 * @iotGroup GPIO
 * @iotVersion 1.0.0
 * @iotPlatform {ESP32,ESP8266,Arduino}
 *
 * @iotDescription Lee el nivel logico actual de un pin GPIO.
 *
 * @iotParam {uint8_t} gpio_num Numero de GPIO (0-39)
 *
 * @iotReturn {int} Nivel actual (0 o 1)
 *
 * @iotExample {c} Read Button:
 *     gpio_set_direction(GPIO_NUM_0, GPIO_MODE_INPUT);
 *     int button_state = gpio_get_level(GPIO_NUM_0);
 *     if (button_state == 0) {
 *         printf("Button pressed!\n");
 *     }
 *
 * @iotSee gpio_set_level
 * @iotSince 1.0.0
 */
int gpio_get_level(uint8_t gpio_num);

/**
 * @iot {function} gpio_set_direction
 * @iotName GpioSetDirection
 * @iotGroup GPIO
 * @iotVersion 1.0.0
 * @iotPlatform {ESP32,ESP8266,Arduino}
 *
 * @iotDescription Configura la direccion de un pin GPIO.
 *
 * @iotParam {uint8_t} gpio_num Numero de GPIO (0-39)
 * @iotParam {int} mode Modo de operacion:
 * - `GPIO_MODE_INPUT` (1) - Entrada
 * - `GPIO_MODE_OUTPUT` (2) - Salida
 * - `GPIO_MODE_INPUT_OUTPUT` (3) - Bidireccional
 *
 * @iotReturn {int} ESP_OK si fue exitoso
 *
 * @iotExample {c} Configure Output:
 *     gpio_set_direction(GPIO_NUM_2, GPIO_MODE_OUTPUT);
 *
 * @iotSince 1.0.0
 */
int gpio_set_direction(uint8_t gpio_num, int mode);

/**
 * @iot {isr} gpio_isr_handler
 * @iotName GpioIsrHandler
 * @iotGroup GPIO
 * @iotVersion 1.0.0
 * @iotPlatform ESP32
 *
 * @iotDescription Manejador de interrupcion para eventos GPIO.
 * Esta funcion se ejecuta en contexto de interrupcion, debe ser rapida
 * y no puede usar funciones bloqueantes.
 *
 * @iotParam {void*} arg Argumento pasado al registrar el handler
 *
 * @iotReturn {void}
 *
 * @iotExample {c} ISR Handler:
 *     static void IRAM_ATTR gpio_isr_handler(void* arg) {
 *         uint32_t gpio_num = (uint32_t) arg;
 *         xQueueSendFromISR(gpio_evt_queue, &gpio_num, NULL);
 *     }
 *
 * @iotSince 1.0.0
 */
void gpio_isr_handler(void* arg);
