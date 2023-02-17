const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const itemSchema = new mongoose.Schema({
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
        default:2
    },
    images:{
        type: [String],
        default: ["https://picsum.photos/200/"]
    },
    colors:[{
        type: String
    }],
    sizes:[{
        type: String
    }],
    category:{
        type:String,
        required: true
    },
    brand:{
        type:String,
        required: true
    },
    active:{
        type: Boolean,
        default: true
    },
    active:{
        type:Boolean,
        default: true
    }
})
itemSchema.plugin(AutoIncrement,{
    inc_field:'itemId',
    start_seq :1000
})
module.exports = mongoose.model('Item',itemSchema)