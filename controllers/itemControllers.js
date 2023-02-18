const Item = require('../models/Item')
const asyncHandler = require('express-async-handler')

const getAllItems = asyncHandler(async (req,res) => {
    const items =await Item.find().select().lean()
    
    if (!items?.length){
        return res.status(400).json({message: 'No Items found'})
    }
    res.json(items)
})

const getItembyItemId = asyncHandler(async (req,res) => {
    const itemId = isNaN(req.params.itemId)===false ? Number(req.params.itemId) : null
    const items =await Item.findOne({itemId}).lean().exec()
    if (!items){
        return res.status(400).json({message: 'No Items found'})
    }
    res.json(items)
})
const getItemById = asyncHandler(async (req,res) => {
    const Id= req.params.Id
    const items =await Item.findById(Id).lean().exec()
    if (!items){
        return res.status(400).json({message: 'No Items found'})
    }
    res.json(items)
})
const getItemByCategory = asyncHandler(async (req,res) => {
    const items =await Item.find().select().lean()
    const category = req.params.category
    console.log(category)
    if (!category){
        return res.status(400).json({message: 'No Items found'})
    }
    if (!items?.length){
        return res.status(400).json({message: 'No Items found'})
    }
    const itemsByCategory = items.filter(item => item.category===category)
    res.json(itemsByCategory)
})
const createNewItem = asyncHandler (async (req,res) => {
    const {itemname,price,discount,inventory,images,sizes,colors,active,category,brand} = req.body
    if(!itemname || !price || !category || !brand   ){
        return res.status(400).json({message:'All fields are required'})
    }
    const duplicate = await Item.findOne({itemname}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:'Item name already exists'})
    }
    const itemObject = {itemname,price,discount,inventory,images,sizes,colors,active,category,brand}
    const item = await Item.create(itemObject)
    if (item){
        res.status(201).json({message:`New Item ${itemname} created`})
    }
    else{
        res.status(400).json({message:"Invalid item data recieved"})
    }
})

const updateItem = asyncHandler (async (req,res) => {
    const {id,itemname,price,discount,inventory,images,sizes,colors,active,category,brand} = req.body
    const item = await Item.findById(id).exec()
    if (!item){
        res.status(400).json({message:"Item not Found"})
    }
    const duplicate = await Item.findOne({itemname}).lean().exec()
    if(duplicate && duplicate?._id.toString()!==id){
        return res.status(409).json({message:'Item name already exists'})
    }
    item.itemname = itemname ?? item.itemname
    item.price = price ?? item.price
    item.active = active ?? item.active
    item.discount = discount ?? item.discount
    item.inventory = inventory ?? item.inventory
    item.images = images ?? item.images
    item.sizes = sizes ?? item.sizes
    item.colors = colors ?? item.colors
    item.category = category ?? item.category
    item.brand = brand ?? item.brand
    const updatedItem = await item.save()
    res.json({message:`${updatedItem.itemname} updated`})
})

const deleteItem = asyncHandler (async (req,res) => {
    const {id} = req.body
    if (!id){
        return res.status(400).json({message:'Item Id required'})
    }
    const item = await Item.findById(id).exec()
    if (!item){
        return res.status(409).json({message:'Item not found'})
    }
    const result = await item.deleteOne()
    res.json(`Item ${result.itemname} Deleted`)
})


module.exports = {getAllItems,createNewItem,updateItem,deleteItem,getItembyItemId ,getItemById,getItemByCategory}