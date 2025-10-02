/**
 * Client-side encryption utilities using Web Crypto API
 * Compatible with the server-side AES-256-GCM encryption
 */

/**
 * Decrypt AES-256-GCM encrypted data
 * @param {Object} encryptedData - Object with {data, iv, tag, algorithm}
 * @param {string} key - Base64 encoded encryption key
 * @returns {Promise<any>} - Decrypted JSON object
 */
export async function decryptData(encryptedData, key) {
  try {
    // Convert base64 key to buffer
    const keyBuffer = base64ToArrayBuffer(key)

    // Import the key for AES-GCM
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )

    // Convert base64 iv, data and tag to buffers
    const iv = base64ToArrayBuffer(encryptedData.iv)
    const data = base64ToArrayBuffer(encryptedData.data)
    const tag = base64ToArrayBuffer(encryptedData.tag)

    // In Web Crypto API, the tag needs to be appended to the ciphertext
    // Create a new array with data + tag
    const ciphertext = new Uint8Array(data.byteLength + tag.byteLength)
    ciphertext.set(new Uint8Array(data), 0)
    ciphertext.set(new Uint8Array(tag), data.byteLength)

    // Decrypt with AAD (Additional Authenticated Data)
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv),
        tagLength: 128 // 16 bytes = 128 bits
      },
      cryptoKey,
      ciphertext
    )

    // Convert decrypted buffer to JSON
    const jsonString = new TextDecoder().decode(decrypted)
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('❌ Decryption failed:', error)
    throw new Error(`Failed to decrypt data: ${error.message}`)
  }
}

/**
 * Check if data is encrypted
 * @param {any} data - Data to check
 * @returns {boolean}
 */
export function isEncrypted(data) {
  return data && typeof data === 'object' && data.encrypted === true && data.data && data.iv && data.tag
}

/**
 * Recursively decrypt all encrypted fields in an object
 * @param {any} obj - Object to process
 * @param {string} key - Encryption key
 * @returns {Promise<any>} - Object with all encrypted fields decrypted
 */
export async function decryptObject(obj, key) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // If this object itself is encrypted
  if (isEncrypted(obj)) {
    return await decryptData(obj, key)
  }

  // If it's an array, decrypt each element
  if (Array.isArray(obj)) {
    return await Promise.all(obj.map(item => decryptObject(item, key)))
  }

  // If it's an object, decrypt each property
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    result[k] = await decryptObject(v, key)
  }
  return result
}

/**
 * Convert base64 string to ArrayBuffer
 * @param {string} base64 - Base64 encoded string
 * @returns {ArrayBuffer}
 */
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}
