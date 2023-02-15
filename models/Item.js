const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const itemSchema = new mongoose.Schema({
    itemid:{
        type:Number,
        required: true
    },
    itemname:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true        
    },
    discount:{
        type: Number,
        default:0
    },
    inventory:{
        type:Number,
        required: true
    },
    image:{
        type: String,
        default: 'https://picsum.photos/200/'
    },
    color:[{
        type: String,
        default: null
    }],
    size:[{
        type: String,
        default: null
    }],
    active:{
        type: Boolean,
        default: true
    }
})
itemSchema.plugin(AutoIncrement,{
    inc_field:'itemid',
    start_seq :1000
})
module.exports = mongoose.model('Item',userSchema)