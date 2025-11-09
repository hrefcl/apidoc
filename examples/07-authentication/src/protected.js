/**
 * @api {get} /api/protected/profile Get Profile
 * @apiName GetProfile
 * @apiGroup Protected
 * @apiVersion 1.0.0
 * @apiDescription Get user profile (requires authentication)
 *
 * @apiHeader {String} Authorization Bearer token OR X-API-Key
 *
 * @apiSuccess {Object} user User profile
 *
 * @apiExample {curl} With Bearer Token:
 *     curl https://api.example.com/api/protected/profile \
 *       -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 * @apiExample {curl} With API Key:
 *     curl https://api.example.com/api/protected/profile \
 *       -H "X-API-Key: ak_live_1234567890abcdef"
 */
function getProfile(req, res) {}

/**
 * @api {put} /api/protected/profile Update Profile
 * @apiName UpdateProfile
 * @apiGroup Protected
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} Authorization Bearer token OR X-API-Key
 *
 * @apiParam {String} [name] Full name
 * @apiParam {String} [bio] User bio
 *
 * @apiSuccess {Object} user Updated profile
 */
function updateProfile(req, res) {}
