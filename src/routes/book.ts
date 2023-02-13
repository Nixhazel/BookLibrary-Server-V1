import express from 'express';

import { createBook, deleteBook, editBook, getAllBooks, getBook, getMyBooks } from '../controllers/books';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/getAllBooks', getAllBooks);
router.get('/myBooks/:userId', auth, getMyBooks);
router.get('/myBook/:id', auth, getBook);

router.post('/createBook', auth, createBook);

router.put('/editBook/:id', auth, editBook);

router.delete('/deleteBook/:id', auth, deleteBook);

export default router;
