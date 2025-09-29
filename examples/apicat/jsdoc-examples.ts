/**
 * @file JSDoc tag examples demonstrating JSDoc parser functionality
 *
 * This file contains examples of all JSDoc tags that APIDoc can process.
 * It serves as a test and demonstration of JSDoc parsing capabilities.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @package apidoc
 * @see https://apidoc.app/docs
 */

/**
 * Example function with JSDoc documentation
 *
 * @param name The user's name
 * @param age The user's age (optional)
 * @returns A formatted greeting string
 * @example
 * ```typescript
 * const greeting = createGreeting("John", 25);
 * console.log(greeting); // "Hello John (25 years old)!"
 * ```
 * @public
 */
export function createGreeting(name: string, age?: number): string {
    if (age) {
        return `Hello ${name} (${age} years old)!`;
    }
    return `Hello ${name}!`;
}

/**
 * Database connection configuration
 *
 * @param host Database host address
 * @param port Database port number
 * @param credentials Connection credentials
 * @returns Promise resolving to connection object
 * @remarks
 * This function establishes a secure connection to the database.
 * It automatically handles connection pooling and retry logic.
 * @example
 * ```typescript
 * const conn = await connectToDatabase("localhost", 5432, {
 *   username: "admin",
 *   password: "secret"
 * });
 * ```
 * @internal
 */
export async function connectToDatabase(
    host: string,
    port: number,
    credentials: { username: string; password: string }
): Promise<any> {
    // Implementation would go here
    return {};
}

/**
 * Advanced user validation system (Alpha feature)
 *
 * @param userData User information to validate
 * @returns Validation result with detailed feedback
 * @example
 * ```typescript
 * const result = validateUserAdvanced({
 *   email: "user@example.com",
 *   age: 25
 * });
 * if (result.isValid) {
 *   console.log("User is valid!");
 * }
 * ```
 * @alpha
 */
export function validateUserAdvanced(userData: any): { isValid: boolean; errors: string[] } {
    // Alpha implementation
    return { isValid: true, errors: [] };
}

/**
 * Beta payment processing system
 *
 * @param amount Payment amount in cents
 * @param currency Payment currency (ISO code)
 * @returns Payment processing result
 * @example
 * ```typescript
 * const result = await processPaymentBeta(2500, "USD");
 * if (result.success) {
 *   console.log(`Payment ID: ${result.transactionId}`);
 * }
 * ```
 * @beta
 */
export async function processPaymentBeta(
    amount: number,
    currency: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // Beta implementation
    return { success: true, transactionId: "tx_123456" };
}

/**
 * Utility function with comprehensive documentation
 *
 * @param input The input data to process
 * @param options Processing options
 * @returns Processed result object
 * @remarks
 * This utility function demonstrates all supported JSDoc tags.
 * It processes various types of input data with configurable options.
 *
 * The function supports multiple data formats and provides extensive
 * error handling and validation capabilities.
 * @example
 * Basic usage:
 * ```typescript
 * const result = processData({ value: 42 });
 * console.log(result.processed); // true
 * ```
 * @example
 * Advanced usage with options:
 * ```typescript
 * const result = processData(
 *   { value: 42, metadata: { type: "number" } },
 *   { validate: true, transform: true }
 * );
 * ```
 * @param input.value - The main data value
 * @param input.metadata - Optional metadata object
 * @param options.validate - Enable input validation
 * @param options.transform - Apply data transformations
 * @returns result.processed - Whether processing was successful
 * @returns result.data - The processed data
 * @returns result.errors - Any validation or processing errors
 * @public
 */
export function processData(
    input: { value: any; metadata?: any },
    options: { validate?: boolean; transform?: boolean } = {}
): {
    processed: boolean;
    data?: any;
    errors?: string[]
} {
    // Comprehensive processing logic would go here
    return {
        processed: true,
        data: input.value,
        errors: []
    };
}