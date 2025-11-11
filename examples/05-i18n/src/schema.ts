/**
 * @file Multi-language API documentation test WITH @apiSchema
 * Testing @apiSchema with different interfaces per language
 */

// ============================================================================
// INTERFACES - English
// ============================================================================

/**
 * Request to create a product (English version)
 */
interface CreateProductRequestEN {
    /** Product name in English */
    name: string;
    /** Product description */
    description: string;
    /** Price in USD */
    price: number;
    /** Stock quantity */
    stock: number;
}

/**
 * Response for created product (English version)
 */
interface CreateProductResponseEN {
    /** Product ID */
    id: number;
    /** Product name */
    name: string;
    /** Product description */
    description: string;
    /** Price in USD */
    price: number;
    /** Stock quantity */
    stock: number;
    /** Creation timestamp */
    createdAt: string;
}

// ============================================================================
// INTERFACES - Chinese
// ============================================================================

/**
 * 创建产品请求（中文版本）
 */
interface CreateProductRequestZH {
    /** 产品名称（中文） */
    name: string;
    /** 产品描述 */
    description: string;
    /** 价格（人民币） */
    price: number;
    /** 库存数量 */
    stock: number;
}

/**
 * 创建产品响应（中文版本）
 */
interface CreateProductResponseZH {
    /** 产品ID */
    id: number;
    /** 产品名称 */
    name: string;
    /** 产品描述 */
    description: string;
    /** 价格（人民币） */
    price: number;
    /** 库存数量 */
    stock: number;
    /** 创建时间戳 */
    createdAt: string;
}

// ============================================================================
// ENDPOINT - Create Product (English)
// ============================================================================

/**
 * @api {post} /products Create Product
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiLang en
 *
 * @apiDescription Creates a new product in the system (English documentation)
 *
 * @apiSchema (Body) {interface=CreateProductRequestEN} apiParam
 * @apiSchema (Success 200) {interface=CreateProductResponseEN} apiSuccess
 *
 * @apiSchema (Success 200) {json=../../examples/responses-en/product-create-success.json} apiSuccessExample
 * @apiSchema (Error 400) {json=../../examples/responses-en/product-create-error.json} apiErrorExample
 *
 * @apiCode (bash) {file=../../examples/code-en/product-create-curl.sh} cURL Example
 * @apiCode (javascript) {file=../../examples/code-en/product-create-js.js} JavaScript Example
 * @apiCode (python) {file=../../examples/code-en/product-create-py.py} Python Example
 */

// ============================================================================
// ENDPOINT - Create Product (Chinese)
// ============================================================================

/**
 * @api {post} /products 创建产品
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiLang zh
 *
 * @apiDescription 在系统中创建新产品（中文文档）
 *
 * @apiSchema (Body) {interface=CreateProductRequestZH} apiParam
 * @apiSchema (Success 200) {interface=CreateProductResponseZH} apiSuccess
 *
 * @apiSchema (Success 200) {json=../../examples/responses-zh/product-create-success.json} apiSuccessExample
 * @apiSchema (Error 400) {json=../../examples/responses-zh/product-create-error.json} apiErrorExample
 *
 * @apiCode (bash) {file=../../examples/code-zh/product-create-curl.sh} cURL 示例
 * @apiCode (javascript) {file=../../examples/code-zh/product-create-js.js} JavaScript 示例
 * @apiCode (python) {file=../../examples/code-zh/product-create-py.py} Python 示例
 */
