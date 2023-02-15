const User = require('../models/User')
const Item = require('../models/Item')
const asyncHandler = require('express-async-handler')
const Order = require('../models/Order')


const getOrderDetails = asyncHandler (async (req,res) => {
    const {orderId} = req.body
    let order;
    if (!orderId){
         order = await Order.find().lean()
    }
    else{
         order = await Order.findOne({orderId}).lean().exec()
    }
    
    res.json(order)

})
const createOrderforUser = asyncHandler (async (req,res) => {
    const {user,items,totalPrice,discountPrice,deliveryCharge,shippingName,shippingAddress1, 
        shippingAddress2,shippingPinCode,shippingPhone,shippingEmail} = req.body
    if (!user || !items?.length || !totalPrice || discountPrice===undefined || deliveryCharge===undefined || !shippingName || !shippingAddress1 ||  !shippingPinCode || !shippingPhone  ){
        return res.status(400).json({message:'Mandatory Fields required'})
    }
    const orderObject = {user,items,totalPrice,discountPrice,deliveryCharge,shippingName,shippingAddress1, 
        shippingAddress2,shippingPinCode,shippingPhone,shippingEmail}
    const order = await Order.create(orderObject)
    if (order){
        res.status(201).json({message:`New Order created `})
    }
    else{
        res.status(400).json({message:"Invalid order data recieved"})
    }
})
const updateOrderDetails = asyncHandler (async (req,res) => {
    const {orderId,status} = req.body

    const order = await Order.findOne({orderId}).exec()
    if (!order){
        return res.status(400).json({message: 'No Order found for this User'})
    }
    order.status = status ?? order.status
    await order.save()
    res.json({message:`Order  ${orderId} updated`})
})

module.exports = {createOrderforUser,getOrderDetails,updateOrderDetails}