/**
 * @apiDefine UserInterface
 * @apiDescription User data structure
 *
 * @apiSuccess {Number} id User's unique identifier
 * @apiSuccess {String} name User's full name
 * @apiSuccess {String} email User's email address
 * @apiSuccess {String} role User role (admin, user, guest)
 * @apiSuccess {Boolean} active Whether the account is active
 *
 * @apiSuccessExample {json} User Object:
 *     {
 *       "id": 123,
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "role": "user",
 *       "active": true
 *     }
 */
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    active: boolean;
}

/**
 * @apiDefine ProductInterface
 * @apiDescription Product data structure
 *
 * @apiSuccess {Number} id Product's unique identifier
 * @apiSuccess {String} name Product name
 * @apiSuccess {Number} price Product price in USD
 * @apiSuccess {String} category Product category
 * @apiSuccess {Boolean} inStock Whether product is available
 *
 * @apiSuccessExample {json} Product Object:
 *     {
 *       "id": 456,
 *       "name": "Laptop",
 *       "price": 999.99,
 *       "category": "Electronics",
 *       "inStock": true
 *     }
 */
export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}

/**
 * @apiDefine OrderInterface
 * @apiDescription Order data structure
 *
 * @apiSuccess {Number} id Order's unique identifier
 * @apiSuccess {Number} userId User who placed the order
 * @apiSuccess {Object[]} items Array of order items
 * @apiSuccess {Number} items.productId Product identifier
 * @apiSuccess {Number} items.quantity Quantity ordered
 * @apiSuccess {Number} items.price Price at time of order
 * @apiSuccess {Number} total Total order amount
 * @apiSuccess {String} status Order status (pending, shipped, delivered)
 * @apiSuccess {Date} createdAt Order creation timestamp
 *
 * @apiSuccessExample {json} Order Object:
 *     {
 *       "id": 789,
 *       "userId": 123,
 *       "items": [
 *         {
 *           "productId": 456,
 *           "quantity": 2,
 *           "price": 999.99
 *         }
 *       ],
 *       "total": 1999.98,
 *       "status": "pending",
 *       "createdAt": "2025-10-03T10:00:00Z"
 *     }
 */
export interface Order {
    id: number;
    userId: number;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
}

export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
}
