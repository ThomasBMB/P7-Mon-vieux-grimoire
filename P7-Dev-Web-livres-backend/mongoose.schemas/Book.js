const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingsSchema = new Schema({
    userId: String,
    grade: Number
});
const bookSchema = new Schema({
    userId: String,
    title: String,
    author: String,
    imageUrl: String,
    year: Number,
    genre: String,
    ratings: [ratingsSchema],
    averageRating: Number
});

const Book = mongoose.model("Book", bookSchema);

module.exports = { Book };