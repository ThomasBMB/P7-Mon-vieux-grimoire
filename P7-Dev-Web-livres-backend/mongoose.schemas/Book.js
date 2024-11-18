const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingsSchema = new Schema({
    userId: String,
    grade: Number
});

const bookSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    genre: {
        type: String,
        required: [true, 'Genre is required']
    },
    ratings: [ratingsSchema],
    averageRating: {
        type: Number,
        default: 0
    }
});

const Book = mongoose.model("Book", bookSchema);
module.exports = { Book };
