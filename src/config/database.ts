import mongoose from 'mongoose'
export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://mfsidyutid:7PxRB53puvOSyX08@testcommtinder.vvert.mongodb.net/BUS_BOOKING_DB?tls=true')
}