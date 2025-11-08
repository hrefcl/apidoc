/**
 * TypeScript interfaces for @apiSchema
 * These will be used by @apiSchema to generate parameter documentation
 */

/**
 * Request parameters for adding a floor
 */
export interface AddFloorRequest {
    /** External community UUID (unique identifier) */
    extCommunityUuid: string;

    /** Building number/code (e.g., "A1", "B2") */
    buildingNo: string;

    /** Floor number (can be numeric or alphanumeric like "B1", "G", "PH") */
    floorNo: string;

    /** Human-readable floor name */
    name: string;

    /** Sort order for displaying floors (can be negative for basements) */
    sortOrder: number;
}

/**
 * Successful response when floor is created
 */
export interface AddFloorResponse {
    /** Response code (0 = success) */
    code: 0;

    /** Response message */
    msg: 'success';

    /** Response data containing created floor information */
    data: {
        /** Internal floor ID */
        id: number;

        /** Floor UUID (unique identifier) */
        uuid: string;

        /** External community UUID */
        extCommunityUuid: string;

        /** Building number */
        buildingNo: string;

        /** Floor number */
        floorNo: string;

        /** Floor name */
        name: string;

        /** Sort order */
        sortOrder: number;

        /** Creation timestamp */
        createdAt: string;
    };

    /** Response time */
    time: string;
}

/**
 * Standard error response structure
 */
export interface ThinmooErrorResponse {
    /** Error code (non-zero) */
    code: number;

    /** Error message describing what went wrong */
    msg: string;

    /** Response time */
    time: string;
}

/**
 * Request headers for authenticated endpoints
 */
export interface AuthHeaders {
    /** JWT access token obtained from /auth/token endpoint */
    accessToken: string;

    /** Optional content type (defaults to application/json) */
    'Content-Type'?: string;
}

/**
 * @api {get} /sqFloor/extapi/add Add Floor
 * @apiName AddFloor
 * @apiGroup Floor
 * @apiVersion 5.4.3
 * @apiDescription
 * Creates a new floor within a building. Floors organize rooms/apartments vertically
 * within a building structure. Each floor can contain multiple rooms and is identified
 * by a floor number (can be numeric or alphanumeric like "B1" for basement, "G" for ground).
 *
 * **Important Notes:**
 * - Building must exist before adding floors
 * - Floor numbers should be unique within the building
 * - Floor numbers can be numeric (1, 2, 3) or alphanumeric (B1, G, PH for penthouse)
 * - Typical order: B2 (basement 2), B1, G (ground), 1, 2, 3, PH (penthouse)
 *
 * **Typical Workflow:**
 * 1. Create community
 * 2. Add buildings to community
 * 3. Add floors to each building (this endpoint)
 * 4. Add rooms/apartments to floors
 * 5. Install and configure devices
 *
 * **Common Floor Naming Conventions:**
 * - Basements: B1, B2, B3 (or -1, -2, -3)
 * - Ground/Lobby: G, L, 0
 * - Regular floors: 1, 2, 3, 4...
 * - Penthouse: PH, P
 * - Mezzanine: M, MZ
 *
 * @apiSchema {interface=AuthHeaders} apiHeader
 * @apiSchema {json=examples/headers/auth-headers.json} apiHeaderExample
 *
 * @apiSchema (Query) {interface=AddFloorRequest} apiParam
 * @apiSchema (Success 200) {interface=AddFloorResponse} apiSuccess
 * @apiSchema (Error 4xx) {interface=ThinmooErrorResponse} apiError
 *
 * @apiSchema (Success 200) {json=examples/responses/floor-success.json} apiSuccessExample
 * @apiSchema (Error 404) {json=examples/responses/floor-error-notfound.json} apiErrorExample
 * @apiSchema (Error 409) {json=examples/responses/floor-error-duplicate.json} apiErrorExample
 *
 * @apiCode (bash) {file=examples/code/floor-curl-numeric.sh} cURL Example (Numeric Floor)
 * @apiCode (bash) {file=examples/code/floor-curl-ground.sh} cURL Example (Ground Floor)
 * @apiCode (javascript) {file=examples/code/floor-js.js} JavaScript Example
 * @apiCode (python) {file=examples/code/floor-python.py} Python Example
 */
export function addFloor() {
    // Implementation here
}


/**
 * @api {get} /sqCommunity/extapiAdmin/add Add Community
 * @apiName AddCommunity
 * @apiGroup Community
 * @apiVersion 5.4.3
 * @apiDescription
 * Creates a new residential community in the Thinmoo platform. A community represents
 * a residential complex that can contain multiple buildings, units, rooms, and IoT devices.
 *
 * **Important Notes:**
 * - `extCommunityUuid` must be unique across the entire platform
 * - This UUID is used to identify the community in all subsequent API calls
 * - After creating a community, you can add buildings, devices, and residents
 * - The community serves as the top-level container for all other resources
 *
 * **Business Flow:**
 * 1. Create community with this endpoint
 * 2. Add buildings using `/sqBuilding/extapi/add`
 * 3. Add floors and rooms to buildings
 * 4. Register devices and residents
 *
 * @apiHeader {String} accessToken JWT access token obtained from authentication
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     }
 *
 * @apiQuery {String} extCommunityUuid External community UUID (unique identifier for third-party systems, max 128 chars)
 * @apiQuery {String} name Community name (max 128 characters, e.g., "Sunset Towers Residential Complex")
 * @apiQuery {String} [address] Full physical address of the community (max 256 chars)
 * @apiQuery {Number} [cityId] City ID from Thinmoo's city database (obtain from city list endpoint)
 * @apiQuery {String} [managePhone] Management office phone number (international format recommended, e.g., +1-555-0123)
 *
 * @apiSuccess {Number} code Response code (0 = success, see error codes for failures)
 * @apiSuccess {String} msg Response message ("success" on successful creation)
 * @apiSuccess {Object} data Community data object
 * @apiSuccess {Number} data.id Internal community ID (Thinmoo system generated, use for internal operations)
 * @apiSuccess {String} data.uuid Community UUID (Thinmoo generated UUID, use for some API calls)
 * @apiSuccess {String} data.extCommunityUuid Your external community UUID (echoed back for confirmation)
 * @apiSuccess {String} data.name Community name (echoed back)
 * @apiSuccess {String} data.address Community address (if provided)
 * @apiSuccess {Number} data.cityId City ID (if provided)
 * @apiSuccess {String} data.managePhone Management phone (if provided)
 * @apiSuccess {String} data.createdAt Creation timestamp (ISO 8601 format)
 * @apiSuccess {String} time Response processing time (e.g., "25ms")
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 0,
 *       "msg": "success",
 *       "data": {
 *         "id": 12345,
 *         "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
 *         "extCommunityUuid": "my-system-community-001",
 *         "name": "Sunset Towers Residential Complex",
 *         "address": "123 Main Street, City, State 12345",
 *         "cityId": 1001,
 *         "managePhone": "+1-555-0123",
 *         "createdAt": "2025-11-07T10:30:00.000Z"
 *       },
 *       "time": "25ms"
 *     }
 *
 * @apiError {Number} code Error code (10000 = validation error, 10001 = server error)
 * @apiError {String} msg Error message describing what went wrong
 * @apiError {String} time Response processing time
 *
 * @apiErrorExample {json} Error-Response (Duplicate UUID):
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 10000,
 *       "msg": "Community with extCommunityUuid 'my-system-community-001' already exists",
 *       "time": "12ms"
 *     }
 *
 * @apiErrorExample {json} Error-Response (Missing Required Fields):
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 10000,
 *       "msg": "extCommunityUuid and name are required",
 *       "time": "8ms"
 *     }
 *
 * @apiErrorExample {json} Error-Response (Invalid Access Token):
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 99999,
 *       "msg": "Invalid or expired access token",
 *       "time": "5ms"
 *     }
 *
 * @apiExample {curl} cURL Example:
 *     curl -X GET "http://api-cloud.thinmoo.net/sqCommunity/extapiAdmin/add?extCommunityUuid=my-comm-001&name=Sunset%20Towers&address=123%20Main%20St&cityId=1001&managePhone=%2B1-555-0123" \
 *       -H "accessToken: YOUR_ACCESS_TOKEN"
 *
 * @apiExample {javascript} JavaScript/Node.js Example:
 *     const response = await fetch(
 *       'http://api-cloud.thinmoo.net/sqCommunity/extapiAdmin/add?' + new URLSearchParams({
 *         extCommunityUuid: 'my-comm-001',
 *         name: 'Sunset Towers',
 *         address: '123 Main Street',
 *         cityId: 1001,
 *         managePhone: '+1-555-0123'
 *       }),
 *       {
 *         headers: {
 *           'accessToken': 'YOUR_ACCESS_TOKEN'
 *         }
 *       }
 *     );
 *     const result = await response.json();
 *     console.log('Community created:', result.data);
 *
 * @apiExample {python} Python Example:
 *     import requests
 *
 *     response = requests.get(
 *         'http://api-cloud.thinmoo.net/sqCommunity/extapiAdmin/add',
 *         params={
 *             'extCommunityUuid': 'my-comm-001',
 *             'name': 'Sunset Towers',
 *             'address': '123 Main Street',
 *             'cityId': 1001,
 *             'managePhone': '+1-555-0123'
 *         },
 *         headers={'accessToken': 'YOUR_ACCESS_TOKEN'}
 *     )
 *     result = response.json()
 *     print(f"Community created with ID: {result['data']['id']}")
 */

export function addFlooS() {
    // Implementation here
}
