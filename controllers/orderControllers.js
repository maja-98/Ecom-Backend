const User = require('../models/User')
const Item = require('../models/Item')
const asyncHandler = require('express-async-handler')
const Order = require('../models/Order')



const getOrderDetails = asyncHandler (async (req,res) => {
   
    const orders = await Order.find().lean().exec()
    if (!orders?.length){
        return res.status(400).json({message:'No orders found'})
    }

    res.json(orders)

})
const getOrdersforUser = asyncHandler (async (req,res) => {
   
    const {userId} = req.params
    const orders = await Order.find().lean().exec()
    const userOrders =  orders.filter(order => order.user == userId)
    if (!userOrders?.length){
        return res.status(400).json({message:'No orders found for this User'})
    }

    
    res.json(userOrders)

})
const createOrderforUser = asyncHandler (async (req,res) => {
    
    const {user,items,deliveryCharge,shippingName,shippingAddress1, 
        shippingAddress2,shippingPinCode,shippingPhone,shippingEmail} = req.body
    if (!user || !items?.length  || !shippingName || !shippingAddress1 ||  !shippingPinCode || !shippingPhone || !items?.map(item=>item.ordQty).every(r=>r)  ){
        return res.status(400).json({message:'Mandatory Fields required'})
    }
    let totalPrice = 0
     let orderItemsTransformed  = []
    for (let i=0;i<items?.length ?? 0;i++){
        const itemObject = await Item.findById(items[i].Id).lean().exec()
        totalPrice += (itemObject.price * items[i].ordQty)
        orderItemsTransformed.push({...itemObject,...items[i]})
        if (itemObject.inventory - items[i].ordQty<0){
            return res.status(400).json({message:"Order not created as inventory not available"})
        }
    }
    const discountPrice = 0
    
    const orderObject = {user,totalPrice,discountPrice,deliveryCharge,shippingName,shippingAddress1, 
        shippingAddress2,shippingPinCode,shippingPhone,shippingEmail,items:orderItemsTransformed}
    const order = await Order.create(orderObject)
   
    if (order){
        
        for (let i=0;i<items.length;i++){
            const itemObject = await Item.findById(items[i].Id).exec()
            itemObject.inventory -=  items[i].ordQty
            await itemObject.save()
            
        }


        console.log(order.items)
        res.status(201).json({message:`New Order created `})
    }
    else{
        res.status(400).json({message:"Invalid order data recieved"})
    }
})
const updateOrderDetails = asyncHandler (async (req,res) => {
    //Only Admin /order owner can make updates
    const {orderId,status,userID} = req.body
    if (!orderId){
        return res.status(400).json({message: 'Mandatory Fields required'})
    }

    const order = await Order.findById(orderId).exec()
    if (!order){
        return res.status(400).json({message: 'No Order found with this ID'})
    }
    order.status = status ?? order.status
    await order.save()
    res.json({message:`Order  ${orderId} updated`})
})

module.exports = {createOrderforUser,getOrderDetails,getOrdersforUser, updateOrderDetails}