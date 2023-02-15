require('dotenv').config()
const { mongoose } = require('mongoose')
const express = require('express')
const cors = require('cors')

const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConnection')


const app = express()
const PORT = process.env.port || 3500

connectDB()

app.use(cors(corsOptions))
app.use(express.static('./public'))
app.use(express.json())

app.use('/',require('./routes/root'))
app.use('/users',require('./routes/userRoutes'))
app.use('/items',require('./routes/itemRoutes'))


mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT,()=>{
        console.log('http://localhost:'+PORT)
    })
})