## 🗺️ Gestión de Ciudades

### Información sobre Localización

Nuestro sistema de ciudades permite gestionar ubicaciones geográficas con precisión.

#### Características principales:

- **Geocodificación**: Conversión automática de direcciones a coordenadas
- **Búsqueda inteligente**: Búsqueda por nombre, código postal o coordenadas
- **Integración con mapas**: Compatible con Google Maps y OpenStreetMap

### Formato de Datos

Las ciudades se almacenan con la siguiente estructura:

```json
{
  "id": "12345",
  "name": "Santiago",
  "country": "Chile",
  "region": "Metropolitana",
  "coordinates": {
    "lat": -33.4489,
    "lng": -70.6693
  },
  "timezone": "America/Santiago"
}
```

> 🌍 **Nota**: Todas las coordenadas se almacenan en formato WGS84 (EPSG:4326).