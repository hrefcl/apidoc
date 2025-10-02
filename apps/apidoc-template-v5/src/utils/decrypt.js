/**
 * Client-Side Decryption Utility
 *
 * Provides Web Crypto API compatible decryption for encrypted data
 * from the backend. Used to decrypt sensitive data like admited lists.
 */

/**
 * Convert base64 string to Uint8Array
 * @param {string} base64String - Base64 encoded string
 * @returns {Uint8Array} Byte array
 */
function base64ToUint8Array(base64String) {
  const binaryString = atob(base64String)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

/**
 * Convert hex string to Uint8Array
 * @param {string} hexString - Hex encoded string
 * @returns {Uint8Array} Byte array
 */
function hexToUint8Array(hexString) {
  const bytes = new Uint8Array(hexString.length / 2)
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16)
  }
  return bytes
}

/**
 * Import encryption key for Web Crypto API
 * @param {string} keyString - Base64 or hex encoded key
 * @returns {Promise<CryptoKey>} Imported crypto key
 */
async function importKey(keyString) {
  let keyBytes

  // Detect format: hex (64 chars) or base64
  if (keyString.length === 64) {
    // Assume hex encoding
    keyBytes = hexToUint8Array(keyString)
  } else {
    // Assume base64 encoding
    keyBytes = base64ToUint8Array(keyString)
  }

  // Import key for AES-GCM
  return await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  )
}

/**
 * Decrypt JSON data encrypted with AES-256-GCM
 * @param {object} encryptedFile - Encrypted file structure {data, iv, tag, algorithm}
 * @param {string} encryptionKey - Base64 or hex encoded encryption key
 * @returns {Promise<any>} Decrypted JSON data
 */
export async function decryptJSON(encryptedFile, encryptionKey) {
  if (!encryptedFile || !encryptionKey) {
    throw new Error('Missing encrypted data or encryption key')
  }

  try {
    // Import the encryption key
    const cryptoKey = await importKey(encryptionKey)

    // Decode the IV and encrypted data
    const iv = base64ToUint8Array(encryptedFile.iv)
    const tag = base64ToUint8Array(encryptedFile.tag)
    const encryptedData = base64ToUint8Array(encryptedFile.data)

    // Combine encrypted data and auth tag (required for AES-GCM)
    const combinedData = new Uint8Array(encryptedData.length + tag.length)
    combinedData.set(encryptedData, 0)
    combinedData.set(tag, encryptedData.length)

    // Decrypt using Web Crypto API
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128 // 16 bytes * 8 bits
      },
      cryptoKey,
      combinedData
    )

    // Convert decrypted ArrayBuffer to string
    const decoder = new TextDecoder()
    const decryptedString = decoder.decode(decryptedBuffer)

    // Parse JSON
    return JSON.parse(decryptedString)
  } catch (error) {
    console.error('❌ Decryption failed:', error)
    throw new Error(`Failed to decrypt data: ${error.message}`)
  }
}

/**
 * Decrypt the admited users list for local authentication
 * @param {object} encryptedAdmited - Encrypted admited structure from meta.login._admited
 * @param {string} encryptionKey - Encryption key from login config
 * @returns {Promise<Array>} Decrypted admited users array
 */
export async function decryptAdmitedList(encryptedAdmited, encryptionKey) {
  if (!encryptedAdmited) {
    throw new Error('No encrypted admited list provided')
  }

  console.log('🔓 Decrypting admited list...')

  try {
    const admitedList = await decryptJSON(encryptedAdmited, encryptionKey)

    if (!Array.isArray(admitedList)) {
      throw new Error('Decrypted admited list is not an array')
    }

    console.log(`✅ Successfully decrypted ${admitedList.length} admited users`)
    return admitedList
  } catch (error) {
    console.error('❌ Failed to decrypt admited list:', error)
    throw error
  }
}
