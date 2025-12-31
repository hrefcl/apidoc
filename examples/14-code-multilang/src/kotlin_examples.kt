/**
 * @code {class} StringUtils
 * @codeName StringUtils
 * @codeGroup Utils
 * @codeType class
 * @codeLang kotlin
 * @codePlatform Android
 * @codePlatform JVM
 * @codeDescription Utility class for string manipulation operations in Kotlin.
 * @codeVersion 1.0.0
 * @codeAnnotation @JvmStatic
 * @codeAccess public
 *
 * @codeExample Basic Usage
 * val result = StringUtils.capitalize("hello")
 * println(result) // "Hello"
 */
class StringUtils {
    companion object
}

/**
 * @code {function} capitalize
 * @codeName capitalize
 * @codeGroup Utils
 * @codeType function
 * @codeLang kotlin
 * @codePlatform Android
 * @codeSignature fun String.capitalize(): String
 * @codeDescription Extension function to capitalize the first letter of a string.
 * @codeParam {String} this The string to capitalize
 * @codeReturn {String} The capitalized string
 * @codeVersion 1.0.0
 * @codeSince 1.0.0
 * @codeAccess public
 *
 * @codeExample Basic Usage
 * val name = "hello"
 * val capitalized = name.capitalize()
 * println(capitalized) // "Hello"
 */
fun String.capitalize(): String = this.replaceFirstChar { it.uppercase() }

/**
 * @code {function} fetchUserData
 * @codeName fetchUserData
 * @codeGroup Network
 * @codeType function
 * @codeLang kotlin
 * @codePlatform Android
 * @codeAsync true
 * @codeSignature suspend fun fetchUserData(userId: String): Result<User>
 * @codeDescription Fetches user data from the remote API using coroutines.
 * @codeParam {String} userId The unique identifier of the user
 * @codeReturn {Result<User>} A Result containing the User or an error
 * @codeThrows {NetworkException} When network connection fails
 * @codeThrows {UserNotFoundException} When user doesn't exist
 * @codeVersion 2.0.0
 * @codeSince 1.5.0
 * @codeAnnotation @Throws(Exception::class)
 * @codeAccess public
 *
 * @codeExample Fetching User Data
 * viewModelScope.launch {
 *     val result = fetchUserData("user123")
 *     result.onSuccess { user ->
 *         println("User: ${user.name}")
 *     }.onFailure { error ->
 *         println("Error: ${error.message}")
 *     }
 * }
 *
 * @codeSee User Related model
 * @codeSee NetworkManager Network utility
 */
suspend fun fetchUserData(userId: String): Any = TODO()

/**
 * @code {enum} UserState
 * @codeName UserState
 * @codeGroup Models
 * @codeType enum
 * @codeLang kotlin
 * @codePlatform Android
 * @codePlatform JVM
 * @codeDescription Represents the possible states of a user account.
 * @codeVersion 1.0.0
 *
 * @codeExample Using UserState
 * when (user.state) {
 *     UserState.ACTIVE -> showDashboard()
 *     UserState.PENDING -> showVerification()
 *     UserState.SUSPENDED -> showSuspendedMessage()
 *     UserState.DELETED -> redirectToSignup()
 * }
 */
enum class UserState {
    ACTIVE, PENDING, SUSPENDED, DELETED
}

/**
 * @code {interface} Repository
 * @codeName Repository
 * @codeGroup Models
 * @codeType interface
 * @codeLang kotlin
 * @codePlatform Android
 * @codePlatform JVM
 * @codeGeneric {T} The entity type
 * @codeGeneric {ID} The ID type
 * @codeDescription Generic repository interface for data access operations.
 * @codeVersion 1.0.0
 *
 * @codeExample Implementing Repository
 * class UserRepository : Repository<User, String> {
 *     override suspend fun findById(id: String): User? {
 *         return userDao.findById(id)
 *     }
 *     override suspend fun save(entity: User): User {
 *         userDao.insert(entity)
 *         return entity
 *     }
 * }
 */
interface Repository<T, ID> {
    suspend fun findById(id: ID): T?
    suspend fun save(entity: T): T
}
