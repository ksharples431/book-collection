var Book = require('../models/book');
var Author = require('../models/author');
var Series = require('../models/series');

var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Home display
exports.index = function (req, res) {
  async.parallel({
    book_count: function (callback) {
      Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
    },
    author_count: function (callback) {
      Author.countDocuments({}, callback);
    },
    series_count: function (callback) {
      Series.countDocuments({}, callback);
    },
  }, function (err, results) {
    res.render('index', { title: 'Local Library Home', error: err, data: results });
  });
};

// Display list of all Books.
exports.book_list = function (req, res, next) {

  Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('book_list', { title: 'Book List', book_list: list_books });
    });

};

// Display detail page for a specific book.
exports.book_detail = function (req, res, next) {

  async.parallel({
    book: function (callback) {

      Book.findById(req.params.id)
        .populate('author')
        // .populate('genre')
        .exec(callback);
    },
    book_instance: function (callback) {

      BookInstance.find({ 'book': req.params.id })
        .exec(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.book == null) { // No results.
      var err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    res.render('book_detail', { title: results.book.title, book: results.book, book_instances: results.book_instance });
  });

};

// Display book create form on GET.
exports.book_create_get = function (req, res, next) {

  // Get all authors and genres, which we can use for adding to our book.
  async.parallel({
    authors: function (callback) {
      Author.find(callback);
    },
    series: function (callback) {
      Series.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    res.render('book_form', { title: 'Create Book', authors: results.authors, series: results.series });
  });

};

// Handle book create on POST.
exports.book_create_post = [
  // Validate fields.
  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
  body('author', 'Author must not be empty.').trim().isLength({ min: 1 }),
  body('series', 'Series must not be empty.').trim().isLength({ min: 1 }),

  // Sanitize fields (using wildcard).
  sanitizeBody('*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    var book = new Book(
      {
        title: req.body.title,
        author: req.body.author,
        series: req.body.series,
      });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel({
        authors: function (callback) {
          Author.find(callback);
        },
      }, function (err, results) {
        if (err) { return next(err); }

        res.render('book_form', { title: 'Create Book', authors: results.authors, book: book, errors: errors.array() });
      });
      return;
    }
    else {
      // Data from form is valid. Save book.
      book.save(function (err) {
        if (err) { return next(err); }
        //successful - redirect to new book record.
        res.redirect(book.url);
      });
    }
  }
];

// Display book delete form on GET.
exports.book_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};