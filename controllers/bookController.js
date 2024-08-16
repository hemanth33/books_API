import Book from '../models/bookModel.js';

export const addBookController = async (req, res) => {
    try {
        const { title, author, description, imageUrl, genre } = req.body;

        // 1. Check if all fields are provided 
        if( !title || !author ||!description || !imageUrl || !genre) {
            return res.status(400).send({
                success: false,
                message: "Please provide all the fields",
            });
        }

        // 2. Check if book already exists
        const existingBook = await Book.findOne({ title });

        if (existingBook) {
            return res.status(400).send({
                success: false,
                message: "Book already exists in the catalog",
            });
        }

        // 3. Save the book to database
        const book = new Book({
            title,
            author,
            description,
            imageUrl,
            genre
        });

        await book.save();

        res.status(201).send({
            success: true,
            message: "Book added succesfully",
            book,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Add Book API",
            error: error.message,
        });
    }
}

export const deleteBookController = async (req, res) => {
    try {
        const  id  = req.params.bookId;

        // 1. Check if the book exists with the given id
        const isBook = await Book.findById({ _id: id });

        if (!isBook) {
            return res.status(404).send({
                success: false,
                message: "Book Not Found",
            });
        }

        // 2. Delete the Book from database
        await Book.deleteOne({ _id: id });

        res.status(200).send({
            success: true,
            message: "Book Deleted Succesfully"
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Delete Book API",
            error: error.message,
        });
    }
}

export const getAllBookController = async (req, res) => {
    try {
        const books = await Book.find({}).select("-password");

        if (books.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No Books found In the Catalog",
            });
        }

        
        res.status(200).send({
            success: true,
            totalBooks: books.length,
            books,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Get All Books API",
            error: error.message,
        });
    }
}

export const updateBookController = async (req, res) => {
    try {
        const { title, author, description, imageUrl, genre } = req.body;
        const bookId = req.params.bookId;
        const updatedFields = {};

        if(title) { updatedFields.title = title };
        if(author) { updatedFields.author = author };
        if(description) { updatedFields.description = description };
        if(imageUrl) { updatedFields.imageUrl = imageUrl };
        if(genre) { updatedFields.genre = genre };

        const updatedBook = await Book.findByIdAndUpdate(
            bookId, 
            updatedFields,
            { new: true, runValidators: true }
        );

        res.status(200).send({
            success: true,
            message: "Book Updated Successfully",
            updatedBook,
        });


    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Update Book API",
            error: error.message,
        });
    }
}

