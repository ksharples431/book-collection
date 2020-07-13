#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Book = require('./models/book')
var Author = require('./models/author')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var authors = []
var books = []

function authorCreate(first_name, last_name, cb) {
  authordetail = { first_name: first_name, last_name: last_name }

  var author = new Author(authordetail);

  author.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Author: ' + author);
    authors.push(author)
    cb(null, author)
  });
}

function bookCreate(title, author, cb) {
  bookdetail = {
    title: title,
    author: author
  }

  var book = new Book(bookdetail);
  book.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Book: ' + book);
    books.push(book)
    cb(null, book)
  });
}

function createAuthor(cb) {
  async.series([
    function (callback) {
      authorCreate('Patrick', 'Rothfuss', callback);
    },
    function (callback) {
      authorCreate('Ben', 'Bova', callback);
    },
    function (callback) {
      authorCreate('Isaac', 'Asimov', callback);
    },
    function (callback) {
      authorCreate('Bob', 'Billings', callback);
    },
    function (callback) {
      authorCreate('Jim', 'Jones', callback);
    },
  ],
    // optional callback
    cb);
}


function createBooks(cb) {
  async.parallel([
    function (callback) {
      bookCreate('The Name of the Wind', authors[0], callback);
    },
    function (callback) {
      bookCreate("The Wise Man's Fear", authors[0], callback);
    },
    function (callback) {
      bookCreate("The Slow Regard of Silent Things", authors[0], callback);
    },
    function (callback) {
      bookCreate("Apes and Angels", authors[1], callback);
    },
    function (callback) {
      bookCreate("Death Wave", authors[1], callback);
    },
    function (callback) {
      bookCreate('Test Book 1', authors[4], callback);
    },
    function (callback) {
      bookCreate('Test Book 2', authors[4], callback)
    }
  ],
    // optional callback
    cb);
}



async.series([
  createAuthor,
  createBooks,
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    else {
      console.log('OK!');

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });




