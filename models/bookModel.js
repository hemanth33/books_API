import mongoose from "mongoose";

const bookGenreEnum = [
    "Fiction",
    "Non-Fiction",
    "Fantasy",
    "Sciene-Fiction",
    "Romance",
    "Thriller",
    "Classic",
    "Science",
    "Children",
    "Biography",
    "History",
];

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide the Book Title.'],
        unique: true
    },
    author: {
        type: String,
        required: [true, 'Please provide author Name'],
    },
    description: {
        type: String,
        required: [true, 'Please provide Description of the Book.'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide Image URL'],
    },
    genre: {
        type: String,
        enum: bookGenreEnum,
        required: [true, 'Please Choose a genre for the Book.']
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
},
    {timestamps: true}
);

const Book = mongoose.model('Book', bookSchema);
export default Book;