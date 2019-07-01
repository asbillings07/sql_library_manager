(req, res) => {
  Book.findByPk(req.params.id).then(book => {
    book.id, book.title;
  });
  res.render('update-book', {
    book,
  });
};

(req, res) => {
  const book = Book.findByPk(req.params.id);
  res.render('update-book', {
    book,
  });
};
