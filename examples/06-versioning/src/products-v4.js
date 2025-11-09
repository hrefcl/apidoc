/**
 * Products API - Version 4.0.0
 *
 * This file demonstrates versioning using native APIDoc annotations
 * instead of external OpenAPI files.
 *
 * v4.0.0 introduces reviews and ratings functionality.
 */

/**
 * @api {get} /api/products/:id Get Product (Enhanced)
 * @apiName GetProductV4
 * @apiGroup Products
 * @apiVersion 4.0.0
 * @apiDescription Retrieve detailed product information including reviews and ratings (Version 4.0.0)
 *
 * **v4.0.0 Major New Features**:
 * - ✅ Product reviews system
 * - ✅ Average rating calculation
 * - ✅ Review count
 * - ✅ Detailed review information
 *
 * **Changelog from v3.0.0**:
 * - Added `rating` field (average rating 1-5)
 * - Added `review_count` field
 * - Added `reviews` array with detailed review data
 * - Optional `include_reviews` query parameter
 *
 * @apiParam {String} id Product unique identifier (UUID format)
 * @apiParam {Boolean} [include_reviews=false] Include detailed reviews in response (query parameter)
 *
 * @apiSuccess {String} id Product unique identifier
 * @apiSuccess {String} name Product name
 * @apiSuccess {Number} price Product price (USD)
 * @apiSuccess {String} category Product category
 * @apiSuccess {Boolean} in_stock Whether product is in stock
 * @apiSuccess {Number} quantity Available quantity
 * @apiSuccess {Number} rating Average rating (1-5 stars) - NEW in v4.0.0
 * @apiSuccess {Number} review_count Total number of reviews - NEW in v4.0.0
 * @apiSuccess {Object[]} [reviews] Array of product reviews (when include_reviews=true) - NEW in v4.0.0
 * @apiSuccess {String} reviews.id Review unique identifier
 * @apiSuccess {String} reviews.user_id User who wrote the review
 * @apiSuccess {String} reviews.user_name User's display name
 * @apiSuccess {Number} reviews.rating Review rating (1-5 stars)
 * @apiSuccess {String} reviews.comment Review comment
 * @apiSuccess {String} reviews.created_at Review creation timestamp (ISO 8601)
 *
 * @apiSuccessExample {json} Success Response (without reviews):
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "550e8400-e29b-41d4-a716-446655440000",
 *       "name": "Wireless Mouse",
 *       "price": 29.99,
 *       "category": "Electronics",
 *       "in_stock": true,
 *       "quantity": 150,
 *       "rating": 4.5,
 *       "review_count": 42
 *     }
 *
 * @apiSuccessExample {json} Success Response (with reviews):
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "550e8400-e29b-41d4-a716-446655440000",
 *       "name": "Wireless Mouse",
 *       "price": 29.99,
 *       "category": "Electronics",
 *       "in_stock": true,
 *       "quantity": 150,
 *       "rating": 4.5,
 *       "review_count": 42,
 *       "reviews": [
 *         {
 *           "id": "review-1",
 *           "user_id": "user-123",
 *           "user_name": "John Doe",
 *           "rating": 5,
 *           "comment": "Excellent product! Very responsive and comfortable.",
 *           "created_at": "2025-01-08T10:30:00Z"
 *         },
 *         {
 *           "id": "review-2",
 *           "user_id": "user-456",
 *           "user_name": "Jane Smith",
 *           "rating": 4,
 *           "comment": "Good value for money. Battery life could be better.",
 *           "created_at": "2025-01-07T15:45:00Z"
 *         }
 *       ]
 *     }
 *
 * @apiError (404) NotFound Product not found
 * @apiError (500) InternalServerError Server error
 *
 * @apiErrorExample {json} Error Response (404):
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "NotFound",
 *       "message": "Product with ID 550e8400-e29b-41d4-a716-446655440000 not found"
 *     }
 *
 * @apiExample {curl} Get product without reviews:
 *     curl -X GET https://api.example.com/api/products/550e8400-e29b-41d4-a716-446655440000
 *
 * @apiExample {curl} Get product with reviews:
 *     curl -X GET "https://api.example.com/api/products/550e8400-e29b-41d4-a716-446655440000?include_reviews=true"
 */
function getProductV4(req, res) {
  // Implementation for v4.0.0 with reviews support
}

/**
 * @api {put} /api/products/:id Update Product (Enhanced)
 * @apiName UpdateProductV4
 * @apiGroup Products
 * @apiVersion 4.0.0
 * @apiDescription Update product information (Version 4.0.0 - All features)
 *
 * **v4.0.0 Capabilities**:
 * - Update all product fields from previous versions
 * - Maintain compatibility with v1.0.0, v2.0.0, v3.0.0 fields
 * - Note: Reviews are updated via separate endpoint (POST /api/products/:id/reviews)
 *
 * @apiParam {String} id Product unique identifier (UUID format)
 * @apiParam {String} [name] Product name (optional, 1-200 characters)
 * @apiParam {Number} [price] Product price (optional, must be >= 0)
 * @apiParam {String} [category] Product category (optional)
 * @apiParam {Number} [quantity] Available quantity (optional, must be >= 0)
 *
 * @apiSuccess {String} id Product unique identifier
 * @apiSuccess {String} name Product name
 * @apiSuccess {Number} price Product price
 * @apiSuccess {String} category Product category
 * @apiSuccess {Boolean} in_stock Whether product is in stock
 * @apiSuccess {Number} quantity Available quantity
 * @apiSuccess {Number} rating Average rating (unchanged by this endpoint)
 * @apiSuccess {Number} review_count Review count (unchanged by this endpoint)
 * @apiSuccess {String} updated_at Last update timestamp (ISO 8601)
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "550e8400-e29b-41d4-a716-446655440000",
 *       "name": "Wireless Mouse Pro",
 *       "price": 34.99,
 *       "category": "Computer Accessories",
 *       "in_stock": true,
 *       "quantity": 200,
 *       "rating": 4.5,
 *       "review_count": 42,
 *       "updated_at": "2025-01-09T16:20:00Z"
 *     }
 *
 * @apiError (400) BadRequest Invalid input data
 * @apiError (404) NotFound Product not found
 * @apiError (500) InternalServerError Server error
 *
 * @apiErrorExample {json} Error Response (400):
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "BadRequest",
 *       "message": "Price must be a positive number"
 *     }
 *
 * @apiExample {curl} Example usage:
 *     curl -X PUT https://api.example.com/api/products/550e8400-e29b-41d4-a716-446655440000 \
 *       -H "Content-Type: application/json" \
 *       -d '{
 *         "name": "Wireless Mouse Pro",
 *         "price": 34.99,
 *         "category": "Computer Accessories",
 *         "quantity": 200
 *       }'
 */
function updateProductV4(req, res) {
  // Implementation for v4.0.0
}

/**
 * @api {post} /api/products/:id/reviews Create Product Review
 * @apiName CreateProductReview
 * @apiGroup Products
 * @apiVersion 4.0.0
 * @apiDescription Add a new review for a product (New endpoint in v4.0.0)
 *
 * **v4.0.0 New Feature**:
 * - Dedicated endpoint for creating product reviews
 * - Automatically updates product's average rating
 * - Increments review_count
 *
 * @apiParam {String} id Product unique identifier (UUID format)
 * @apiParam {Number{1-5}} rating Review rating (required, 1-5 stars)
 * @apiParam {String{1-1000}} comment Review comment (required, 1-1000 characters)
 *
 * @apiSuccess {String} id Review unique identifier
 * @apiSuccess {String} product_id Product identifier
 * @apiSuccess {String} user_id User who wrote the review
 * @apiSuccess {String} user_name User's display name
 * @apiSuccess {Number} rating Review rating (1-5 stars)
 * @apiSuccess {String} comment Review comment
 * @apiSuccess {String} created_at Review creation timestamp (ISO 8601)
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": "review-123",
 *       "product_id": "550e8400-e29b-41d4-a716-446655440000",
 *       "user_id": "user-789",
 *       "user_name": "Alice Johnson",
 *       "rating": 5,
 *       "comment": "Best mouse I've ever used! Highly recommend.",
 *       "created_at": "2025-01-09T18:00:00Z"
 *     }
 *
 * @apiError (400) BadRequest Invalid input data
 * @apiError (404) NotFound Product not found
 * @apiError (409) Conflict User already reviewed this product
 * @apiError (500) InternalServerError Server error
 *
 * @apiErrorExample {json} Error Response (400):
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "BadRequest",
 *       "message": "Rating must be between 1 and 5"
 *     }
 *
 * @apiExample {curl} Example usage:
 *     curl -X POST https://api.example.com/api/products/550e8400-e29b-41d4-a716-446655440000/reviews \
 *       -H "Content-Type: application/json" \
 *       -H "Authorization: Bearer YOUR_TOKEN" \
 *       -d '{
 *         "rating": 5,
 *         "comment": "Best mouse I've ever used! Highly recommend."
 *       }'
 */
function createProductReview(req, res) {
  // Implementation for creating product reviews
}

module.exports = {
  getProductV4,
  updateProductV4,
  createProductReview,
};
