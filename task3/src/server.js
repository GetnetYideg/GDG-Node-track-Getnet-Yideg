import express from 'express'
import app from './app.js'
const port = 3000

const server = express()

server.use(app)

server.listen(port, ()=>{
    console.log(`Server running in http://localhost:${port}/api/user`)
})
