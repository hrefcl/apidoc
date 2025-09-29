## 🏢 Gestión de Empresa

Los endpoints de empresa permiten administrar la configuración y datos corporativos.

### Configuración de Precios

El sistema de precios es flexible y permite múltiples modelos:

- **Precio fijo**: Tarifa única sin variaciones
- **Precio multiplicador**: Tarifa base × factor dinámico
- **Precio extra**: Tarifa base + cargo adicional fijo

### Ejemplo de Configuración

```json
{
  "active": true,
  "type": "multiplicador",
  "multiplier": 1.5,
  "fixed_extra": 10.00
}
```

### Políticas de Actualización

⚠️ **Importante**: Las actualizaciones de precios requieren aprobación del administrador y entran en vigor en el siguiente ciclo de facturación.

### Soft Updates

Las actualizaciones suaves permiten cambios graduales sin afectar el servicio:

1. Se valida la configuración propuesta
2. Se programa el cambio para la próxima ventana de mantenimiento
3. Se notifica a todos los usuarios afectados
4. Se ejecuta el cambio con rollback automático si hay errores