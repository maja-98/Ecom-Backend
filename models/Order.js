const mongoose = require('mongoose')

const AutoIncrement = require('mongoose-sequence')(mongoose)

const orderSchema = new mongoose.Schema({
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Item'
    }],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    totalPrice:{
        type:Number,
        required:true
    },
    discountPrice:{
        type:Number,
        default: 0
    },
    deliveryCharge:{
        type:Number,
        default:0
    },
    shippingName:{
        type:String,
        required:true
    },
    shippingAddress1:{
        type:String,
        required:true
    },
    shippingAddress2:{
        type:String
    },
    shippingPinCode:{
        type:String,
        required:true
    },
    shippingPhone:{
        type:String,
        required:true
    },
    shippingEmail:{
        type:String
    },
    status:{
        type: String,
        required: true,
        default: "placed"
        //"placed","delivered","packed","return","cancelled","refundInitiated","refundCompleted"
    }
    },
    {
        timestamps:true
    })
orderSchema.plugin(AutoIncrement,{
    inc_field:'orderId',
    start_seq :100000
})
module.exports = mongoose.model('Order',orderSchema)