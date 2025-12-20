let books = []

export const getBooks = (req, res)=>{
    res.status(200).json({
        data: books
    })
}

export const searchBook = (req, res)=>{
    res.status(200).json({
        data: "You are on the search page"
    })
}

export  const getBook = (req, res)=>{
    let bookFound = false
    books.forEach(element => {
        if(element.id == req.params.id){
            res.status(200).json({
                data: books[element.id]
            })
            bookFound = true
        }
    });
    if(!bookFound){
        res.status(404).json({
            data: "Not Found"
        })
    }
}

export const createBook = (req, res, next)=>{
    try{
        const newBook = {
            id: books.length + 1,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price
        }

        books.push(newBook)

        res.status(201).json({
            data: newBook
        })
    }catch(error){
        next(error)
    }
}

export const deleteBook = (req, res)=>{
    let deletedBook
    const updatedBooks = []

    books.forEach(element=>{
        if(element.id == req.params.id){
            deletedBook = element
        }else{
            updatedBooks.push(element)
        }
    })

    books = updatedBooks

    res.status(200).json({
        data: deletedBook
    })
}