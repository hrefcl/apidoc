/**
 * Products API - Using Sequelize Models
 *
 * This file demonstrates how to document REST API endpoints that use
 * Sequelize ORM models with @apiSchema annotations.
 */

/**
 * @api {post} /api/products Create Product
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Create a new product in the database using Sequelize model
 *
 * @apiParam {String{3..100}} name Product name (required)
 * @apiParam {String{0..500}} [description] Product description (optional)
 * @apiParam {Number} price Product price (required, must be > 0)
 * @apiParam {String} sku Stock Keeping Unit (required, unique, format: XXX-NNNN)
 * @apiParam {Number} stock Available stock quantity (required, >= 0)
 * @apiParam {Number} categoryId Category ID (required, must exist)
 * @apiParam {String="active","inactive","discontinued"} [status=active] Product status
 * @apiParam {String} [imageUrl] Product image URL (must be valid URL)
 * @apiParam {Object} [metadata] Additional product metadata (JSON)
 *
 * @apiSuccess {Number} id Product unique identifier
 * @apiSuccess {String} name Product name
 * @apiSuccess {String} description Product description
 * @apiSuccess {Number} price Product price
 * @apiSuccess {String} sku Stock Keeping Unit
 * @apiSuccess {Number} stock Stock quantity
 * @apiSuccess {Number} categoryId Category ID
 * @apiSuccess {String} status Product status
 * @apiSuccess {String} imageUrl Product image URL
 * @apiSuccess {Object} metadata Product metadata
 * @apiSuccess {Date} createdAt Creation timestamp
 * @apiSuccess {Date} updatedAt Update timestamp
 *
 * @apiError (400) {String} error Validation error message
 * @apiError (404) {String} error Category not found
 * @apiError (409) {String} error SKU already exists
 *
 * @apiExample {curl} Example:
 *     curl -X POST https://api.example.com/api/products \
 *       -H "Content-Type: application/json" \
 *       -d '{
 *         "name": "Wireless Mouse",
 *         "description": "Ergonomic wireless mouse with USB receiver",
 *         "price": 29.99,
 *         "sku": "ELC-1001",
 *         "stock": 150,
 *         "categoryId": 1,
 *         "status": "active",
 *         "imageUrl": "https://example.com/images/mouse.jpg",
 *         "metadata": {
 *           "color": "black",
 *           "warranty": "1 year"
 *         }
 *       }'
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": 1,
 *       "name": "Wireless Mouse",
 *       "description": "Ergonomic wireless mouse with USB receiver",
 *       "price": 29.99,
 *       "sku": "ELC-1001",
 *       "stock": 150,
 *       "categoryId": 1,
 *       "status": "active",
 *       "imageUrl": "https://example.com/images/mouse.jpg",
 *       "metadata": {
 *         "color": "black",
 *         "warranty": "1 year"
 *       },
 *       "createdAt": "2025-01-09T10:00:00.000Z",
 *       "updatedAt": "2025-01-09T10:00:00.000Z"
 *     }
 *
 * @apiErrorExample {json} Validation Error:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Validation error: price must be greater than 0"
 *     }
 *
 * @apiErrorExample {json} SKU Conflict:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "error": "SKU 'ELC-1001' already exists"
 *     }
 */
function createProduct(req, res) {
  // Implementation: Product.create(req.body)
}

/**
 * @api {get} /api/products/:id Get Product
 * @apiName GetProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Retrieve a product by ID with category information
 *
 * @apiParam {Number} id Product unique identifier
 *
 * @apiSuccess {Number} id Product unique identifier
 * @apiSuccess {String} name Product name
 * @apiSuccess {String} description Product description
 * @apiSuccess {Number} price Product price
 * @apiSuccess {String} sku Stock Keeping Unit
 * @apiSuccess {Number} stock Stock quantity
 * @apiSuccess {Number} categoryId Category ID
 * @apiSuccess {String} status Product status
 * @apiSuccess {String} imageUrl Product image URL
 * @apiSuccess {Object} metadata Product metadata
 * @apiSuccess {Date} createdAt Creation timestamp
 * @apiSuccess {Date} updatedAt Update timestamp
 * @apiSuccess {Object} category Category information
 * @apiSuccess {Number} category.id Category ID
 * @apiSuccess {String} category.name Category name
 * @apiSuccess {String} category.description Category description
 *
 * @apiError (404) {String} error Product not found
 *
 * @apiExample {curl} Example:
 *     curl -X GET https://api.example.com/api/products/1
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "name": "Wireless Mouse",
 *       "description": "Ergonomic wireless mouse with USB receiver",
 *       "price": 29.99,
 *       "sku": "ELC-1001",
 *       "stock": 150,
 *       "categoryId": 1,
 *       "status": "active",
 *       "imageUrl": "https://example.com/images/mouse.jpg",
 *       "metadata": {
 *         "color": "black",
 *         "warranty": "1 year"
 *       },
 *       "createdAt": "2025-01-09T10:00:00.000Z",
 *       "updatedAt": "2025-01-09T10:00:00.000Z",
 *       "category": {
 *         "id": 1,
 *         "name": "Electronics",
 *         "description": "Electronic devices and accessories"
 *       }
 *     }
 *
 * @apiErrorExample {json} Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Product not found"
 *     }
 */
function getProduct(req, res) {
  // Implementation: Product.findByPk(req.params.id, { include: 'category' })
}

/**
 * @api {get} /api/products List Products
 * @apiName ListProducts
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription List all products with optional filtering by category and status
 *
 * @apiParam {Number} [categoryId] Filter by category ID
 * @apiParam {String="active","inactive","discontinued"} [status] Filter by status
 * @apiParam {Number{1..100}} [limit=20] Number of products per page
 * @apiParam {Number{0..}} [offset=0] Offset for pagination
 * @apiParam {String="name","price","createdAt"} [sortBy=createdAt] Sort field
 * @apiParam {String="ASC","DESC"} [sortOrder=DESC] Sort order
 *
 * @apiSuccess {Object[]} products Array of products
 * @apiSuccess {Number} products.id Product ID
 * @apiSuccess {String} products.name Product name
 * @apiSuccess {Number} products.price Product price
 * @apiSuccess {String} products.sku SKU
 * @apiSuccess {Number} products.stock Stock quantity
 * @apiSuccess {String} products.status Product status
 * @apiSuccess {Object} products.category Category info
 * @apiSuccess {Number} count Total count of products
 * @apiSuccess {Number} limit Items per page
 * @apiSuccess {Number} offset Current offset
 *
 * @apiExample {curl} Example - All Products:
 *     curl -X GET https://api.example.com/api/products
 *
 * @apiExample {curl} Example - Filter by Category:
 *     curl -X GET "https://api.example.com/api/products?categoryId=1&limit=10"
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "products": [
 *         {
 *           "id": 1,
 *           "name": "Wireless Mouse",
 *           "price": 29.99,
 *           "sku": "ELC-1001",
 *           "stock": 150,
 *           "status": "active",
 *           "category": {
 *             "id": 1,
 *             "name": "Electronics"
 *           }
 *         }
 *       ],
 *       "count": 42,
 *       "limit": 20,
 *       "offset": 0
 *     }
 */
function listProducts(req, res) {
  // Implementation: Product.findAndCountAll({ where, limit, offset, include })
}

/**
 * @api {put} /api/products/:id Update Product
 * @apiName UpdateProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Update product information (partial update supported)
 *
 * @apiParam {Number} id Product unique identifier
 * @apiParam {String{3..100}} [name] Product name
 * @apiParam {String{0..500}} [description] Product description
 * @apiParam {Number} [price] Product price (must be > 0)
 * @apiParam {Number} [stock] Stock quantity (>= 0)
 * @apiParam {Number} [categoryId] Category ID (must exist)
 * @apiParam {String="active","inactive","discontinued"} [status] Product status
 * @apiParam {String} [imageUrl] Product image URL
 * @apiParam {Object} [metadata] Product metadata
 *
 * @apiSuccess {Number} id Product unique identifier
 * @apiSuccess {String} name Product name
 * @apiSuccess {String} description Product description
 * @apiSuccess {Number} price Product price
 * @apiSuccess {String} sku Stock Keeping Unit
 * @apiSuccess {Number} stock Stock quantity
 * @apiSuccess {Number} categoryId Category ID
 * @apiSuccess {String} status Product status
 * @apiSuccess {String} imageUrl Product image URL
 * @apiSuccess {Object} metadata Product metadata
 * @apiSuccess {Date} createdAt Creation timestamp
 * @apiSuccess {Date} updatedAt Update timestamp (updated)
 *
 * @apiError (400) {String} error Validation error
 * @apiError (404) {String} error Product not found
 *
 * @apiExample {curl} Example:
 *     curl -X PUT https://api.example.com/api/products/1 \
 *       -H "Content-Type: application/json" \
 *       -d '{
 *         "price": 24.99,
 *         "stock": 200,
 *         "status": "active"
 *       }'
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "name": "Wireless Mouse",
 *       "description": "Ergonomic wireless mouse with USB receiver",
 *       "price": 24.99,
 *       "sku": "ELC-1001",
 *       "stock": 200,
 *       "categoryId": 1,
 *       "status": "active",
 *       "imageUrl": "https://example.com/images/mouse.jpg",
 *       "metadata": {
 *         "color": "black",
 *         "warranty": "1 year"
 *       },
 *       "createdAt": "2025-01-09T10:00:00.000Z",
 *       "updatedAt": "2025-01-09T11:30:00.000Z"
 *     }
 */
function updateProduct(req, res) {
  // Implementation: Product.update(req.body, { where: { id: req.params.id } })
}

/**
 * @api {delete} /api/products/:id Delete Product
 * @apiName DeleteProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Delete a product from the database (hard delete)
 *
 * @apiParam {Number} id Product unique identifier
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {Number} id Deleted product ID
 *
 * @apiError (404) {String} error Product not found
 *
 * @apiExample {curl} Example:
 *     curl -X DELETE https://api.example.com/api/products/1
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Product deleted successfully",
 *       "id": 1
 *     }
 *
 * @apiErrorExample {json} Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Product not found"
 *     }
 */
function deleteProduct(req, res) {
  // Implementation: Product.destroy({ where: { id: req.params.id } })
}

/**
 * @api {post} /api/categories Create Category
 * @apiName CreateCategory
 * @apiGroup Categories
 * @apiVersion 1.0.0
 * @apiDescription Create a new product category
 *
 * @apiParam {String{3..50}} name Category name (required, unique)
 * @apiParam {String{0..200}} [description] Category description
 *
 * @apiSuccess {Number} id Category unique identifier
 * @apiSuccess {String} name Category name
 * @apiSuccess {String} description Category description
 * @apiSuccess {Date} createdAt Creation timestamp
 * @apiSuccess {Date} updatedAt Update timestamp
 *
 * @apiError (400) {String} error Validation error
 * @apiError (409) {String} error Category name already exists
 *
 * @apiExample {curl} Example:
 *     curl -X POST https://api.example.com/api/categories \
 *       -H "Content-Type: application/json" \
 *       -d '{
 *         "name": "Electronics",
 *         "description": "Electronic devices and accessories"
 *       }'
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": 1,
 *       "name": "Electronics",
 *       "description": "Electronic devices and accessories",
 *       "createdAt": "2025-01-09T10:00:00.000Z",
 *       "updatedAt": "2025-01-09T10:00:00.000Z"
 *     }
 */
function createCategory(req, res) {
  // Implementation: Category.create(req.body)
}

/**
 * @api {get} /api/categories/:id/products Get Category Products
 * @apiName GetCategoryProducts
 * @apiGroup Categories
 * @apiVersion 1.0.0
 * @apiDescription Get all products in a specific category
 *
 * @apiParam {Number} id Category unique identifier
 *
 * @apiSuccess {Number} id Category ID
 * @apiSuccess {String} name Category name
 * @apiSuccess {String} description Category description
 * @apiSuccess {Object[]} products Array of products in this category
 * @apiSuccess {Number} products.id Product ID
 * @apiSuccess {String} products.name Product name
 * @apiSuccess {Number} products.price Product price
 * @apiSuccess {String} products.sku SKU
 * @apiSuccess {Number} products.stock Stock quantity
 * @apiSuccess {String} products.status Product status
 *
 * @apiError (404) {String} error Category not found
 *
 * @apiExample {curl} Example:
 *     curl -X GET https://api.example.com/api/categories/1/products
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "name": "Electronics",
 *       "description": "Electronic devices and accessories",
 *       "products": [
 *         {
 *           "id": 1,
 *           "name": "Wireless Mouse",
 *           "price": 29.99,
 *           "sku": "ELC-1001",
 *           "stock": 150,
 *           "status": "active"
 *         }
 *       ]
 *     }
 */
function getCategoryProducts(req, res) {
  // Implementation: Category.findByPk(id, { include: 'products' })
}
