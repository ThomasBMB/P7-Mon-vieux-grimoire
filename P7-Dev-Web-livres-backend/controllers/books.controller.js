const { books } = require("../database/books");
const { Book } = require("../models/Book");
const express = require("express");

async function postBook(req, res) {
    const file = req.file;
    console.log("file", file)
    const body = req.body;
    console.log("body", body);
    const stringifiedBook = req.body.book;
    const book = JSON.parse(stringifiedBook);
    book.imageUrl = file.path;
    try {
        const result = await Book.create(book);
        res.send({ message: "Book posted", book: result });
        console.log('result:', result)
        console.log("book :", book);
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Something went wrong" + e.message);
    }


}

function getBooks(req, res) {
    res.send(books);
};

const booksRouter = express.Router();
booksRouter.get("/", getBooks)
booksRouter.post("/", upload.single("image"), postBook);

module.exports = { booksRouter }