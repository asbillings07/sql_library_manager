const express = require("express");
const router = express.Router();

const Book = require("../models").Book;

//get /books - Shows the full list of books.
router.get("/books", (req, res) => {
  Book.findAll({ order: [["title"]] })
    .then(books => {
      res.render("index", { books: books, title: "The Library" });
    })
    .catch(err => {
      res.sendStatus(500);
    });
});
//get /books/new - Shows the create new book form.
router.get("/books/new", (req, res) => {
  res.render("new-book", { book: Book.build(), title: "New Book" });
});
//post /books/new - Posts a new book to the database.
router.post("/books/new", (req, res) => {
  Book.create(req.body)
    .then(res.redirect(`/books`))
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
    });
});
//post /books/:id - Updates book info in the database.
router.put("/books/:id", (req, res) => {
  Book.findByPk(req.params.id)
    .then(book => {
      if (book) {
        return book.update(req.body);
      } else {
        res.sendStatus(404);
      }
    })
    .then(book => {
      res.redirect(`/books/${book.id}`);
    })
    .catch(err => {
      res.sendStatus(500);
    });
});

//post /books/:id/delete - Deletes a book. Careful, this can’t be undone.
router.post("/books/:id/delete", (req, res) => {
  Book.findByPk(req.params.id)
    .then(book => {
      if (book) {
        return book.destroy();
      } else {
        res.sendStatus(404);
      }
    })
    .then(() => {
      res.redirect("/books");
    })
    .catch(err => {
      res.sendStatus(500);
    });
});

module.exports = router;
