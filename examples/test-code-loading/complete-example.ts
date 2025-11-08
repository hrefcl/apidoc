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

