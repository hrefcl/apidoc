/**
 * @api {get} /api/users/:id Get User
 * @apiName GetUser
 * @apiGroup SDK
 * @apiVersion 1.0.0
 * @apiDescription Get user by ID with SDK examples in multiple languages
 *
 * @apiParam {Number} id User ID
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User name
 * @apiSuccess {String} email User email
 *
 * @apiExample {curl} cURL:
 *     curl https://api.example.com/api/users/123
 *
 * @apiExample {javascript} JavaScript (Node.js):
 *     const axios = require('axios');
 *
 *     async function getUser(id) {
 *       const response = await axios.get(`https://api.example.com/api/users/${id}`);
 *       return response.data;
 *     }
 *
 *     getUser(123).then(user => console.log(user));
 *
 * @apiExample {python} Python:
 *     import requests
 *
 *     def get_user(user_id):
 *         response = requests.get(f'https://api.example.com/api/users/{user_id}')
 *         return response.json()
 *
 *     user = get_user(123)
 *     print(user)
 *
 * @apiExample {php} PHP:
 *     <?php
 *     function getUser($userId) {
 *         $url = "https://api.example.com/api/users/" . $userId;
 *         $response = file_get_contents($url);
 *         return json_decode($response, true);
 *     }
 *
 *     $user = getUser(123);
 *     print_r($user);
 *     ?>
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 123,
 *       "name": "John Doe",
 *       "email": "john@example.com"
 *     }
 */
function getUser(req, res) {}

/**
 * @api {post} /api/users Create User
 * @apiName CreateUser
 * @apiGroup SDK
 * @apiVersion 1.0.0
 *
 * @apiParam {String} name User name
 * @apiParam {String} email User email
 *
 * @apiExample {curl} cURL:
 *     curl -X POST https://api.example.com/api/users \
 *       -H "Content-Type: application/json" \
 *       -d '{"name": "Jane Doe", "email": "jane@example.com"}'
 *
 * @apiExample {javascript} JavaScript (fetch):
 *     fetch('https://api.example.com/api/users', {
 *       method: 'POST',
 *       headers: {'Content-Type': 'application/json'},
 *       body: JSON.stringify({
 *         name: 'Jane Doe',
 *         email: 'jane@example.com'
 *       })
 *     })
 *     .then(res => res.json())
 *     .then(user => console.log(user));
 *
 * @apiExample {python} Python (requests):
 *     import requests
 *
 *     user_data = {
 *         'name': 'Jane Doe',
 *         'email': 'jane@example.com'
 *     }
 *
 *     response = requests.post(
 *         'https://api.example.com/api/users',
 *         json=user_data
 *     )
 *
 *     user = response.json()
 *     print(user)
 */
function createUser(req, res) {}
