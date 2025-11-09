/**
 * Java example with /** comment style
 */
package com.example.api;

/**
 * @api {delete} /api/books/:id Delete Book
 * @apiName DeleteBook
 * @apiGroup Books
 * @apiVersion 1.0.0
 * @apiDescription Delete book by ID (Java implementation)
 *
 * @apiParam {Number} id Book ID
 *
 * @apiSuccess {String} message Success message
 */
public class BooksController {
    public void deleteBook(int id) {
        // Java implementation
    }
}
