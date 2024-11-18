const express = require("express");
const { checkToken } = require("../middlewares/checkToken.js");
const { storage } = require("../middlewares/storage.js");
const multer = require("multer");
const { postRating, getBooksWithBestRating, putBook, deleteBook, getBook, postBooks, getBooks } = require("../features/books");

const bookRouter = express.Router();

bookRouter.post("/:id/rating", checkToken, postRating);
bookRouter.get("/", getBooks);
bookRouter.get("/bestrating", getBooksWithBestRating);
bookRouter.get("/:id", getBook);
bookRouter.delete("/:id", checkToken, deleteBook);
bookRouter.post("/", checkToken, multer({ storage: storage }).single("image"), postBooks);
bookRouter.put("/:id", checkToken, multer({ storage: storage }).single("image"), putBook);

module.exports = { bookRouter };