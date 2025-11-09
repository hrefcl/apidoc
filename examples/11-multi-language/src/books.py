"""
Python example with # comment style
"""

# @api {get} /api/books Get Books
# @apiName GetBooks
# @apiGroup Books
# @apiVersion 1.0.0
# @apiDescription Get all books (Python implementation)
#
# @apiSuccess {Object[]} books Array of books
# @apiSuccess {Number} books.id Book ID
# @apiSuccess {String} books.title Book title
# @apiSuccess {String} books.author Author name
def get_books():
    """Get all books"""
    pass

# @api {post} /api/books Create Book
# @apiName CreateBook
# @apiGroup Books
# @apiVersion 1.0.0
# @apiDescription Create new book (Python implementation)
#
# @apiParam {String} title Book title
# @apiParam {String} author Author name
# @apiParam {String} isbn ISBN number
#
# @apiSuccess {Number} id Created book ID
def create_book():
    """Create a new book"""
    pass
