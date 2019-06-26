const { findPaginationFactors } = require("./findPaginationFactors");

const express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const Op = sequelize.Op;

const Book = require("../models").Book;

router.get("/books", (req, res) => {
  const { limit, offset, page, pageSize } = findPaginationFactors(req);
  Book.findAndCountAll({ order: [["createdAt", "DESC"]], limit, offset })
    .then(books => {
      res.render("index", {
        books: books.rows,
        title: "The Library",
        page,
        pageSize
      });
    })
    .catch(err => {
      res.render("error", { error: err });
    });
});

// adds search feature
router.get("/books/find", (req, res) => {
  let { word } = req.query;
  word = word.toLowerCase();
  const searched = true;

  Book.findAndCountAll({
    where: {
      [Op.or]: [
        {
          title: { [Op.like]: `%${word}%` }
        },
        { author: { [Op.like]: `%${word}%` } },
        { genre: { [Op.like]: `%${word}% ` } },
        { year: { [Op.like]: `%${word}%` } }
      ]
    },
    order: [["title", "DESC"]],
    limit: 7
  })
    .then(books => {
      if (books) {
        res.render("index", {
          books: books.rows,
          title: `Search Results for ${word}`,
          searched,
          word,
          count: books.count
        });
        console.log(books.rows);
      } else {
        res.sendStatus(404, "Page Not Found!");
      }
    })
    .catch(err => {
      res.render("error", { error: err });
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
      res.render("error", { error: err });
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
      res.render("error", { error: err });
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
      res.render("error", { error: err });
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
      res.render("error", { error: err });
    });
});

module.exports = router;
