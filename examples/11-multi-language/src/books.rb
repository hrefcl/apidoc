# Ruby example with # comment style

# @api {get} /api/books/:id Get Book by ID
# @apiName GetBookById
# @apiGroup Books
# @apiVersion 1.0.0
# @apiDescription Get single book (Ruby implementation)
#
# @apiParam {Number} id Book ID
#
# @apiSuccess {Number} id Book ID
# @apiSuccess {String} title Book title
# @apiSuccess {String} author Author name
# @apiSuccess {String} isbn ISBN number
def get_book(id)
  # Ruby implementation
end

# @api {put} /api/books/:id Update Book
# @apiName UpdateBook
# @apiGroup Books
# @apiVersion 1.0.0
# @apiDescription Update book details (Ruby implementation)
#
# @apiParam {Number} id Book ID
# @apiParam {String} [title] Book title
# @apiParam {String} [author] Author name
#
# @apiSuccess {Object} book Updated book
def update_book(id, params)
  # Ruby implementation
end
