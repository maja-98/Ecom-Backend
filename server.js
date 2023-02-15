require('dotenv').config()
const { mongoose } = require('mongoose')
const express = require('express')
const cors = require('cors')

const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConnection')
const {logger} = require('./middlewares/logger')
const {errorHandler} = require('./middlewares/errorLog')

const app = express()
const PORT = process.env.port || 3500

connectDB()

app.use(logger)
app.use(errorHandler)

app.use(cors(corsOptions))
app.use(express.static('./public'))
app.use(express.json())

app.use('/api/',require('./routes/root'))
app.use('/api/users',require('./routes/userRoutes'))
app.use('/api/items',require('./routes/itemRoutes'))
app.use('/api/carts',require('./routes/cartRoutes'))
app.use('/api/orders',require('./routes/orderRoutes'))


mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT,()=>{
        console.log('http://localhost:'+PORT)
    })
})