## ⚙️ Información del Sistema

### Health Check

El endpoint de health check permite verificar el estado del sistema en tiempo real.

#### Estados Posibles

- **🟢 Healthy**: Todos los servicios funcionan correctamente
- **🟡 Degraded**: Algunos servicios tienen problemas menores
- **🔴 Unhealthy**: Servicios críticos fallan

#### Monitoreo Recomendado

```bash
# Verificar estado cada 30 segundos
*/30 * * * * curl -f http://api.example.com/health || echo "API DOWN"
```

### Métricas del Sistema

El health check incluye métricas importantes:

| Métrica | Descripción | Umbral Crítico |
|---------|-------------|----------------|
| `response_time` | Tiempo de respuesta promedio | > 2000ms |
| `memory_usage` | Uso de memoria | > 85% |
| `cpu_usage` | Uso de CPU | > 90% |
| `disk_space` | Espacio en disco | < 10% libre |

> 📊 **Nota**: Las métricas se actualizan cada 5 minutos y se promedian en ventanas de 15 minutos.