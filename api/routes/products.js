const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()


const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Product.find()
        .select("name price _id")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                product: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:800/products/' + doc._id
                        }
                    }
                })
            }
            // if(docs.length > 0) {
              res.status(200).json(response)
            // }
            // else res.status(404).json({
            //     message: 'No entries found'
            // })
        })
        .catch(err => {
            console.log(err)
            tus(500).json({ error: err })
        })
})

router.post('/', (req, res, next) => {
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // }
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    //product.save((err, result) => { doing something})
    product.save().then(result => {
        console.log(result)
        res.status(201).json({
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:8000/products" + result._id
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
    })

})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    console.log()
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc)
            if (doc) {
                res.status(200).json(doc)
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' })
            }
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
    // if (id === 'special'){
    //     res.status(200).json({
    //         message: 'You discovered the special ID',
    //         id: id
    //     })
    // } else {
    //     res.status(200).json({
    //         message: 'You passed an ID'
    //     })
    // }
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    // for sending object[] e.g [ {"propName: <name>, "value": <value> }]
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
          })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})


module.exports = router