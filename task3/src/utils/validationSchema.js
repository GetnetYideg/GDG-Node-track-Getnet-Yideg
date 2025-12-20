import joi from 'joi'
const bookSchema = joi.object({
    title: joi.string().min(5).required(),
    author: joi.string().min(5).required(),
    price: joi.number().integer().min(0).required()
})

const bookValidation = (req, res, next)=>{
    const { error } = bookSchema.validate(req.body)
    if(error){
        res.status(400)
        return next( new Error(error.details.map(d=>d.message).join(', ')))
    }

    next()
}

export default bookValidation