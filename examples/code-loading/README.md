# Complete Example - All APIDoc Features

Este ejemplo demuestra **TODAS** las funcionalidades de APIDoc 5.0.5:

## ✅ Funcionalidades Demostradas

### 1. 🔧 `@apiSchema` con TypeScript Interfaces

Carga parámetros y respuestas desde interfaces TypeScript:

```typescript
/**
 * @apiSchema (Query) {interface=AddFloorRequest} apiParam
 * @apiSchema (Success 200) {interface=AddFloorResponse} apiSuccess
 * @apiSchema (Error 4xx) {interface=ThinmooErrorResponse} apiError
 */
```

**Beneficios:**
- ✅ Type-safe: Los tipos se validan en compile-time
- ✅ Auto-documentado: Las descripciones vienen de los JSDoc comments
- ✅ DRY: Un solo lugar para definir tipos y documentación
- ✅ Sincronizado: Los cambios en el código se reflejan automáticamente en la docs

### 2. 📄 `@apiSchema` con JSON Files

Carga ejemplos de success/error desde archivos JSON:

```typescript
/**
 * @apiSchema (Success 200) {json=examples/responses/floor-success.json} apiSuccessExample
 * @apiSchema (Error 404) {json=examples/responses/floor-error-notfound.json} apiErrorExample
 * @apiSchema (Error 409) {json=examples/responses/floor-error-duplicate.json} apiErrorExample
 */
```

**Beneficios:**
- ✅ Ejemplos reales: Usa responses reales de tu API
- ✅ Múltiples ejemplos: Muestra diferentes casos de error
- ✅ Mantenible: Los ejemplos están en archivos separados
- ✅ Formato JSON: Syntax highlighting automático

### 3. 💻 `@apiCode` para Ejemplos de Código

Carga ejemplos de código desde archivos externos:

```typescript
/**
 * @apiCode (bash) {file=examples/code/floor-curl-numeric.sh} cURL Example (Numeric Floor)
 * @apiCode (bash) {file=examples/code/floor-curl-ground.sh} cURL Example (Ground Floor)
 * @apiCode (javascript) {file=examples/code/floor-js.js} JavaScript Example
 * @apiCode (python) {file=examples/code/floor-python.py} Python Example
 */
```

**Beneficios:**
- ✅ Multi-lenguaje: Muestra ejemplos en bash, JavaScript, Python, etc.
- ✅ Syntax highlighting: Coloreado automático según el lenguaje
- ✅ Auto-detección: Detecta el lenguaje desde la extensión del archivo
- ✅ Código real: Usa archivos de código que puedes ejecutar y testear
- ✅ Tab labels: Muestra "Bash", "JavaScript", "Python" en los tabs

**Lenguajes soportados:**
- `bash`, `sh`, `javascript`, `typescript`, `python`, `java`, `go`, `php`, `ruby`, `rust`
- Y muchos más... (cualquier lenguaje con highlight.js)

### 4. 🔑 `@apiSchema` para Headers

Define headers desde interfaces TypeScript:

```typescript
/**
 * @apiSchema {interface=AuthHeaders} apiHeader
 */
export interface AuthHeaders {
    /** JWT access token obtained from /auth/token endpoint */
    accessToken: string;

    /** Optional content type (defaults to application/json) */
    'Content-Type'?: string;
}
```

**Beneficios:**
- ✅ Type-safe: Headers tipados con TypeScript
- ✅ Auto-documentado: Descripciones desde JSDoc
- ✅ Optional support: El `?` marca headers opcionales

### 5. 📋 `@apiSchema` para Header Examples

Carga ejemplos de headers desde archivos JSON:

```typescript
/**
 * @apiSchema {json=examples/headers/auth-headers.json} apiHeaderExample
 */
```

**Archivo JSON:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Beneficios:**
- ✅ Ejemplos reales: Headers de requests reales
- ✅ JSON format: Automáticamente formateado
- ✅ Mantenible: Headers en archivo separado

## 📁 Estructura de Archivos

```
examples/test-code-loading/
├── README.md                          # Este archivo
├── apidoc.json                        # Configuración
├── complete-example.ts                # ⭐ Endpoint completo con TODO
├── file-loading.js                    # Ejemplo simple de @apiCode
│
├── examples/
│   ├── code/                          # Ejemplos de código para @apiCode
│   │   ├── floor-curl-numeric.sh     # cURL ejemplo (numeric floor)
│   │   ├── floor-curl-ground.sh      # cURL ejemplo (ground floor)
│   │   ├── floor-js.js               # JavaScript ejemplo
│   │   └── floor-python.py           # Python ejemplo
│   │
│   ├── responses/                     # Ejemplos JSON para @apiSchema
│   │   ├── floor-success.json        # Success response
│   │   ├── floor-error-notfound.json # Error 404
│   │   └── floor-error-duplicate.json # Error 409
│   │
│   └── headers/                       # Ejemplos de headers para @apiSchema
│       └── auth-headers.json          # Authentication headers example
```

## 🚀 Cómo Usar Este Ejemplo

### 1. Generar la documentación:

```bash
npm run build
node bin/apidoc generate -i examples/test-code-loading -o tmp/test-code-output -c examples/test-code-loading/apidoc.json
```

### 2. Ver la documentación:

```bash
npx serve tmp/test-code-output
```

### 3. Abrir en el browser:

```
http://localhost:3000
```

## 🎯 Lo Que Verás en la Documentación

### Endpoint: GET /sqFloor/extapi/add

**1. Parameters Section:**
- ✅ 5 parámetros cargados desde `AddFloorRequest` interface
- ✅ Tipos TypeScript convertidos a tipos de API
- ✅ Descripciones desde JSDoc comments

**2. Success Response Section:**
- ✅ Estructura de respuesta desde `AddFloorResponse` interface
- ✅ 11 campos documentados automáticamente
- ✅ Ejemplo JSON cargado desde archivo

**3. Error Response Section:**
- ✅ Estructura de error desde `ThinmooErrorResponse` interface
- ✅ 2 ejemplos de error (404 Building Not Found, 409 Duplicate Floor)
- ✅ Cada error con su código y mensaje específico

**4. Code Examples Section:**
- ✅ 4 ejemplos de código en tabs
- ✅ Tab labels: "Bash", "JavaScript", "Python"
- ✅ Syntax highlighting correcto para cada lenguaje
- ✅ Código completo y ejecutable

**5. Headers Section:**
- ✅ Headers cargados desde `AuthHeaders` interface
- ✅ 1 header documentado (accessToken)
- ✅ Ejemplo JSON cargado desde archivo
- ✅ Formato automático con syntax highlighting

## 💡 Mejores Prácticas

### ✅ DO:

1. **Usa `@apiSchema` con interfaces para parameters y responses:**
   - Mantiene tipos sincronizados entre código y docs
   - Una sola fuente de verdad

2. **Usa `@apiSchema` con JSON files para ejemplos:**
   - Usa responses reales de tu API
   - Múltiples ejemplos para diferentes casos

3. **Usa `@apiCode` para ejemplos de código:**
   - Código que puedes ejecutar y testear
   - Múltiples lenguajes para diferentes audiencias

4. **Organiza los archivos en carpetas:**
   - `examples/code/` para código
   - `examples/responses/` para JSON responses

### ❌ DON'T:

1. **No uses `@apiExample` inline para código largo:**
   - Usa `@apiCode` con archivos externos
   - Mejor mantenibilidad

2. **No definas parámetros manualmente si tienes interfaces:**
   - Usa `@apiSchema` con interfaces
   - Evita duplicación

3. **No copies ejemplos JSON inline si son largos:**
   - Usa `@apiSchema` con archivos JSON
   - Mejor legibilidad

## 🔧 Troubleshooting

### Warnings sobre parámetros no en URL:

```
warn: @apiParam 'extCommunityUuid' was defined but does not appear in URL
```

**Solución:** Estos son query parameters, el warning es esperado para GET requests con query params.

### Tipos incorrectos en ejemplos:

Si los tabs muestran "text" en lugar del lenguaje:
1. Verifica que el tipo esté especificado: `@apiCode (bash) {file=...}`
2. Verifica que el archivo tenga la extensión correcta: `.sh`, `.js`, `.py`
3. Rebuildeá el proyecto: `npm run build`

## 📊 Verificación

Para verificar que todo funciona correctamente:

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('tmp/test-code-output/index.html', 'utf8');
const match = html.match(/window\.__APICAT_DATA__ = ({.*?});/s);
const data = JSON.parse(match[1]);
const endpoint = data.api.floor.endpoints[0];

console.log('Parameters:', endpoint.parameters?.length || 0);
console.log('Success fields:', endpoint.success?.fields?.length || 0);
console.log('Success examples:', endpoint.success?.examples?.length || 0);
console.log('Error examples:', endpoint.error?.examples?.length || 0);
console.log('Code examples:', endpoint.examples?.length || 0);

endpoint.examples?.forEach(ex => {
  console.log(\`  - [\${ex.type}] \${ex.title}\`);
});
"
```

**Output esperado:**
```
Parameters: 5
Success fields: 11
Success examples: 1
Error examples: 2
Code examples: 4
  - [bash] cURL Example (Numeric Floor)
  - [bash] cURL Example (Ground Floor)
  - [javascript] JavaScript Example
  - [python] Python Example
```

## ✅ Resultado Final

Este ejemplo demuestra un endpoint **completamente documentado** usando:
- ✅ TypeScript interfaces para types
- ✅ JSON files para ejemplos de responses
- ✅ Archivos de código externos para ejemplos multi-lenguaje
- ✅ Headers con ejemplos inline
- ✅ Syntax highlighting correcto
- ✅ Tab labels apropiados para cada lenguaje

**Total features usadas: 8/8** 🎉

| Feature | Status | Descripción |
|---------|--------|-------------|
| `@apiSchema {interface=...} apiParam` | ✅ | Parameters desde TypeScript |
| `@apiSchema {interface=...} apiSuccess` | ✅ | Success response desde TypeScript |
| `@apiSchema {interface=...} apiError` | ✅ | Error response desde TypeScript |
| `@apiSchema {interface=...} apiHeader` | ✅ | Headers desde TypeScript |
| `@apiSchema {json=...} apiSuccessExample` | ✅ | Success ejemplo desde JSON |
| `@apiSchema {json=...} apiErrorExample` | ✅ | Error ejemplos desde JSON |
| `@apiSchema {json=...} apiHeaderExample` | ✅ | Header ejemplo desde JSON |
| `@apiCode (lang) {file=...}` | ✅ | Código desde archivos externos |
