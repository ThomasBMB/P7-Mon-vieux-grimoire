const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingsSchema = new Schema({
    userId: String,
    grade: Number
});

const bookSchema = new Schema({
    userId: {
        type: String,
        required: true // Assurer que l'ID de l'utilisateur est obligatoire
    },
    title: {
        type: String,
        required: [true, 'Title is required'] // Titre est obligatoire
    },
    author: {
        type: String,
        required: [true, 'Author is required'] // Auteur est obligatoire
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'] // URL de l'image est obligatoire
    },
    year: {
        type: Number,
        required: [true, 'Year is required'], // Année est obligatoire
        max: [new Date().getFullYear(), 'Year cannot be in the future'] // L'année ne peut pas être dans le futur
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'] // Genre est obligatoire
    },
    ratings: [ratingsSchema],
    averageRating: {
        type: Number,
        default: 0 // Note moyenne par défaut à 0
    }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = { Book };
