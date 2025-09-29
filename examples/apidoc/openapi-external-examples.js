/**
 * OpenAPI External File Reference Examples
 *
 * This file demonstrates the new capability to reference external OpenAPI files
 * instead of writing the entire specification inline in comments.
 */

/**
 * Example 1: Reference complete external JSON file
 * @openapi {openapi=./schemas/users-api.json}
 */
function loadUsersFromExternalJson() {
    // This function references the complete users-api.json specification
    // All paths and operations from the external file will be loaded
}

/**
 * Example 2: Reference specific path from external JSON file
 *
 * @openapi /api/users/{id} {openapi=./schemas/users-api.json}
 */
function getUserById() {
    // This function references only the /api/users/{id} path from users-api.json
    // Only GET operation for this specific path will be loaded
}

/**
 * Example 3: Reference complete external YAML file
 *
 * @openapi {openapi=./schemas/products-api.yaml}
 */
function loadProductsFromExternalYaml() {
    // This function references the complete products-api.yaml specification
    // All paths and operations from the external file will be loaded
}

/**
 * Example 4: Reference specific path from external YAML file
 *
 * @openapi /api/products/{id} {openapi=./schemas/products-api.yaml}
 */
function getProductById() {
    // This function references only the /api/products/{id} path from products-api.yaml
    // Both GET and PUT operations for this path will be loaded
}

/**
 * Example 5: Mixed approach - external file + inline documentation
 *
 * @openapi /api/users {openapi=./schemas/users-api.json}
 * @apiVersion 2.1.0
 * @apiGroup Users
 *
 * @apiDescription This endpoint is loaded from an external OpenAPI specification
 * but can still be enhanced with additional APIDoc tags for documentation.
 *
 * @apiExample {curl} Example Request:
 * curl -X POST https://api.example.com/api/users \
 *   -H "Content-Type: application/json" \
 *   -d '{"name": "John Doe", "email": "john@example.com"}'
 */
function createUserFromExternal() {
    // This combines external OpenAPI spec with additional APIDoc documentation
}

/**
 * Example 6: Traditional inline OpenAPI (for comparison)
 *
 * @openapi
 * /api/inline-example:
 *   get:
 *     summary: Inline OpenAPI example
 *     description: This is defined directly in the comment
 *     tags: [Examples]
 *     x-version: "1.0.0"
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This is an inline example"
 */
function inlineOpenApiExample() {
    // This is the traditional way - OpenAPI spec written directly in comments
    // Still supported and can be mixed with external file references
}

/**
 * Example 7: Multiple external references in one file
 *
 * @openapi /api/users/{id} {openapi=./schemas/users-api.json}
 * @openapi /api/products/{id} {openapi=./schemas/products-api.yaml}
 */
function multipleExternalReferences() {
    // This function demonstrates referencing multiple external files
    // Each @openapi tag can reference a different external file
}

// Export functions for module system compatibility
module.exports = {
    loadUsersFromExternalJson,
    getUserById,
    loadProductsFromExternalYaml,
    getProductById,
    createUserFromExternal,
    inlineOpenApiExample,
    multipleExternalReferences,
};
