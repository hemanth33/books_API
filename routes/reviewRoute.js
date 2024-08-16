import express from 'express';
import { addReviewController, deleteReviewController, getBookReviewsController, getUserReviewsController, updateReviewController } from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add/:bookId', authMiddleware, addReviewController);
router.put('/update/:reviewId', authMiddleware, updateReviewController);
router.delete('/delete/:reviewId', authMiddleware, deleteReviewController);
router.get('/user/get-reviews', authMiddleware, getUserReviewsController);
router.get('/book/get-reviews/:bookId', getBookReviewsController);



export default router;