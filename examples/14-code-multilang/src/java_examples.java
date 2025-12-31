package examples;

/**
 * @code {class} UserService
 * @codeName UserService
 * @codeGroup Services
 * @codeType class
 * @codeLang java
 * @codePlatform Server
 * @codePlatform Android
 * @codeDescription Service class for user management operations.
 * @codeVersion 1.0.0
 * @codeAnnotation @Service
 * @codeAnnotation @Transactional
 * @codeAccess public
 *
 * @codeExample Using UserService
 * @Autowired
 * private UserService userService;
 *
 * public void createUser() {
 *     User user = new User("John", "john@email.com");
 *     userService.save(user);
 * }
 */
public class UserService {
}

/**
 * @code {method} findByEmail
 * @codeName findByEmail
 * @codeGroup Services
 * @codeType method
 * @codeLang java
 * @codePlatform Server
 * @codeSignature public Optional<User> findByEmail(String email)
 * @codeDescription Finds a user by their email address.
 * @codeParam {String} email The email address to search for
 * @codeReturn {Optional<User>} Optional containing the user if found
 * @codeThrows {IllegalArgumentException} When email is null or empty
 * @codeVersion 1.0.0
 * @codeAnnotation @Cacheable("users")
 * @codeAccess public
 *
 * @codeExample Finding a User
 * Optional<User> user = userService.findByEmail("john@email.com");
 * user.ifPresent(u -> System.out.println("Found: " + u.getName()));
 */

/**
 * @code {class} User
 * @codeName User
 * @codeGroup Models
 * @codeType class
 * @codeLang java
 * @codePlatform Server
 * @codePlatform Android
 * @codeDescription Entity class representing a user in the system.
 * @codeVersion 1.0.0
 * @codeAnnotation @Entity
 * @codeAnnotation @Table(name = "users")
 * @codeAccess public
 *
 * @codeExample Creating a User
 * User user = User.builder()
 *     .name("John Doe")
 *     .email("john@email.com")
 *     .role(UserRole.ADMIN)
 *     .build();
 *
 * @codeSee UserRole Role enumeration
 */
class User {
}

/**
 * @code {interface} Repository
 * @codeName Repository
 * @codeGroup Interfaces
 * @codeType interface
 * @codeLang java
 * @codePlatform Server
 * @codeGeneric {T} Entity type
 * @codeGeneric {ID} ID type
 * @codeDescription Generic repository interface for data access.
 * @codeVersion 1.0.0
 *
 * @codeExample Implementing Repository
 * public interface UserRepository extends Repository<User, Long> {
 *     Optional<User> findByEmail(String email);
 *     List<User> findByRole(UserRole role);
 * }
 */
interface Repository<T, ID> {
}

/**
 * @code {method} calculateChecksum
 * @codeName calculateChecksum
 * @codeGroup Utils
 * @codeType method
 * @codeLang java
 * @codePlatform Server
 * @codePlatform Android
 * @codeSignature public static String calculateChecksum(byte[] data, String algorithm)
 * @codeDescription Calculates a checksum for the given data.
 * @codeParam {byte[]} data The data to calculate checksum for
 * @codeParam {String} algorithm The hash algorithm (MD5, SHA-256, etc.)
 * @codeReturn {String} Hexadecimal checksum string
 * @codeThrows {NoSuchAlgorithmException} When algorithm is not supported
 * @codeVersion 1.0.0
 * @codeStatic true
 * @codeAccess public
 *
 * @codeExample Calculating Checksum
 * byte[] fileData = Files.readAllBytes(path);
 * String checksum = Utils.calculateChecksum(fileData, "SHA-256");
 * System.out.println("Checksum: " + checksum);
 */
