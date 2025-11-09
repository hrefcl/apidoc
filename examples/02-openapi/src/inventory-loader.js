/**
 * OpenAPI Integration Example - Inventory API
 *
 * This file demonstrates how to load external OpenAPI 3.0 specifications
 * into APIDoc v5 documentation.
 */

/**
 * Example 1: Load complete OpenAPI specification
 *
 * This loads ALL paths and operations from the external YAML file.
 * Use this when you want to include the entire API specification.
 *
 * @openapi {openapi=./schemas/inventory-api.yaml}
 */
function loadCompleteInventoryAPI() {
  // This function serves as the loader for the complete inventory-api.yaml specification
  // All 5 endpoints (GET/POST /api/inventory, GET/PUT/DELETE /api/inventory/:id) will be loaded
}

/**
 * Example 2: Mixing APIDoc native annotations with OpenAPI
 *
 * You can combine native APIDoc annotations with OpenAPI references.
 * This example shows a custom endpoint documented using native syntax.
 *
 * @api {get} /api/inventory/categories List Categories
 * @apiName ListInventoryCategories
 * @apiGroup Inventory
 * @apiVersion 1.0.0
 * @apiDescription Get a list of all available inventory categories.
 *
 * @apiSuccess {String[]} categories Array of category names
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "categories": [
 *         "Electronics",
 *         "Furniture",
 *         "Office Supplies",
 *         "Software"
 *       ]
 *     }
 *
 * @apiExample {curl} Example usage:
 *     curl -X GET https://api.example.com/api/inventory/categories
 */
function listInventoryCategories(req, res) {
  // Native APIDoc annotation - not from OpenAPI file
}

/**
 * Example 3: Loading specific path from OpenAPI
 *
 * If you want to load only specific paths from an OpenAPI file,
 * you can specify the path explicitly.
 *
 * Note: Example 1 already loads ALL paths, so this is just for demonstration.
 * In a real scenario, you'd use this approach when you DON'T want to load
 * the complete file.
 *
 * @openapi /api/inventory/{id} {openapi=./schemas/inventory-api.yaml}
 */
function loadSpecificInventoryPath() {
  // This would load only the /api/inventory/{id} path with its GET, PUT, DELETE operations
  // Commented out to avoid duplication with Example 1
}

// Export functions for module system compatibility
module.exports = {
  loadCompleteInventoryAPI,
  listInventoryCategories,
  loadSpecificInventoryPath,
};
