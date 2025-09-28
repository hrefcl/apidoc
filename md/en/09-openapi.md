---
title: "OpenAPI 3.0 Support & Schema Integration"
category: "Modern Protocols"
order: 9
---

# 🔄 OpenAPI 3.0 Support & Schema Integration

Complete guide for integrating APIDoc with OpenAPI 3.0 specifications, schema validation, and modern API development workflows.

## 🚀 Overview

APIDoc 4.0 provides comprehensive OpenAPI 3.0 integration for modern API development:

- **📄 Schema Export**: Convert APIDoc to OpenAPI 3.0
- **🔄 Bidirectional Sync**: Import from OpenAPI specifications
- **✅ Schema Validation**: Automatic request/response validation
- **🧪 Interactive Testing**: Swagger UI integration
- **📋 Standards Compliance**: Full OpenAPI 3.0 specification support

## 📄 OpenAPI Export

### Basic Export Configuration
```json
{
  "name": "My API",
  "version": "1.0.0",
  "description": "RESTful API with OpenAPI support",
  "openapi": {
    "export": true,
    "version": "3.0.3",
    "outputFile": "openapi.json",
    "servers": [
      {
        "url": "https://api.example.com/v1",
        "description": "Production server"
      },
      {
        "url": "https://staging-api.example.com/v1",
        "description": "Staging server"
      }
    ],
    "info": {
      "contact": {
        "name": "API Support",
        "email": "api-support@example.com",
        "url": "https://example.com/support"
      },
      "license": {
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
      }
    }
  }
}
```

### APIDoc to OpenAPI Mapping
```javascript
/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new user account with validation and email verification.
 *
 * @apiBody {String{2..50}} name User's full name
 * @apiBody {String} email Valid email address
 * @apiBody {String{8..}} password Strong password
 * @apiBody {String="user","admin","moderator"} [role=user] User role
 * @apiBody {Object} [profile] User profile data
 * @apiBody {String} [profile.bio] Profile biography
 * @apiBody {String[]} [profile.interests] User interests
 *
 * @apiSuccess (201) {Number} id User ID
 * @apiSuccess (201) {String} name User's name
 * @apiSuccess (201) {String} email User's email
 * @apiSuccess (201) {String} role User's role
 * @apiSuccess (201) {Boolean} active Account status
 * @apiSuccess (201) {Object} profile User profile
 * @apiSuccess (201) {Date} createdAt Creation timestamp
 *
 * @apiError (400) {String} error="ValidationError" Validation failed
 * @apiError (400) {String} message Error description
 * @apiError (400) {Object[]} [errors] Field-specific errors
 * @apiError (409) {String} error="ConflictError" Email already exists
 *
 * @apiExample {json} Request Example:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "securePassword123",
 *   "role": "user",
 *   "profile": {
 *     "bio": "Software developer",
 *     "interests": ["technology", "music"]
 *   }
 * }
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 201 Created
 * {
 *   "id": 1,
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "role": "user",
 *   "active": true,
 *   "profile": {
 *     "bio": "Software developer",
 *     "interests": ["technology", "music"]
 *   },
 *   "createdAt": "2024-01-15T10:30:00Z"
 * }
 */
```

### Generated OpenAPI Schema
```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "My API",
    "version": "1.0.0",
    "description": "RESTful API with OpenAPI support",
    "contact": {
      "name": "API Support",
      "email": "api-support@example.com",
      "url": "https://example.com/support"
    },
    "license": {
      "name": "MIT",
      "url": "https://opensource.org/licenses/MIT"
    }
  },
  "servers": [
    {
      "url": "https://api.example.com/v1",
      "description": "Production server"
    }
  ],
  "paths": {
    "/users": {
      "post": {
        "tags": ["Users"],
        "summary": "Create User",
        "description": "Creates a new user account with validation and email verification.",
        "operationId": "CreateUser",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateUserRequest"
              },
              "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "securePassword123",
                "role": "user",
                "profile": {
                  "bio": "Software developer",
                  "interests": ["technology", "music"]
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "User created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                },
                "example": {
                  "id": 1,
                  "name": "John Doe",
                  "email": "john@example.com",
                  "role": "user",
                  "active": true,
                  "profile": {
                    "bio": "Software developer",
                    "interests": ["technology", "music"]
                  },
                  "createdAt": "2024-01-15T10:30:00Z"
                }
              }
            }
          },
          "400": {
            "description": "Validation error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ValidationError"
                }
              }
            }
          },
          "409": {
            "description": "Email already exists",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConflictError"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "CreateUserRequest": {
        "type": "object",
        "required": ["name", "email", "password"],
        "properties": {
          "name": {
            "type": "string",
            "minLength": 2,
            "maxLength": 50,
            "description": "User's full name"
          },
          "email": {
            "type": "string",
            "format": "email",
            "description": "Valid email address"
          },
          "password": {
            "type": "string",
            "minLength": 8,
            "description": "Strong password"
          },
          "role": {
            "type": "string",
            "enum": ["user", "admin", "moderator"],
            "default": "user",
            "description": "User role"
          },
          "profile": {
            "$ref": "#/components/schemas/UserProfile"
          }
        }
      },
      "User": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "description": "User ID"
          },
          "name": {
            "type": "string",
            "description": "User's name"
          },
          "email": {
            "type": "string",
            "format": "email",
            "description": "User's email"
          },
          "role": {
            "type": "string",
            "enum": ["user", "admin", "moderator"],
            "description": "User's role"
          },
          "active": {
            "type": "boolean",
            "description": "Account status"
          },
          "profile": {
            "$ref": "#/components/schemas/UserProfile"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Creation timestamp"
          }
        }
      },
      "UserProfile": {
        "type": "object",
        "properties": {
          "bio": {
            "type": "string",
            "description": "Profile biography"
          },
          "interests": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "User interests"
          }
        }
      },
      "ValidationError": {
        "type": "object",
        "properties": {
          "error": {
            "type": "string",
            "example": "ValidationError"
          },
          "message": {
            "type": "string",
            "description": "Error description"
          },
          "errors": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "field": {
                  "type": "string"
                },
                "message": {
                  "type": "string"
                }
              }
            }
          }
        }
      },
      "ConflictError": {
        "type": "object",
        "properties": {
          "error": {
            "type": "string",
            "example": "ConflictError"
          },
          "message": {
            "type": "string",
            "description": "Error description"
          }
        }
      }
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      },
      "apiKey": {
        "type": "apiKey",
        "in": "header",
        "name": "X-API-Key"
      }
    }
  }
}
```

## 🔄 OpenAPI Import

### Import Configuration
```json
{
  "openapi": {
    "import": true,
    "source": "./specs/openapi.json",
    "generateDocs": true,
    "generateStubs": true,
    "outputDir": "./generated/",
    "options": {
      "includeExamples": true,
      "generateValidation": true,
      "preserveCustom": true
    }
  }
}
```

### Import from URL
```javascript
// scripts/import-openapi.js
const apidoc = require('@hrefcl/apidoc');
const fetch = require('node-fetch');
const fs = require('fs').promises;

async function importFromURL(url, outputPath) {
  try {
    console.log(`📥 Importing OpenAPI spec from ${url}...`);

    // Fetch OpenAPI specification
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const openApiSpec = await response.json();

    // Save to local file
    await fs.writeFile(outputPath, JSON.stringify(openApiSpec, null, 2));

    // Generate APIDoc documentation
    const success = await apidoc.createDoc({
      src: outputPath,
      dest: './docs-from-openapi/',
      openapi: {
        import: true,
        source: outputPath,
        generateDocs: true
      }
    });

    if (success) {
      console.log('✅ Documentation generated from OpenAPI spec');
    } else {
      throw new Error('Documentation generation failed');
    }

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    throw error;
  }
}

// Usage
const specUrl = 'https://petstore.swagger.io/v2/swagger.json';
const localPath = './specs/imported-openapi.json';

importFromURL(specUrl, localPath);
```

## ✅ Schema Validation

### Request Validation
```javascript
/**
 * @api {post} /products Create Product
 * @apiName CreateProduct
 * @apiGroup Products
 *
 * @apiSchema {Object} Product
 * @apiSchema Product.name {String{2..100}} Product name
 * @apiSchema Product.price {Number{0.01..}} Product price
 * @apiSchema Product.category {String="electronics","clothing","books"} Category
 * @apiSchema Product.tags {String[]} Product tags
 * @apiSchema Product.specifications {Object} Technical specifications
 * @apiSchema Product.specifications.weight {Number} Weight in kg
 * @apiSchema Product.specifications.dimensions {Object} Dimensions
 * @apiSchema Product.specifications.dimensions.length {Number} Length in cm
 * @apiSchema Product.specifications.dimensions.width {Number} Width in cm
 * @apiSchema Product.specifications.dimensions.height {Number} Height in cm
 *
 * @apiBody {Product} product Product data
 *
 * @apiSuccess {Number} id Product ID
 * @apiSuccess {Product} product Created product
 *
 * @apiExample {json} Request Example:
 * {
 *   "product": {
 *     "name": "Wireless Headphones",
 *     "price": 99.99,
 *     "category": "electronics",
 *     "tags": ["wireless", "bluetooth", "music"],
 *     "specifications": {
 *       "weight": 0.25,
 *       "dimensions": {
 *         "length": 20,
 *         "width": 18,
 *         "height": 8
 *       }
 *     }
 *   }
 * }
 */
```

### Response Validation
```javascript
/**
 * @api {get} /products/:id Get Product
 * @apiName GetProduct
 * @apiGroup Products
 *
 * @apiParam {Number} id Product ID
 *
 * @apiSuccess {Number} id Product ID
 * @apiSuccess {String} name Product name
 * @apiSuccess {Number} price Product price
 * @apiSuccess {String} category Product category
 * @apiSuccess {String[]} tags Product tags
 * @apiSuccess {Object} specifications Technical specifications
 * @apiSuccess {Boolean} available Availability status
 * @apiSuccess {Number} stock Stock quantity
 * @apiSuccess {Date} createdAt Creation timestamp
 * @apiSuccess {Date} updatedAt Last update timestamp
 *
 * @apiError (404) {String} error="NotFound" Product not found
 * @apiError (400) {String} error="InvalidId" Invalid product ID
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "name": "Wireless Headphones",
 *   "price": 99.99,
 *   "category": "electronics",
 *   "tags": ["wireless", "bluetooth", "music"],
 *   "specifications": {
 *     "weight": 0.25,
 *     "dimensions": {
 *       "length": 20,
 *       "width": 18,
 *       "height": 8
 *     }
 *   },
 *   "available": true,
 *   "stock": 15,
 *   "createdAt": "2024-01-15T09:00:00Z",
 *   "updatedAt": "2024-01-15T12:30:00Z"
 * }
 */
```

## 🧪 Swagger UI Integration

### Basic Swagger UI Setup
```json
{
  "template": {
    "swaggerUI": {
      "enabled": true,
      "path": "/swagger",
      "theme": "dark",
      "options": {
        "deepLinking": true,
        "displayRequestDuration": true,
        "tryItOutEnabled": true,
        "requestInterceptor": true,
        "responseInterceptor": true
      }
    }
  }
}
```

### Custom Swagger UI Configuration
```html
<!-- template/swagger-ui.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{{title}} - Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="./swagger-ui.css" />
  <link rel="icon" type="image/png" href="./favicon.png" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="./swagger-ui-bundle.js"></script>
  <script src="./swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: './openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        requestInterceptor: function(request) {
          // Add custom headers
          request.headers['X-Custom-Header'] = 'APIDoc-Generated';
          return request;
        },
        responseInterceptor: function(response) {
          // Log responses for debugging
          console.log('API Response:', response);
          return response;
        }
      });
    };
  </script>
</body>
</html>
```

## 📋 Advanced Schema Features

### Complex Data Types
```javascript
/**
 * @api {post} /orders Create Order
 * @apiName CreateOrder
 * @apiGroup Orders
 *
 * @apiBody {Object} order Order data
 * @apiBody {Number} order.customerId Customer ID
 * @apiBody {Object[]} order.items Order items
 * @apiBody {Number} order.items.productId Product ID
 * @apiBody {Number{1..}} order.items.quantity Item quantity
 * @apiBody {Number} [order.items.unitPrice] Custom unit price
 * @apiBody {Object} order.shipping Shipping information
 * @apiBody {String} order.shipping.method Shipping method
 * @apiBody {Object} order.shipping.address Delivery address
 * @apiBody {String} order.shipping.address.street Street address
 * @apiBody {String} order.shipping.address.city City
 * @apiBody {String} order.shipping.address.country Country code
 * @apiBody {String} order.shipping.address.postalCode Postal code
 * @apiBody {Object} [order.payment] Payment information
 * @apiBody {String="credit_card","paypal","bank_transfer"} order.payment.method Payment method
 * @apiBody {String} [order.payment.token] Payment token
 *
 * @apiSuccess {Number} id Order ID
 * @apiSuccess {String} status Order status
 * @apiSuccess {Number} total Order total
 * @apiSuccess {Object[]} items Order items with details
 * @apiSuccess {Object} shipping Shipping information
 * @apiSuccess {Date} estimatedDelivery Estimated delivery date
 *
 * @apiExample {json} Request Example:
 * {
 *   "order": {
 *     "customerId": 123,
 *     "items": [
 *       {
 *         "productId": 1,
 *         "quantity": 2,
 *         "unitPrice": 99.99
 *       },
 *       {
 *         "productId": 2,
 *         "quantity": 1
 *       }
 *     ],
 *     "shipping": {
 *       "method": "express",
 *       "address": {
 *         "street": "123 Main St",
 *         "city": "New York",
 *         "country": "US",
 *         "postalCode": "10001"
 *       }
 *     },
 *     "payment": {
 *       "method": "credit_card",
 *       "token": "tok_1234567890"
 *     }
 *   }
 * }
 */
```

### Conditional Schemas
```javascript
/**
 * @api {put} /users/:id Update User
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiParam {Number} id User ID
 *
 * @apiBody {Object} user User update data
 * @apiBody {String{2..50}} [user.name] User's full name
 * @apiBody {String} [user.email] Valid email address
 * @apiBody {Object} [user.profile] User profile data
 * @apiBody {String} [user.profile.bio] Profile biography
 * @apiBody {String[]} [user.profile.interests] User interests
 * @apiBody {Object} [user.profile.social] Social media links
 * @apiBody {String} [user.profile.social.twitter] Twitter handle
 * @apiBody {String} [user.profile.social.linkedin] LinkedIn URL
 * @apiBody {Object} [user.preferences] User preferences
 * @apiBody {Boolean} [user.preferences.emailNotifications] Email notifications
 * @apiBody {Boolean} [user.preferences.smsNotifications] SMS notifications
 * @apiBody {String="light","dark","auto"} [user.preferences.theme] UI theme
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 * @apiSuccess {Object} profile User profile
 * @apiSuccess {Object} preferences User preferences
 * @apiSuccess {Date} updatedAt Last update timestamp
 *
 * @apiExample {json} Partial Update Example:
 * {
 *   "user": {
 *     "profile": {
 *       "bio": "Updated biography",
 *       "interests": ["technology", "music", "travel"]
 *     },
 *     "preferences": {
 *       "theme": "dark",
 *       "emailNotifications": false
 *     }
 *   }
 * }
 */
```

## 🔧 Custom OpenAPI Extensions

### APIDoc Extensions
```javascript
/**
 * @api {get} /analytics/reports Generate Report
 * @apiName GenerateReport
 * @apiGroup Analytics
 *
 * @apiExtension x-rate-limit {Object} Rate limiting information
 * @apiExtension x-rate-limit.requests {Number} 100 Requests per hour
 * @apiExtension x-rate-limit.window {String} "1h" Time window
 * @apiExtension x-cache-ttl {Number} 300 Cache TTL in seconds
 * @apiExtension x-feature-flag {String} "analytics-v2" Feature flag
 *
 * @apiQuery {String="daily","weekly","monthly"} period Report period
 * @apiQuery {Date} startDate Start date (ISO format)
 * @apiQuery {Date} endDate End date (ISO format)
 * @apiQuery {String[]} [metrics] Specific metrics to include
 *
 * @apiSuccess {Object} report Generated report
 * @apiSuccess {String} report.id Report ID
 * @apiSuccess {String} report.period Report period
 * @apiSuccess {Object} report.data Report data
 * @apiSuccess {Date} report.generatedAt Generation timestamp
 *
 * @apiExample {curl} cURL Example:
 * curl -X GET "https://api.example.com/analytics/reports?period=weekly&startDate=2024-01-01&endDate=2024-01-07" \
 *   -H "Authorization: Bearer your-token"
 */
```

### Generated OpenAPI with Extensions
```json
{
  "paths": {
    "/analytics/reports": {
      "get": {
        "tags": ["Analytics"],
        "summary": "Generate Report",
        "operationId": "GenerateReport",
        "x-rate-limit": {
          "requests": 100,
          "window": "1h"
        },
        "x-cache-ttl": 300,
        "x-feature-flag": "analytics-v2",
        "parameters": [
          {
            "name": "period",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "enum": ["daily", "weekly", "monthly"]
            }
          }
        ]
      }
    }
  }
}
```

## 🛠️ CLI Integration

### Export Command
```bash
# Generate OpenAPI specification
apidoc -i src/ -o docs/ --openapi

# Export to specific file
apidoc -i src/ -o docs/ --openapi-output openapi.yaml

# Include Swagger UI
apidoc -i src/ -o docs/ --openapi --swagger-ui

# Validate against OpenAPI spec
apidoc -i src/ -o docs/ --openapi --validate
```

### Import Command
```bash
# Import from OpenAPI file
apidoc --import-openapi specs/api.json -o docs/

# Import from URL
apidoc --import-openapi https://api.example.com/openapi.json -o docs/

# Generate code stubs
apidoc --import-openapi specs/api.json --generate-stubs -o generated/
```

## 📋 Best Practices

### 1. Schema Design
- ✅ Use consistent naming conventions
- ✅ Define reusable components
- ✅ Include validation constraints
- ✅ Provide meaningful descriptions

### 2. Documentation Quality
- ✅ Include comprehensive examples
- ✅ Document all error scenarios
- ✅ Use realistic test data
- ✅ Maintain schema accuracy

### 3. Integration Workflow
- ✅ Validate schemas in CI/CD
- ✅ Keep OpenAPI specs synchronized
- ✅ Version schemas properly
- ✅ Monitor schema breaking changes

### 4. Performance
- ✅ Use schema references for large objects
- ✅ Minimize schema complexity
- ✅ Cache generated specifications
- ✅ Optimize Swagger UI loading

APIDoc's OpenAPI 3.0 integration provides seamless compatibility with modern API development tools while maintaining the simplicity and power of comment-based documentation.