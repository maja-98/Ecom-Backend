const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({


    items: [{
            itemId:{
            type: mongoose.Schema.Types.Number,
            ref:'Item'
        },
        quantity:{
            type: Number,
            default: 1
        }
    }],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    discountPrice:{
        type:Number,
        default: 0
    },
    deliveryCharge:{
        type:Number,
        default:0
    }})

module.exports = mongoose.model('Cart',cartSchema)