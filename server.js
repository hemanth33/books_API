import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDb from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import favoriteBookRoute from './routes/favoriteBookRoutes.js';
import reviewRoute from './routes/reviewRoute.js';


const PORT = process.env.PORT || 5000;

dotenv.config();
connectDb();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/favoritebook', favoriteBookRoute);
app.use('/api/review', reviewRoute);


app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT}`);
});


