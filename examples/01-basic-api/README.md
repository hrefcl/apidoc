# Example 01: Basic API

Este ejemplo demuestra el uso básico de APIDoc para documentar una API REST simple sin complejidades adicionales.

## Objetivo

Mostrar las anotaciones fundamentales de APIDoc:
- `@api` - Definir método HTTP y ruta
- `@apiName` - Nombre único del endpoint
- `@apiGroup` - Agrupar endpoints relacionados
- `@apiDescription` - Descripción detallada
- `@apiParam` - Parámetros de entrada
- `@apiSuccess` - Respuesta exitosa
- `@apiError` - Respuestas de error
- `@apiExample` - Ejemplos de uso

## Endpoints Incluidos

Este ejemplo documenta una API simple de gestión de empresas (Company API):

- **POST /api/company** - Crear nueva empresa
- **GET /api/company/:id** - Obtener empresa por ID
- **PUT /api/company/:id** - Actualizar empresa existente
- **DELETE /api/company/:id** - Eliminar empresa

## Estructura

```
01-basic-api/
├── README.md              # Este archivo
├── apidoc.json           # Configuración del ejemplo
├── src/
│   └── company.js        # Endpoints de Company API
└── output/               # Documentación generada (gitignored)
```

## Generar Documentación

Desde esta carpeta:

```bash
# Usando CLI v5
apidoc generate -c apidoc.json -o output/

# Ver documentación
npx serve output/
```

Desde la raíz del proyecto:

```bash
# Generar este ejemplo específico
./bin/apidoc generate -c examples/01-basic-api/apidoc.json -o examples/01-basic-api/output/
```

## Características Demostradas

- ✅ Anotaciones básicas de APIDoc
- ✅ Documentación de métodos HTTP (GET, POST, PUT, DELETE)
- ✅ Parámetros en path (`/api/company/:id`)
- ✅ Parámetros en body (JSON)
- ✅ Respuestas de éxito y error
- ✅ Ejemplos de uso con curl
- ✅ Agrupación de endpoints relacionados

## Notas

- Este ejemplo NO incluye:
  - Versionado de API
  - Autenticación
  - OpenAPI externo
  - MQTT
  - Multi-idioma (i18n)

Para ver estos features, consulta los ejemplos 02-10 en `/examples/`.
