import express from 'express'
const app = express();

app.get('/home', (req, res)=>{
    res.status(200).type('text/html').send(`<h1 style="color: green;font-family: monospace; text-align: center;">Welcome to Homepage</h1>`)
})

app.get('/about', (req, res)=>{
    res.status(200).type('text/plain').send('This is Aboutpage')
})

app.get('/student/:id', (req, res)=>{
    const student = {
                        id: req.params.id, 
                        department: req.query.department
                    }
    res.status(200).type('application/json').json(student)
})

app.listen(2000)