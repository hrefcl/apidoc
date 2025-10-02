/**
 * Local Authentication Utility
 *
 * Provides local authentication for users without a server.
 * Validates against a list of allowed emails/users and generates
 * client-side JWT-like tokens for session management.
 */

import { generateTestToken, validateJWT } from './jwt'

/**
 * Validate credentials against local configuration
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Array} admitedList - Decrypted admited users array
 * @returns {object} Validation result {valid, user, error}
 */
export function validateLocalCredentials(email, password, admitedList) {
  if (!admitedList || !Array.isArray(admitedList)) {
    return {
      valid: false,
      user: null,
      error: 'Local authentication not configured'
    }
  }

  // Find user by email in admited list
  const user = admitedList.find(u =>
    u.email.toLowerCase() === email.toLowerCase()
  )

  if (!user) {
    return {
      valid: false,
      user: null,
      error: 'Invalid credentials'
    }
  }

  // Validate password
  if (user.password && user.password !== password) {
    return {
      valid: false,
      user: null,
      error: 'Invalid credentials'
    }
  }

  // User validated
  return {
    valid: true,
    user: {
      email: user.email,
      name: user.name || email.split('@')[0],
      role: user.role || 'user'
    },
    error: null
  }
}

/**
 * Generate a local session token
 * @param {object} user - User object from validation
 * @param {object} options - Token options
 * @returns {string} JWT-like token
 */
export function generateLocalToken(user, options = {}) {
  const expiresInHours = options.expiresInHours || 24
  const encryptionKey = options.encryptionKey || null

  const payload = {
    sub: user.email,
    name: user.name,
    role: user.role,
    type: 'local',
    iss: 'apicat-local'
  }

  // Add encryption key if provided
  if (encryptionKey) {
    payload._k = encryptionKey
  }

  return generateTestToken(payload, expiresInHours)
}

/**
 * Validate a local token
 * @param {string} token - Token to validate
 * @returns {object} Validation result {valid, payload, error}
 */
export function validateLocalToken(token) {
  const result = validateJWT(token)

  if (!result.valid) {
    return result
  }

  // Additional check: must be a local token
  if (result.payload.type !== 'local' || result.payload.iss !== 'apicat-local') {
    return {
      valid: false,
      payload: result.payload,
      error: 'Not a local authentication token'
    }
  }

  return result
}

/**
 * Authenticate user locally and generate token
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Array} admitedList - Decrypted admited users array
 * @param {string} encryptionKey - Encryption key from login config
 * @returns {Promise<object>} Auth result {success, token, user, encryptionKey, error}
 */
export async function authenticateLocally(email, password, admitedList, encryptionKey) {
  if (!admitedList || !Array.isArray(admitedList)) {
    return {
      success: false,
      token: null,
      user: null,
      encryptionKey: null,
      error: 'Local authentication not enabled'
    }
  }

  // Validate credentials
  const validation = validateLocalCredentials(email, password, admitedList)

  if (!validation.valid) {
    return {
      success: false,
      token: null,
      user: null,
      encryptionKey: null,
      error: validation.error
    }
  }

  // Generate token with 24 hour expiration
  const tokenOptions = {
    expiresInHours: 24,
    encryptionKey: encryptionKey || null
  }

  const token = generateLocalToken(validation.user, tokenOptions)

  return {
    success: true,
    token,
    user: validation.user,
    encryptionKey: encryptionKey || null,
    error: null
  }
}

/**
 * Hash password using SHA-256 (for comparing with hashed passwords in config)
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password as hex string
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate credentials with optional password hashing
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Array} admitedList - Decrypted admited users array
 * @returns {Promise<object>} Validation result {valid, user, error}
 */
export async function validateLocalCredentialsHashed(email, password, admitedList) {
  if (!admitedList || !Array.isArray(admitedList)) {
    return {
      valid: false,
      user: null,
      error: 'Local authentication not configured'
    }
  }

  // Find user by email in admited list
  const user = admitedList.find(u =>
    u.email.toLowerCase() === email.toLowerCase()
  )

  if (!user) {
    return {
      valid: false,
      user: null,
      error: 'Invalid credentials'
    }
  }

  // If user has hashed password, hash input and compare
  if (user.passwordHash) {
    const hashedInput = await hashPassword(password)

    if (hashedInput !== user.passwordHash) {
      return {
        valid: false,
        user: null,
        error: 'Invalid credentials'
      }
    }
  }
  // Otherwise compare plain text (less secure, but simpler for testing)
  else if (user.password && user.password !== password) {
    return {
      valid: false,
      user: null,
      error: 'Invalid credentials'
    }
  }

  // User validated
  return {
    valid: true,
    user: {
      email: user.email,
      name: user.name || email.split('@')[0],
      role: user.role || 'user'
    },
    error: null
  }
}
