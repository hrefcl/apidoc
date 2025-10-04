---
title: "apidoc.json Configuration"
category: "Configuration"
order: 1
---

# 📋 apidoc.json Configuration - APIDoc 5.0

APIDoc configuration is done through the `apidoc.json` file (or within `package.json` under the `"apidoc"` section).

## 🎯 Basic Configuration

### Minimal structure

```json
{
  "name": "My API",
  "version": "1.0.0",
  "description": "My API Documentation",
  "title": "My API Documentation",
  "url": "https://api.example.com"
}
```

### Complete configuration (All REAL options)

```json
{
  "name": "LexCorp Api documentation",
  "version": "5.0.0",
  "description": "Documentation for the REST api access provided at LexCorp",
  "title": "Href ApiDoc 5",
  "url": "https://api.example.com",
  "sampleUrl": "https://api.example.com",

  "inputs": {
    "docs": ["./md"],
    "api": ["."],
    "models": ["../models"]
  },

  "apicat": {
    "enabled": true,
    "outputDir": "./apicat-output"
  },

  "login": {
    "active": true,
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "admited": [
      {
        "email": "admin@lexcorp.com",
        "password": "admin123",
        "name": "LexCorp Administrator",
        "role": "admin"
      }
    ]
  },

  "header": {
    "title": "Introduction",
    "filename": "header.md",
    "icon": "fa-home"
  },

  "footer": {
    "title": "Best Practices",
    "filename": "footer.md",
    "icon": "fa-lightbulb"
  },

  "logo": {
    "icon": "fa-solid fa-rocket",
    "alt": "API Logo"
  },

  "order": ["Users", "Company", "System", "City", "Category"],

  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Users",
      "filename": "user.md"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Company",
      "filename": "company.md"
    }
  },

  "template": {
    "showRequiredLabels": false,
    "withCompare": true,
    "withGenerator": true,
    "aloneDisplay": false,
    "forceLanguage": "es"
  },

  "documentation": "./example/*.md",

  "mqtt": {
    "enabled": true,
    "broker": {
      "host": "test.mosquitto.org",
      "port": 8081,
      "protocol": "wss"
    },
    "authentication": {
      "username": "demo-user",
      "password": "demo-pass-123",
      "clientId": "apidoc-mqtt-client-demo"
    },
    "options": {
      "keepalive": 60,
      "connectTimeout": 30000,
      "reconnectPeriod": 1000,
      "clean": true
    }
  }
}
```

---

## ⚙️ Configuration Parameters

### 1. Project Information

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `name` | String | Project name | `"My API"` |
| `version` | String | Project version | `"5.0.0"` |
| `description` | String | Project description | `"API for user management"` |
| `title` | String | Title displayed in browser | `"My API Documentation"` |
| `url` | String | API base URL | `"https://api.example.com"` |
| `sampleUrl` | String/Boolean | URL for test forms | `"https://api.example.com"` |
| `homepage` | String | Project homepage URL | `"https://example.com"` |

---

### 2. Data Sources System (`inputs`)

**✨ NEW IN v5.0**: Flexible system to specify multiple data sources with customizable categories.

#### 2.1 New Format (Recommended): `inputs` object

```json
{
  "inputs": {
    "docs": ["./md"],
    "tsdoc": ["../core"],
    "api": ["."],
    "models": ["../model/sq/"],
    "controllers": ["../controllers"],
    "services": ["../services"]
  }
}
```

**Benefits**:
- 🎯 **Clear organization**: Semantic categories for different code types
- 📁 **Multiple sources**: Combine files from different directories
- 🔧 **Flexible**: Define your own custom categories
- 📊 **Traceability**: Logs show which category each file comes from

**Common Categories**:

| Category | Description | Example |
|----------|-------------|---------|
| `docs` | Documentation markdown files | `["./md", "./docs"]` |
| `tsdoc` | TypeScript code with TSDoc | `["../core", "../lib"]` |
| `api` | API endpoints and routes | `["."]` |
| `models` | Data models | `["../models", "../schemas"]` |
| `controllers` | Application controllers | `["../controllers"]` |
| `services` | Services and business logic | `["../services"]` |

**Complete example** with multiple sources:

```json
{
  "name": "My Complete API",
  "version": "2.0.0",
  "inputs": {
    "documentation": ["./md/api", "./md/guides"],
    "rest-api": ["./routes", "./controllers"],
    "graphql": ["./graphql/schema", "./graphql/resolvers"],
    "models": ["./models/user", "./models/company"],
    "typescript-interfaces": ["../shared/types"]
  }
}
```

**Log Output Example**:
```
📁 Using categorized "inputs" configuration from apidoc.json
  ✓ documentation: ./md/api, ./md/guides
  ✓ rest-api: ./routes, ./controllers
  ✓ graphql: ./graphql/schema, ./graphql/resolvers
  ✓ models: ./models/user, ./models/company
  ✓ typescript-interfaces: ../shared/types
```

#### 2.1.1 Parser Filtering by Category

**✨ NEW IN v5.0**: Predefined categories execute **only relevant parsers** for that content type.

**Predefined Categories with Filtering**:

| Category | Enabled Parsers | Files | Usage |
|----------|----------------|-------|-------|
| `api` | `@api`, `@apiParam`, `@apiSuccess`, `@apiError`, etc. | `.js`, `.ts`, `.php`, `.py` | REST API endpoints |
| `models` | `@model`, `@apiSchema`, `@apiDefine` | `.ts`, `.js`, `.json` | Data models & schemas |
| `tsdoc` | `@apiSchema`, `@apiDefine`, `@apiUse` | `.ts`, `.tsx`, `.d.ts` | TypeScript documentation |
| `mqtt` | `@mqtt`, `@topic`, `@qos`, `@payload` | `.js`, `.ts` | MQTT/IoT protocols |
| `docs` | (none) | `.md`, `.markdown` | Markdown files |

**Example with Filtering**:
```json
{
  "inputs": {
    "api": ["./routes"],      // Only REST API parsers
    "models": ["./models"]    // Only model/schema parsers
  }
}
```

**Filtering Benefits**:
- ⚡ **Performance**: Only runs relevant parsers (not 50+ parsers on every file)
- 🎯 **Precision**: Avoids incorrect parsing of tags in wrong contexts
- 📊 **Clarity**: Logs show which parsers are being skipped

**See Filtering in Debug**:
```bash
apidoc --debug --config apidoc.json -o output/ 2>&1 | grep "Skipping parser"
```

Output:
```
debug: Skipping parser 'apidefine' for category 'api' in block: '0'
debug: Skipping parser 'model' for category 'api' in block: '1'
```

📖 **Complete Documentation**: See [Parser System by Category](./CATEGORY-PARSERS.md)

#### 2.2 Legacy Format: `input` array

**Backwards compatibility** - The old format still works:

```json
{
  "input": [".", "../models", "./docs"]
}
```

**Differences**:
- ❌ No semantic categorization
- ❌ Less informative logs
- ✅ Compatible with previous versions

**Recommendation**: Migrate to `inputs` object for better organization.

#### 2.3 Usage with CLI v5

When using `inputs` in `apidoc.json`, you must specify the configuration file path with `-c` or `--config`:

```bash
# ✅ Correct - specify configuration file
apidoc generate --config examples/apicat/apidoc.json -o docs/

# ❌ Incorrect - old syntax (no longer supported in v5)
apidoc -i examples/apicat -o docs/
```

**Why?** Paths in `inputs` are **relative to the directory where `apidoc.json` is located**, not to the directory from where you execute the command.

**Complete example**:
```bash
# Project structure
/my-project/
  ├── examples/
  │   └── apicat/
  │       └── apidoc.json    # inputs: { api: ["."], models: ["../../models"] }
  ├── models/
  └── docs/

# Execute from /my-project/
apidoc --config examples/apicat/apidoc.json -o docs/
```

Paths will resolve correctly:
- `"api": ["."]` → `/my-project/examples/apicat/`
- `"models": ["../../models"]` → `/my-project/models/`

**CLI v5 Syntax**:
```bash
# Use 'generate' subcommand
apidoc generate -c examples/apicat/apidoc.json -o docs/  # -c is alias for --config

# Complete format
apidoc generate --config path/to/config.json -o output/

# Interactive mode (new in v5)
apidoc                    # Shows interactive menu

# Watch mode for development
apidoc generate -c apidoc.json -o docs/ --watch
```

---

### 3. apiCAT Plugin (Vue 3 Template System)

**⚠️ IMPORTANT**: If you use `template: 'apidoc-template-v5'`, apiCAT is **automatically activated**.

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `apicat.enabled` | Boolean | Enable/disable apiCAT plugin | `false` |
| `apicat.outputDir` | String | Output directory for modular JSON files | `'./apicat-output'` |

**Example**:
```json
{
  "apicat": {
    "enabled": true,
    "outputDir": "./apicat-output"
  }
}
```

**What does apiCAT do?**
- Generates modular JSON structure for Vue 3 template
- Creates `cat.api.index.json` with endpoint metadata
- Generates shards in `cat.api/` for lazy loading
- Processes custom markdown per group
- Encrypts JSONs if `login.active: true`

---

### 3. Authentication and Encryption System (`login`)

Complete dual authentication system with AES-256-GCM encryption.

#### 3.1 Local Authentication (No server)

```json
{
  "login": {
    "active": true,
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "admited": [
      {
        "email": "admin@company.com",
        "password": "admin123",
        "name": "Admin User",
        "role": "admin"
      },
      {
        "email": "dev@company.com",
        "passwordHash": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
        "name": "Developer",
        "role": "developer"
      }
    ]
  }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `login.active` | Boolean | **Activates authentication AND JSON encryption** |
| `login.encryptionKey` | String | AES-256-GCM key in Base64/Hex (32 bytes) |
| `login.admited[]` | Array | List of authorized users (local authentication) |
| `login.admited[].email` | String | User email |
| `login.admited[].password` | String | Password in plain text |
| `login.admited[].passwordHash` | String | SHA-256 hashed password (more secure) |
| `login.admited[].name` | String | User name |
| `login.admited[].role` | String | User role |

**Generate encryption key**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Generate password hash**:
```bash
echo -n "mypassword" | openssl dgst -sha256 | awk '{print $2}'
```

#### 3.2 Server Authentication

```json
{
  "login": {
    "active": true,
    "encryptionKeyFromServer": true,
    "urlAuth": "https://api.company.com/auth/login",
    "value_form": {
      "email": "email",
      "password": "password"
    },
    "response_success": 200,
    "response_error": 401
  }
}
```

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `login.encryptionKeyFromServer` | Boolean | Key comes from server, not embedded | `false` |
| `login.urlAuth` | String | Authentication endpoint URL | - |
| `login.value_form` | Object | Login form field mapping | - |
| `login.value_form.email` | String | Email field name | `"email"` |
| `login.value_form.password` | String | Password field name | `"password"` |
| `login.response_success` | Number | HTTP code for successful authentication | `200` |
| `login.response_error` | Number | HTTP code for authentication error | `401` |

**Expected server response**:
```json
{
  "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
  "user": {
    "email": "user@company.com",
    "name": "Example User"
  }
}
```

#### 3.3 Automatic Encryption System

**When `login.active: true`**:

✅ **AES-256-GCM encryption** of all JSON files
✅ **Key obfuscation** (split into 4 segments + decoys)
✅ **`admited` list encryption** before embedding in HTML
✅ **Auto-generation of keys** (generates `.apicat-key` if no `encryptionKey`)
✅ **JWT with 24h expiration** stored in sessionStorage

**Encrypted file format**:
```json
{
  "data": "I7VpNOIMCzP+svYebMtozhAU...",
  "iv": "vAhusuHblGAsySg1PVAdTg==",
  "tag": "qVRg2imfBd3msMMJd1bjiQ==",
  "algorithm": "aes-256-gcm",
  "encrypted_at": "2025-09-29T18:13:20.862Z",
  "version": "1.0"
}
```

**See also**: [🔐 Authentication System](./12-authentication.md)

---

### 4. Header and Footer

Custom sections that appear in navigation.

```json
{
  "header": {
    "title": "Introduction",
    "filename": "header.md",
    "content": "# Welcome\nInline content...",
    "icon": "fa-home"
  },
  "footer": {
    "title": "Contact",
    "filename": "footer.md",
    "icon": "fa-envelope"
  }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `header.title` | String | Header navigation title |
| `header.filename` | String | Header markdown file (relative to apidoc.json) |
| `header.content` | String | Inline markdown content (alternative to filename) |
| `header.icon` | String | Font Awesome icon (e.g., `"fa-home"`) |
| `footer.title` | String | Footer navigation title |
| `footer.filename` | String | Footer markdown file |
| `footer.content` | String | Inline markdown content |
| `footer.icon` | String | Font Awesome icon (e.g., `"fa-lightbulb"`) |

---

### 5. Logo

```json
{
  "logo": {
    "icon": "fa-solid fa-rocket",
    "alt": "API Logo"
  }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `logo.icon` | String | Font Awesome 6.0+ icon (e.g., `"fa-solid fa-rocket"`) |
| `logo.alt` | String | Logo alternative text |

---

### 6. Group Order (`order`)

Defines the order in which groups appear in navigation.

```json
{
  "order": ["Users", "Company", "System", "City", "Category"]
}
```

**Functionality**:
- Listed groups appear in specified order
- Unlisted groups appear at the end in alphabetical order

---

### 7. Per-Group Configuration (`settings`)

Customize each group with icon, title, and markdown content.

```json
{
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Users",
      "filename": "user.md"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Company",
      "filename": "company.md"
    }
  }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `settings.{Group}.icon` | String | Font Awesome icon for the group |
| `settings.{Group}.title` | String | Custom group title |
| `settings.{Group}.filename` | String | Markdown file with custom content |

**Processing**:
- Markdown files are converted to HTML with `markdown-it`
- HTML is injected at the beginning of each group
- Supports code, tables, lists, and inline HTML

**See also**: [📄 Custom Markdown](./03-custom-markdown.md)

---

### 8. Template Configuration

```json
{
  "template": {
    "showRequiredLabels": false,
    "withCompare": true,
    "withGenerator": true,
    "aloneDisplay": false,
    "forceLanguage": "es"
  }
}
```

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `template.showRequiredLabels` | Boolean | Show "required"/"optional" labels on parameters | `false` |
| `template.withCompare` | Boolean | Enable endpoint version comparison | `false` |
| `template.withGenerator` | Boolean | Include generator information in footer | `true` |
| `template.aloneDisplay` | Boolean | Display one endpoint per page | `false` |
| `template.forceLanguage` | String | Force specific language (es, en, fr, de, etc.) | Auto-detect |

---

### 9. Markdown Documentation (`documentation`)

Glob pattern to include additional markdown files.

```json
{
  "documentation": "./example/*.md"
}
```

**Processing**:
- Reads all files matching the pattern
- Converts markdown to HTML
- Generates array of documents with metadata
- Appears in "Docs" section of the template

**Generated structure**:
```javascript
[
  {
    filename: "intro",
    title: "Introduction",
    content: "<h1>Introduction</h1><p>...",
    icon: "fa-book"
  }
]
```

---

### 10. MQTT Configuration (Template)

**⚠️ NOTE**: This configuration is for the **template** (web client), not for backend testing.

```json
{
  "mqtt": {
    "enabled": true,
    "broker": {
      "host": "test.mosquitto.org",
      "port": 8081,
      "protocol": "wss"
    },
    "authentication": {
      "username": "demo-user",
      "password": "demo-pass-123",
      "clientId": "apidoc-mqtt-client-demo"
    },
    "ssl": {
      "enabled": false,
      "rejectUnauthorized": true,
      "ca": "/path/to/ca.crt",
      "cert": "/path/to/client.crt",
      "key": "/path/to/client.key"
    },
    "options": {
      "keepalive": 60,
      "connectTimeout": 30000,
      "reconnectPeriod": 1000,
      "clean": true
    }
  }
}
```

#### Broker Configuration

| Parameter | Type | Description |
|-----------|------|-------------|
| `mqtt.enabled` | Boolean | Enable MQTT functionality |
| `mqtt.broker.host` | String | MQTT broker host |
| `mqtt.broker.port` | Number | Broker port |
| `mqtt.broker.protocol` | String | Protocol (ws, wss, mqtt, mqtts) |

#### Authentication

| Parameter | Type | Description |
|-----------|------|-------------|
| `mqtt.authentication.username` | String | MQTT user |
| `mqtt.authentication.password` | String | MQTT password |
| `mqtt.authentication.clientId` | String | MQTT client ID |

#### SSL/TLS

| Parameter | Type | Description |
|-----------|------|-------------|
| `mqtt.ssl.enabled` | Boolean | Enable SSL/TLS |
| `mqtt.ssl.rejectUnauthorized` | Boolean | Validate SSL certificates |
| `mqtt.ssl.ca` | String | Path to CA certificate |
| `mqtt.ssl.cert` | String | Path to client certificate |
| `mqtt.ssl.key` | String | Path to private key |

#### Connection Options

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `mqtt.options.keepalive` | Number | Keepalive in seconds | `60` |
| `mqtt.options.connectTimeout` | Number | Connection timeout (ms) | `30000` |
| `mqtt.options.reconnectPeriod` | Number | Reconnection period (ms) | `1000` |
| `mqtt.options.clean` | Boolean | Clean session | `true` |

**See also**: [📡 MQTT Protocol](./10-mqtt.md)

---

### 11. Repository and Bugs

```json
{
  "bugs": {
    "url": "https://github.com/user/repo/issues"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/user/repo.git"
  }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `bugs.url` | String | URL to report bugs |
| `repository.type` | String | Repository type (git, svn) |
| `repository.url` | String | Repository URL |

---

## 🔗 Usage in package.json

As an alternative to `apidoc.json`, you can include configuration in `package.json`:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My project description",
  "apidoc": {
    "title": "My API Documentation",
    "url": "https://api.example.com",
    "sampleUrl": "https://api.example.com",
    "order": ["User", "Admin"],
    "template": {
      "withCompare": true,
      "forceLanguage": "es"
    }
  }
}
```

---

## 📂 Path Resolution

### Markdown files

Resolved **relative to the directory where `apidoc.json` is located**:

```
project/
├── apidoc.json
├── header.md          ← "header.md"
├── docs/
│   └── footer.md      ← "docs/footer.md"
└── example/
    └── intro.md       ← "./example/*.md"
```

### Font Awesome Icons

Use Font Awesome 6.0+ classes:

```json
{
  "icon": "fa-user"           // Regular
  "icon": "fa-solid fa-rocket" // Solid
  "icon": "fa-brands fa-github" // Brands
}
```

---

## 🌍 Multi-language Support

### Available languages

- `en` - English
- `es` - Español
- `fr` - Français
- `de` - Deutsch
- `it` - Italiano
- `pt` - Português
- `ru` - Русский
- `zh` - 中文
- `ja` - 日本語
- `ko` - 한국어

### Force language

```json
{
  "template": {
    "forceLanguage": "es"
  }
}
```

Without `forceLanguage`, the template automatically detects browser language.

---

## ⚠️ Unimplemented Options

The following options appear in examples but **are NOT implemented**:

- ❌ `apicat.generateCollections` - Variable defined but not used
- ❌ `apicat.enableLocalTesting` - Variable defined but not used
- ❌ `template.groupsCollapsible` - Not used in code
- ❌ `template.endpointsCollapsible` - Not used in code

**Don't use them in your configuration**, they will have no effect.

---

## 📋 Complete Real Example

See: `examples/apicat/apidoc.json` for a complete functional example.

---

**See Also:**
- [🎨 Icons and Customization](./02-customization.md)
- [📄 Custom Markdown](./03-custom-markdown.md)
- [🔐 Authentication System](./12-authentication.md)
- [📡 MQTT Protocol](./10-mqtt.md)
