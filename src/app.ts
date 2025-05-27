import { connectDB } from "./config/database"
import express from 'express'
import {customerAuth}  from './routes/customerAuth'
import { vendorAuth } from "./routes/vendorAuth"
const app=express()

// Middleware to parse JSON request bodies 
app.use(express.json())

//Routes
app.use('/',customerAuth)
app.use('/',vendorAuth)

connectDB()
.then(()=>{
    console.log('Database connected successfully')
    app.listen(4000,()=>{
        console.log('Server is running on port 4000')
    })
})