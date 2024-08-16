import User from '../models/userModel.js';
import Book from '../models/bookModel.js';
import Review from '../models/reviewsModel.js';


export const addReviewController = async (req, res) => {
    try {
        const { reviewDetails, rating } = req.body;
        const bookId = req.params.bookId;
        const userId = req.user._id;

        if (!reviewDetails || !rating) {
            return res.status(400).send({
                success: false,
                message: "Please provide all the details",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found",
            });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).send({
                success: false,
                message: "Book Not Found",
            });
        }

        const review = new Review({
            reviewDetails,
            rating,
            reviewerId: user._id,
            reviewedBookId: book._id,
        });

        await review.save();

        user.reviews.push(review._id);
        book.reviews.push(review._id);

        await user.save();
        await book.save();

        res.status(201).send({
            success: true,
            message: "Review Added Successfully",
            review
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Add Review API",
            error: error.message,
        });
    }
}

export const updateReviewController = async (req, res) => {
    try {
        const { reviewDetails, rating } = req.body;
        const reviewId = req.params.reviewId;

        const updatedReview = {};

        if (reviewDetails) { updatedReview.reviewDetails = reviewDetails };
        if (rating) { updatedReview.rating = rating};

        const review = await Review.findByIdAndUpdate(reviewId, updatedReview, { new: true, runValidators: true});

        if (!review) {
            return res.status(500).send({
                success: false,
                message: "Something Went Wrong while updating review",
            })
        }

        res.status(200).send({
            success: true,
            message: "Review Updated Successfully",
            review
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Update Review API",
            error: error.message,
        });
    }
}

export const deleteReviewController = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const review = await Review.findById({_id: reviewId});

        if(!review) {
            return res.status(404).send({
                success: false,
                message: "Review Not Found"
            });
        }

        const userId = review.reviewerId;
        const bookId = review.reviewedBookId;

        const user = await User.findById(userId);
        const book = await Book.findById(bookId);

        if(!user || !book) {
            return res.status(404).send({
                success: false,
                message: "User or Book not found.",
            });
        }

        user.reviews = user.reviews.filter(id => id.toString() !== reviewId);
        book.reviews = book.reviews.filter(id => id.toString() !== reviewId);

        await Promise.all([user.save(), book.save()]);
        await Review.deleteOne({ _id : reviewId });

        res.status(200).send({
            success: true,
            message: "Review Deleted Successfully",
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Delete Review API",
            error: error.message,
        });
    }
}

export const getUserReviewsController = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById({ _id: userId }).populate('reviews');

        if(!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found",
            });
        }

        res.status(200).send({
            success: true,
            reviewsCount: user.reviews.length,
            reviews: user.reviews
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Get User Review API",
            error: error.message,
        });
    }
} 

export const getBookReviewsController = async (req, res) => {
    try {
        const bookId = req.params.bookId;

        const book = await Book.findById({ _id: bookId }).populate('reviews');

        if(!book) {
            return res.status(404).send({
                success: false,
                message: "No Reviews Found for this book",
            });
        }

        res.status(200).send({
            success: true,
            reviewsCount: book.reviews.length,
            reviews: book.reviews,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Get Book Review API",
            error: error.message,
        });
    }
}