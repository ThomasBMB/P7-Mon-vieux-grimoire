const fs = require('fs');
const path = require('path');
const sharp = require("sharp");
const { Book } = require("../mongoose.schemas/Book.js");


//Notation d'un livre
async function postRating(req, res) {
    const id = req.params.id;
    const book = await Book.findById(id);
    const userId = req.body.userIdFromToken;

    try {
        const ratings = book.ratings;

        if (ratings.some((obj) => obj.userId === userId)) {
            return res.status(400).send("You have already rated this book");
        }

        const newRating = {
            userId: userId,
            grade: req.body.rating
        };
        ratings.push(newRating);

        const sum = ratings.reduce((total, curr) => total + curr.grade, 0);
        const numberOfRaters = ratings.length;
        let averageRating = sum / numberOfRaters;

        averageRating = Math.round(averageRating * 2) / 2;

        book.ratings = ratings;
        book.averageRating = averageRating;

        await book.save();
        book.imageUrl = generateImageUrl(book.imageUrl);

        res.send(book);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while rating the book.");
    }
}


//Affichage des livres les mieux notés
async function getBooksWithBestRating(req, res) {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    books.forEach((book) => {
        book.imageUrl = generateImageUrl(book.imageUrl);
    })
    res.send(books);
}

//Modification d'un livre
async function putBook(req, res) {
    const id = req.params.id;
    const book = await Book.findById(id);

    if (!book) return res.status(404).send("Book not found");

    const newImage = req.file ? req.file.filename : null;

    try {
        if (newImage) deleteImage(book);

        const bookData = newImage
            ? {
                ...JSON.parse(req.body.book),
                imageUrl: newImage
            }
            : { ...req.body };

        const updatedBook = await Book.findByIdAndUpdate(id, bookData, { new: true });

        updatedBook.imageUrl = generateImageUrl(updatedBook.imageUrl);

        res.send(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating the book.");
    }
}

//Suppression d'un livre
async function deleteBook(req, res) {
    const id = req.params.id;
    const book = await Book.findById(id);
    if (!book) return res.status(404).send("Book not found");
    const userIdOnBook = book.userId;
    if (userIdOnBook !== req.body.userIdFromToken)
        return res.status(401).send("You can only delete your own books");
    const result = await Book.findByIdAndDelete(id);
    deleteImage(book);
    res.send(result);
}

//Affichage du livre sur sa page
async function getBook(req, res) {
    const id = req.params.id;
    const book = await Book.findById(id);
    book.imageUrl = generateImageUrl(book.imageUrl);
    res.send(book);
}

//Ajout d'un livre
async function postBooks(req, res) {
    const bookStringified = req.body.book;
    const book = JSON.parse(bookStringified);
    const file = req.file;

    try {
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
            averageRating: initialAverageRating
        });

        if (file) {
            const outputPath = path.join(__dirname, "..", "images", file.filename);
            await sharp(file.path)
                .resize({ width: 800 })
                .toFormat('jpeg', { quality: 50 })
                .toFile(outputPath);

            sharp.cache(false);
            fs.unlinkSync(file.path);
        }

        await newBook.save();
        res.send(newBook);

    } catch (error) {
        console.error(error);
        if (file) {
            const filePath = path.join(__dirname, "..", "images", file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error("Erreur lors de la suppression du fichier : ", unlinkErr);
                });
            }
        }
        res.status(500).send("An error occurred while adding the book.");

    }
}

//Affichage des livres
async function getBooks(req, res) {
    const allBooks = await Book.find();
    allBooks.forEach((book) => {
        const imageUrl = generateImageUrl(book.imageUrl)
        book.imageUrl = imageUrl;
    });
    res.send(allBooks);
}

//Génération de la couverture
function generateImageUrl(localUrl) {
    const hostUrl = process.env.HOST_URL;
    const port = process.env.PORT;
    const absoluteUrl = hostUrl + ":" + port + "/" + localUrl;
    return absoluteUrl;
}

//Suppression d'une image lorsque nécessaire
function deleteImage(book) {
    const oldImagePath = path.join(__dirname, '..', 'images', book.imageUrl);
    fs.existsSync(oldImagePath) && fs.unlinkSync(oldImagePath);
}

module.exports = { postRating, getBooksWithBestRating, putBook, deleteBook, getBook, postBooks, getBooks };