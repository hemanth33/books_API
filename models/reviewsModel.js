import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewDetails: {
        type: String,
        required: [true, 'Please provide Feedback.']
    },
    rating: {
        type: Number,
        required: [true, 'Please give rating'],
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewedBookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }
},
    {timestamps: true}
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;