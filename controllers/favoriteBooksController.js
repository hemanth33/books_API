import Book from '../models/bookModel.js';
import User from '../models/userModel.js';

export const addToFavoritesController = async (req, res) => {
    try {

        const userId = req.user._id;
        const { bookId } = req.params;

        const book = await Book.findById(bookId);
        if(!book) {
            return res.status(404).send({
                success: false,
                message: "Book does not exist",
            })
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found.",
            });
        }

        if (user.favoriteBooks.includes(bookId)) {
            return res.status(400).send({
                success: false,
                message: "Book is Already added to Favorites",
            });
        }

        user.favoriteBooks.push(bookId);
        await user.save();

        res.status(200).send({
            success: true,
            message: "Book Added to Favorites",
        });

        

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Add To Favorites API",
            error: error.message,
        });
    }
}

export const deleteFromFavoritesController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { bookId } = req.params;

        const book = await Book.findById(bookId);
        if(!book) {
            return res.status(404).send({
                success: false,
                message: "Book does not exist",
            })
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found.",
            });
        }

        if (!user.favoriteBooks.includes(bookId)) {
            return res.status(400).send({
                success: false,
                message: "Book is not in Favorites",
            });
        }

        user.favoriteBooks = user.favoriteBooks.filter(id => id.toString() !== bookId);
        await user.save();

        res.status(200).send({
            success: true,
            message: "Book Removed from Favorites",
        });
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Delete From Favorites API",
            error: error.message,
        });
    }
}