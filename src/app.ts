import { connectDB } from "./config/database"
import express from 'express'
import {customerAuth}  from './routes/customerAuth'
import { vendorAuth } from "./routes/vendorAuth"
import {busDetailsRoute} from "./routes/busDetail" 
import {vendorProfile} from "./routes/vendorProfile"
import cookieParser from 'cookie-parser'
const app=express()

// Middleware to parse JSON request bodies 
app.use(express.json())
app.use(cookieParser())

//Routes
app.use('/',customerAuth)
app.use('/',vendorAuth)
app.use('/',busDetailsRoute)
app.use('/',vendorProfile)

connectDB()
.then(()=>{
    console.log('Database connected successfully')
    app.listen(4000,()=>{
        console.log('Server is running on port 4000')
    })
})