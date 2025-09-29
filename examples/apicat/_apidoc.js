// ------------------------------------------------------------------------------------------
// General apiDoc documentation blocks and old history blocks.
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// Current Success.
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// Current Errors.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine CreateUserError
 * @apiVersion 2.0.0
 *
 * @apiError NoAccessRight Only authenticated Admins can access the data.
 * @apiError UserNameTooShort Minimum of 5 characters required.
 *
 * @apiErrorExample  Response (example):
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "UserNameTooShort"
 *     }
 */

// ------------------------------------------------------------------------------------------
// Current Permissions.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine admin Admin access rights needed.
 * Optionally, you can write here more information about the permission.
 *
 * An "apiDefinePermission"-block can have an "apiVersion", so you can attach the block to a specific version.
 *
 * @apiVersion 3.0.0
 */

// ------------------------------------------------------------------------------------------
// History.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine admin This title is visible in version 1.0.0 and 2.0.0
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /user/:id Read data of a User
 * @apiVersion 2.0.0
 * @apiName GetUser
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiDescription Here you can describe the function.
 * Multilines are possible.
 *
 * @apiParam {String} id The Users-ID.
 *
 * @apiExample {bash} Curl example
 * curl -i https://api.example.com/user/4711
 * @apiExample {js} Javascript example
 * const client = LexCorpApi();
 * const user = client.getUser(42);
 * @apiExample {python} Python example
 * client = LexCorpApi.Client()
 * user = client.get_user(42)
 *
 * @apiSuccess {String} id         The Users-ID.
 * @apiSuccess {Date}   name       Fullname of the User.
 *
 * @apiError UserNotFound   The <code>id</code> of the User was not found.
 */

/**
 * @api {get} /user/:id Read data of a User
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiDescription Here you can describe the function.
 * Multilines are possible.
 *
 * @apiParam {String} id The Users-ID.
 *
 * @apiSuccess {String} id         The Users-ID.
 * @apiSuccess {Date}   name       Fullname of the User.
 *
 * @apiError UserNotFound   The error description text in version 1.0.0.
 */

/**
 * @api {post} /user Create a User
 * @apiVersion 2.0.0
 * @apiName PostUser
 * @apiGroup Users
 * @apiPermission none
 *
 * @apiDescription In this case "apiErrorStructure" is defined and used.
 * Define blocks with params that will be used in several functions, so you don't have to rewrite them.
 *
 * @apiBody {String} name Name of the User.
 *
 * @apiSuccess {String} id         The Users-ID.
 *
 * @apiUse CreateUserError
 */

// ------------------------------------------------------------------------------------------
// APIDoc 4.0 - apiSchema Examples
// ------------------------------------------------------------------------------------------

/**
 * @apiDefine SchemaSuccess
 * @apiVersion 4.0.0
 *
 * @apiSuccess {Boolean} success Always true for successful responses
 * @apiSuccess {Object} data Response payload data
 * @apiSuccess {String} [message] Optional success message
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": {...},
 *       "message": "Operation completed successfully"
 *     }
 */

/**
 * @apiDefine SchemaError
 * @apiVersion 4.0.0
 *
 * @apiError {Boolean} success Always false for error responses
 * @apiError {String} message Error description
 * @apiError {String} [code] Error code identifier
 * @apiError {Object} [details] Additional error details
 *
 * @apiErrorExample {json} Error Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "success": false,
 *       "message": "Validation failed",
 *       "code": "VALIDATION_ERROR",
 *       "details": {
 *         "field_errors": {
 *           "email": ["Email is required"]
 *         }
 *       }
 *     }
 */
