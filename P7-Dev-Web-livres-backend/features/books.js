const express = require("express");
const { Book } = require("../mongoose.schemas/Book.js");
const { checkToken } = require("../middlewares/checkToken.js");
const multer = require("multer");
const { storage } = require("../middlewares/storage.js");

const bookRouter = express.Router();

bookRouter.post("/:id/rating", checkToken, postRating);
bookRouter.get("/", getBooks);
bookRouter.get("/bestrating", getBooksWithBestRating);
bookRouter.get("/:id", getBook);

bookRouter.delete("/:id", checkToken, deleteBook);

bookRouter.post("/", checkToken, multer({ storage: storage }).single("image"), postBooks);

bookRouter.put("/:id", checkToken, putBook);
module.exports = { bookRouter };

async function postRating(req, res) {
    const id = req.params.id;
    const book = await Book.findById(id);
    const userId = req.body.userIdFromToken;

    try {
        const ratings = book.ratings;

        // Vérifie si l'utilisateur a déjà noté ce livre
        if (ratings.some((obj) => obj.userId === userId)) {
            return res.status(400).send("You have already rated this book");
        }

        // Ajoute la nouvelle note
        const newRating = {
            userId: userId,
            grade: req.body.rating
        };
        ratings.push(newRating);

        // Calcule la moyenne de la note
        const sum = ratings.reduce((total, curr) => total + curr.grade, 0);
        const numberOfRaters = ratings.length;
        let averageRating = sum / numberOfRaters;

        // Arrondi au demi-point le plus proche
        averageRating = Math.round(averageRating * 2) / 2;

        // Mettre à jour les informations du livre
        book.ratings = ratings;
        book.averageRating = averageRating;

        await book.save();
        res.send(book);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while rating the book.");
    }
}



async function getBooksWithBestRating(req, res) {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    books.forEach((book) => {
        book.imageUrl = generateImageUrl(book.imageUrl);
    })
    res.send(books);
}

async function putBook(req, res) {
    const id = req.params.id;
    const book = await Book.findById(id);
    if (!book) return res.status(404).send("Book not found");
    const userId = book.userId;
    if (userId !== req.body.userIdFromToken)
        return res.status(401).send("You can only update your own books");
    const result = await Book.findOneAndUpdate(
        { _id: id },
        {
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
            genre: req.body.genre
        }
    );
    res.send(result);
}

async function deleteBook(req, res) {
    const id = req.params.id;
    const book = await Book.findById(id);
    if (!book) return res.status(404).send("Book not found");
    const userIdOnBook = book.userId;
    if (userIdOnBook !== req.body.userIdFromToken)
        return res.status(401).send("You can only delete your own books");
    const result = await Book.findByIdAndDelete(id);
    res.send(result);
}

async function getBook(req, res) {
    const id = req.params.id;
    const book = await Book.findById(id);
    book.imageUrl = generateImageUrl(book.imageUrl);
    res.send(book);
}

function postBooks(req, res) {
    const bookStringified = req.body.book;
    const book = JSON.parse(bookStringified);
    const file = req.file;

    try {
        // Calculer la moyenne initiale si des notes sont fournies
        const ratings = book.ratings || [];
        const initialAverageRating = ratings.length > 0
            ? ratings.reduce((sum, rating) => sum + rating.grade, 0) / ratings.length
            : 0;

        const newBook = new Book({
            userId: book.userId,
            title: book.title,
            author: book.author,
            imageUrl: file.filename,
            year: book.year,
            genre: book.genre,
            ratings: ratings,
            averageRating: initialAverageRating // Utilise la moyenne initiale
        });

        newBook.save();
        res.send(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while adding the book.");
    }
}

async function getBooks(req, res) {
    const allBooks = await Book.find();
    allBooks.forEach((book) => {
        const imageUrl = generateImageUrl(book.imageUrl)
        book.imageUrl = imageUrl;
    });
    res.send(allBooks);
}

function generateImageUrl(localUrl) {
    const hostUrl = process.env.HOST_URL;
    const port = process.env.PORT;
    const absoluteUrl = hostUrl + ":" + port + "/" + localUrl;
    return absoluteUrl;
}