const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type : String, required: true}, 
    price:{type : Number, required: true}, 
    //orders : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
})

module.exports = mongoose.model('Product', productSchema)