const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true        
    },
    role: {
        type: String,
        default: "User"
    },
    addressLine1:{
        type: "String"
    },
    addressLine2:{
        type: "String"
    },
    pincode:{
        type: "String"
    },
    phone:{
        type: "String",
        required: true
    },
    email:{
        type: "String"
    },
    active:{
        type: Boolean,
        default: true
    },
    wallet:{
        type:Number,
        default:0
    }
})
module.exports = mongoose.model('User',userSchema)