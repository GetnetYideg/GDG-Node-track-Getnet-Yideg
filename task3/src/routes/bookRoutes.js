import express from 'express'
import {
    getBooks,
    searchBook,
    getBook,
    createBook,
    deleteBook
} from '../controllers/bookController.js'
import bookValidation from '../utils/validationSchema.js'

const router = express.Router()

 router.get('/books', getBooks)
 router.get('/books/search', searchBook)
 router.get('/books/:id', getBook)

 router.post('/books', bookValidation, createBook)
 
 router.delete('/books/:id', deleteBook)

 export default router