import express from 'express';
import { addToFavoritesController, deleteFromFavoritesController } from '../controllers/favoriteBooksController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add/:bookId', authMiddleware, addToFavoritesController);
router.delete('/delete/:bookId', authMiddleware, deleteFromFavoritesController);


export default router;