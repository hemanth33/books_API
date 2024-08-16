import express from 'express';
import { addBookController, deleteBookController, getAllBookController, updateBookController } from '../controllers/bookController.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-book', authMiddleware, adminMiddleware, addBookController);
router.get('/all-book', getAllBookController);
router.put('/update-book/:bookId', authMiddleware, adminMiddleware, updateBookController);
router.delete('/delete-book/:bookId', authMiddleware, adminMiddleware, deleteBookController);

export default router;