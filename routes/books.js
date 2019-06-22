const express = require("express");
const router = express.Router();

const Book = require("../models").Book;

//get /books - Shows the full list of books.
router.get("/books", (req, res) => {
  Book.findAll({ order: [["createdAt", "DESC"]] })
    .then(books => {
      res.render("index", { books: books, title: "The Library" });
    })
    .catch(err => {
      res.sendStatus(500);
      res.render("page-not-found");
    });
});
//get /books/new - Shows the create new book form.
router.get("/books/new", (req, res) => {
  res.render("new-book", { book: Book.build(), title: "New Book" });
});
//post /books/new - Posts a new book to the database.
router.post("/books/new", (req, res) => {
  Book.create(req.body)
    .then(() => res.redirect(`/books`))
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        res.render("new-book", {
          book: Book.build(req.body),
          title: "New Book",
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      res.sendStatus(500);
    });
});
//get /books/:id - Shows book detail form.
router.get("/books/:id", (req, res) => {
  Book.findByPk(req.params.id)
    .then(book => {
      if (book) {
        res.render("update-book", {
          book: book
        });
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      res.sendStatus(500);
      res.render("page-not-found");
    });
});
//post /books/:id - Updates book info in the database.
router.post("/books/:id", (req, res) => {
  Book.findByPk(req.params.id)
    .then(book => {
      if (book) {
        return book.update(req.body);
      } else {
        res.sendStatus(404);
      }
    })
    .then(() => {
      res.redirect(`/books`);
    })
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        const book = Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", {
          book: book,
          title: "Update Book",
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      res.sendStatus(500);
      res.render("page-not-found");
    });
});

//post /books/:id/delete - Deletes a book. Careful, this can’t be undone.
router.post("/books/:id/delete", (req, res) => {
  Book.findByPk(req.params.id)
    .then(book => {
      if (book) {
        return book.destroy();
      } else {
        // res.sendStatus(404);
        res.render("error");
      }
    })
    .then(() => {
      res.redirect("/books");
    })
    .catch(err => {
      res.sendStatus(500);
      res.render("page-not-found");
    });
});

module.exports = router;
