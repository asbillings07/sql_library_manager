import express from "express";
const router = express.Router();

//get /books - Shows the full list of books.
router.get((req, res) => {});
//get /books/new - Shows the create new book form.
router.get((req, res) => {});
//post /books/new - Posts a new book to the database.
router.post((req, res) => {});
//get /books/:id - Shows book detail form.
router.get((req, res) => {});
//post /books/:id - Updates book info in the database.
router.post((req, res) => {});

//post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post((req, res) => {});
