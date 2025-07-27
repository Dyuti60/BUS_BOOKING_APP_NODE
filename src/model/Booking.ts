import mongoose, {Document, Schema} from "mongoose";
export interface IBooking extends Document{
    _id: mongoose.Schema.Types.ObjectId,
    busNumber:String,
    busId:mongoose.Schema.Types.ObjectId,
    customerId:mongoose.Schema.Types.ObjectId,
    origin:String,
    destination:String,
    travelDate:Date,
    bookingDate:Date,
    vendorID:String,
    seatNumber: String,
    status: 'CONFIRMED' | 'CANCELLED' | 'PENDING'
}
const BookingSchema:Schema = new Schema<IBooking>({
    busNumber:{
        type:String,
        required:true
    },
    busId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required:true
    },
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required:true
    },
    origin:{
        type: String,
        required: true
    },
    destination:{
        type: String,
        required: true
    },
    travelDate:{
        type:Date,
        required:true
    },
    bookingDate:{
        type:Date,
        required:true
    },
    seatNumber:{
        type:String,
        required: true
    },
    status:{
        type:String,
        enum:['CONFIRMED','CANCELLED','PENDING'],
        required:true,
        default:'PENDING'
    }
},
{
    timestamps:true
}
)
export const Booking = mongoose.model<IBooking>('Booking',BookingSchema)