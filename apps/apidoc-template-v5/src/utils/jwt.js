/**
 * JWT Utility for client-side token validation
 *
 * This module provides JWT parsing and validation WITHOUT requiring external libraries.
 * It validates token structure, expiration, and integrity.
 *
 * SECURITY NOTE: This is for CLIENT-SIDE validation only. The server MUST still
 * validate the token with proper signature verification.
 */

/**
 * Decode a base64url string to object
 * @param {string} str - Base64url encoded string
 * @returns {object} Decoded object
 */
function base64UrlDecode(str) {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')

  // Pad with '=' if needed
  while (base64.length % 4 !== 0) {
    base64 += '='
  }

  // Decode base64
  const decoded = atob(base64)

  // Parse JSON
  return JSON.parse(decoded)
}

/**
 * Parse JWT token and extract payload
 * @param {string} token - JWT token string
 * @returns {object|null} Decoded payload or null if invalid
 */
export function parseJWT(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  const parts = token.split('.')

  // JWT must have 3 parts: header.payload.signature
  if (parts.length !== 3) {
    console.error('❌ Invalid JWT format: must have 3 parts')
    return null
  }

  try {
    const header = base64UrlDecode(parts[0])
    const payload = base64UrlDecode(parts[1])

    return {
      header,
      payload,
      signature: parts[2]
    }
  } catch (error) {
    console.error('❌ Failed to parse JWT:', error)
    return null
  }
}

/**
 * Check if JWT token is expired
 * @param {object} payload - JWT payload object
 * @returns {boolean} True if expired
 */
export function isTokenExpired(payload) {
  if (!payload || !payload.exp) {
    console.warn('⚠️  JWT payload missing exp (expiration) claim')
    return true // Consider invalid tokens as expired
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()

  return currentTime >= expirationTime
}

/**
 * Get time until token expires in milliseconds
 * @param {object} payload - JWT payload object
 * @returns {number} Milliseconds until expiration, or 0 if expired
 */
export function getTimeUntilExpiration(payload) {
  if (!payload || !payload.exp) {
    return 0
  }

  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()
  const timeRemaining = expirationTime - currentTime

  return timeRemaining > 0 ? timeRemaining : 0
}

/**
 * Validate JWT token structure and expiration
 * @param {string} token - JWT token string
 * @returns {object} Validation result with {valid, payload, error}
 */
export function validateJWT(token) {
  // Parse token
  const parsed = parseJWT(token)

  if (!parsed) {
    return {
      valid: false,
      payload: null,
      error: 'Invalid JWT format'
    }
  }

  // Check expiration
  if (isTokenExpired(parsed.payload)) {
    return {
      valid: false,
      payload: parsed.payload,
      error: 'Token expired'
    }
  }

  // Check issued at time (iat) if present
  if (parsed.payload.iat) {
    const issuedAt = parsed.payload.iat * 1000
    const currentTime = Date.now()

    // Token shouldn't be issued in the future
    if (issuedAt > currentTime + 60000) { // Allow 1 minute clock skew
      return {
        valid: false,
        payload: parsed.payload,
        error: 'Token issued in the future'
      }
    }
  }

  return {
    valid: true,
    payload: parsed.payload,
    error: null
  }
}

/**
 * Extract encryption key from JWT payload
 * Looks for common field names used for encryption keys
 * @param {object} payload - JWT payload
 * @returns {string|null} Encryption key or null
 */
export function extractEncryptionKey(payload) {
  if (!payload) {
    return null
  }

  // Check common field names for encryption key
  return payload.encryptionKey ||
         payload.encryption_key ||
         payload.key ||
         payload.k ||
         payload._k ||
         null
}

/**
 * Create a JWT token validator with auto-refresh callback
 * @param {function} onTokenExpired - Callback when token expires
 * @returns {object} Validator object with start/stop methods
 */
export function createTokenValidator(onTokenExpired) {
  let intervalId = null

  return {
    /**
     * Start validating token periodically
     * @param {string} token - JWT token to validate
     * @param {number} checkInterval - How often to check in ms (default: 60000 = 1 minute)
     */
    start(token, checkInterval = 60000) {
      // Clear any existing interval
      this.stop()

      // Initial validation
      const result = validateJWT(token)
      if (!result.valid) {
        console.error('❌ Token validation failed:', result.error)
        if (onTokenExpired) {
          onTokenExpired(result.error)
        }
        return
      }

      console.log('✅ Token valid. Expires in:', Math.round(getTimeUntilExpiration(result.payload) / 1000 / 60), 'minutes')

      // Set up periodic validation
      intervalId = setInterval(() => {
        const result = validateJWT(token)

        if (!result.valid) {
          console.error('❌ Token expired or invalid:', result.error)
          this.stop()

          if (onTokenExpired) {
            onTokenExpired(result.error)
          }
        } else {
          const minutesRemaining = Math.round(getTimeUntilExpiration(result.payload) / 1000 / 60)
          console.log(`🔄 Token still valid. ${minutesRemaining} minutes remaining`)
        }
      }, checkInterval)
    },

    /**
     * Stop validation interval
     */
    stop() {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }
}

/**
 * Generate a simple JWT-like token for testing (NOT FOR PRODUCTION)
 * @param {object} payload - Payload data
 * @param {number} expiresInHours - Hours until expiration (default: 24)
 * @returns {string} JWT-like token
 */
export function generateTestToken(payload = {}, expiresInHours = 24) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }

  const now = Math.floor(Date.now() / 1000)

  const finalPayload = {
    ...payload,
    iat: now,
    exp: now + (expiresInHours * 60 * 60)
  }

  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '')
  const encodedPayload = btoa(JSON.stringify(finalPayload)).replace(/=/g, '')

  // Fake signature (just for testing)
  const fakeSignature = btoa('test-signature').replace(/=/g, '')

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`
}
