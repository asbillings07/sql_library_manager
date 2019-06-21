const express = require("express");
const router = express.Router();

const Book = require("../models").Book;

//get /books - Shows the full list of books.
router.get("/books", (req, res) => {
  Book.findAll().then(books => {
    res.render("index", { books: books, title: "My Library!" });
  });
});
//get /books/new - Shows the create new book form.
router.get("/books/new", (req, res) => {
  res.render("new-book", { book: Book.build(), title: "New Book" });
});
//post /books/new - Posts a new book to the database.
router.post("/books/new", (req, res) => {
  Book.create(req.body).then(book => {
    res.redirect(`/books/${books.id}`);
  });
});
//get /books/:id - Shows book detail form.
router.get("/books/:id", (req, res) => {
  Book.findByPk(req.params.id).then(book => {
    render("books/show", {
      book: book,
      title: book.title
    });
  });
});
//post /books/:id - Updates book info in the database.
router.put("/books/:id", (req, res) => {
  Book.findByPk(req.params.id)
    .then(book => {
      return book.update(req.body);
    })
    .then(book => {
      res.redirect(`/books/${book.id}`);
    });
});

//post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post("/books/:id/delete", (req, res) => {
  Book.findByPk(req.params.id)
    .then(book => {
      return book.destroy();
    })
    .then(() => {
      res.redirect("/books");
    });
});

module.exports = router;
