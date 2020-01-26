const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

// add mongoose helper more mongodb
mongoose.connect(`mongodb+srv://adminedo:${process.env.MONGO_ATLAS_PW}@node-rest-api-dtdwu.mongodb.net/test?retryWrites=true&w=majority`, 
                { 
                    // for under the hood it will use the MongoDB client for
                    //useMongoClient: true 
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })
// loging the calling route to console 
app.use(morgan('dev'))


app.use(bodyParser.urlencoded({extended: false})) // extended: false - simple bodies for URL encoded data
app.use(bodyParser.json())

// Enabled cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        res.header('Access=Control-Allow-Metgods', 'PUT, POST, PATCH, DELETE')
        return res.status(200).json({})
    }
    next()
})

// routes url
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)


// Handling Errors

// error if no macth for route url
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

// error for all the rest 
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app