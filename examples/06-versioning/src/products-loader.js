/**
 * Products API - Multi-Version Loader
 *
 * This file loads versions 1.0.0, 2.0.0, and 3.0.0 from the external OpenAPI specification.
 * Version 4.0.0 is documented in products-v4.js using native APIDoc annotations.
 *
 * This demonstrates the hybrid approach: combining OpenAPI files with native APIDoc.
 */

/**
 * Load Products API versions 1.0.0, 2.0.0, and 3.0.0 from OpenAPI file
 *
 * This loads the complete multi-version OpenAPI specification which contains:
 * - GET /api/products/{id} → v1.0.0
 * - PUT /api/products/{id} → v1.0.0
 * - GET /api/products-v2/{id} → v2.0.0
 * - PUT /api/products-v2/{id} → v2.0.0
 * - GET /api/products-v3/{id} → v3.0.0
 * - PUT /api/products-v3/{id} → v3.0.0
 *
 * @openapi {openapi=./schemas/products-multi-version.yaml}
 */
function loadProductsMultiVersion() {
  // This function loads all paths from products-multi-version.yaml
  // Versions 1.0.0, 2.0.0, 3.0.0 are defined in the OpenAPI file
}

// Export for module system compatibility
module.exports = {
  loadProductsMultiVersion,
};
