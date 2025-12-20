import express from 'express'
import morgan from 'morgan'
import errorHandler from './middleware/errorHandler.js'
import bookRoutes from './routes/bookRoutes.js'

const app = express()

app.use(express.json())

app.use(morgan('dev'))

app.use('/api', bookRoutes)

app.use(errorHandler)

export default app