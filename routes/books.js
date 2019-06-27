const express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const Op = sequelize.Op;

const Book = require("../models").Book;

// pagination function
const findPaginationFactors = req => {
  let page = +req.query.page || 0;
  let pageSize = +req.query.pageSize || 4;
  let offset = page * pageSize;
  let limit = pageSize;
  return {
    offset,
    limit,
    page,
    pageSize
  };
};

// renders pagination function and route
router.get("/books", async (req, res) => {
  const { limit, offset, page, pageSize } = findPaginationFactors(req);
  try {
    const books = await Book.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });
    res.render("index", {
      books: books.rows,
      title: "The Library",
      page,
      pageSize
    });
  } catch (err) {
    res.render("error", { error: err });
  }
});

// adds search feature
router.get("/books/find", async (req, res) => {
  let { word } = req.query;
  word = word.toLowerCase();
  const searched = true;
  try {
    const books = await Book.findAndCountAll({
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
    });
    res.render("index", {
      books: books.rows,
      title: `Search Results for ${word}`,
      searched,
      word,
      count: books.count
    });
  } catch (err) {
    res.render("error", { error: err });
  }
});
//get /books/new - Shows the create new book form.
router.get("/books/new", (req, res) => {
  res.render("new-book", { book: Book.build(), title: "New Book" });
});

//post /books/new - Posts a new book to the database.
router.post("/books/new", async (req, res) => {
  try {
    await Book.create(req.body).then(() => res.redirect("/books"));
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      res.render("new-book", {
        book: Book.build(req.body),
        title: "New Book",
        errors: err.errors
      });
    }
  }
});

//get /books/:id - Shows book detail form.
router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    res.render("update-book", {
      book: book
    });
  } catch (err) {
    res.render("error", { error: err });
  }
});
//post /books/:id - Updates book info in the database.
router.post("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    return book.update(req.body).then(() => res.redirect("/books"));
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      const book = Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", {
        book: book,
        title: "Update Book",
        errors: err.errors
      });
    }
  }
});
//post /books/:id/delete - Deletes a book. Careful, this can’t be undone.
router.post("/books/:id/delete", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    return book.destroy().then(() => {
      res.redirect("/books");
    });
  } catch (err) {
    res.render("error", { error: err });
  }
});

module.exports = router;
