/**
 * @file Complete TSDoc Example - Demonstrates all implemented TSDoc tags in APIcat
 * @package @hrefcl/apicat-desktop
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @see {@link https://apidoc.app} Official APIDoc website
 * @see {@link https://tsdoc.org} TSDoc standard documentation
 *
 * @api {POST} /users Create User with Complete TSDoc
 * @apiGroup UserManagement
 * @apiName CreateUserTSDoc
 * @apiDescription Creates a new user with comprehensive TSDoc documentation demonstration
 * @apiVersion 1.0.0
 *
 * @param username - The unique username for the account
 * @param email - User's email address for notifications
 * @param age? - Optional age of the user for demographics
 *
 * @returns Promise that resolves to the created user object with generated ID
 *
 * @remarks
 * This endpoint demonstrates comprehensive TSDoc integration with APIDoc.
 * It showcases all major TSDoc tags working together to provide rich
 * documentation for API endpoints.
 *
 * **Important considerations:**
 * - Username must be unique across the system
 * - Email validation is performed server-side
 * - Optional fields can be omitted from request
 *
 * @example Basic user creation
 * ```typescript
 * const response = await fetch('/users', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     username: 'johndoe',
 *     email: 'john@example.com'
 *   })
 * });
 * const user = await response.json();
 * ```
 *
 * @example Complete user with age
 * ```typescript
 * const newUser = {
 *   username: 'janedoe',
 *   email: 'jane@example.com',
 *   age: 28
 * };
 *
 * const user = await createUser(newUser);
 * console.log(`Created user: ${user.id}`);
 * ```
 *
 * @apiParam {String} username Unique username (3-50 characters)
 * @apiParam {String} email Valid email address
 * @apiParam {Number} [age] User age (must be 13 or older)
 *
 * @apiSuccess {String} id Generated unique user ID
 * @apiSuccess {String} username User's chosen username
 * @apiSuccess {String} email User's email address
 * @apiSuccess {Number} [age] User's age if provided
 * @apiSuccess {Date} createdAt Account creation timestamp
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": "user_123456",
 *       "username": "johndoe",
 *       "email": "john@example.com",
 *       "age": 30,
 *       "createdAt": "2025-01-27T10:30:00Z"
 *     }
 *
 * @apiError {String} code Error code identifier
 * @apiError {String} message Human-readable error message
 *
 * @apiErrorExample {json} Username-Already-Exists:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "code": "USERNAME_EXISTS",
 *       "message": "Username is already taken"
 *     }
 *
 * @apiErrorExample {json} Invalid-Email:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "code": "INVALID_EMAIL",
 *       "message": "Email format is invalid"
 *     }
 *
 * @public
 * @since 1.0.0
 */
async function createUserWithTSDoc(userData: CreateUserRequest): Promise<User> {
  // Implementation details...
  return {} as User;
}

/**
 * @api {GET} /users/{id} Get User (Alpha API)
 * @apiGroup UserManagement
 * @apiName GetUserAlpha
 * @apiDescription Retrieves user by ID - Alpha stage API for testing
 * @apiVersion 2.0.0-alpha
 *
 * @param userId - The unique identifier of the user to retrieve
 * @returns Promise resolving to user data or null if not found
 *
 * @example Get user by ID
 * ```typescript
 * const user = await getUserById('user_123456');
 * if (user) {
 *   console.log(`Found user: ${user.username}`);
 * }
 * ```
 *
 * @apiParam {String} id User's unique identifier
 *
 * @apiSuccess {String} id User's unique identifier
 * @apiSuccess {String} username User's username
 * @apiSuccess {String} email User's email
 *
 * @apiError {String} code Error identifier
 * @apiError {String} message Error description
 *
 * @alpha
 */
async function getUserByIdAlpha(userId: string): Promise<User | null> {
  // Alpha implementation...
  return null;
}

/**
 * @api {PUT} /users/{id}/preferences Update User Preferences (Beta)
 * @apiGroup UserManagement
 * @apiName UpdateUserPreferencesBeta
 * @apiDescription Updates user preferences - Beta API for feedback
 * @apiVersion 1.5.0-beta
 *
 * @param userId - User identifier
 * @param preferences - User preference object
 * @returns Updated user with new preferences
 *
 * @remarks
 * This beta endpoint allows updating user preferences.
 * We're collecting feedback on the preference structure
 * before finalizing the API.
 *
 * @example Update theme preference
 * ```typescript
 * await updateUserPreferences('user_123', {
 *   theme: 'dark',
 *   notifications: true
 * });
 * ```
 *
 * @apiParam {String} id User identifier
 * @apiParam {Object} preferences Preference settings
 * @apiParam {String} [preferences.theme] UI theme preference
 * @apiParam {Boolean} [preferences.notifications] Enable notifications
 *
 * @apiSuccess {Object} user Updated user object
 * @apiSuccess {Object} user.preferences Updated preferences
 *
 * @beta
 */
async function updateUserPreferencesBeta(userId: string, preferences: UserPreferences): Promise<User> {
  // Beta implementation...
  return {} as User;
}

/**
 * Internal utility function for user validation
 *
 * @param userData - Raw user data to validate
 * @returns Validation result with errors if any
 *
 * @remarks
 * This internal function should not be called directly from external code.
 * It's used internally by the user creation and update functions.
 *
 * @example Internal validation usage
 * ```typescript
 * const validation = validateUserData(rawData);
 * if (!validation.isValid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 *
 * @internal
 */
function validateUserDataInternal(userData: any): ValidationResult {
  // Internal validation logic...
  return { isValid: true, errors: [] };
}

// Type definitions for the examples
interface CreateUserRequest {
  username: string;
  email: string;
  age?: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  age?: number;
  createdAt: Date;
  preferences?: UserPreferences;
}

interface UserPreferences {
  theme?: 'light' | 'dark';
  notifications?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}