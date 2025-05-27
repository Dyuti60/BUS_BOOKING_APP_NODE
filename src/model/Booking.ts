import mongoose, {Document, Schema} from "mongoose";
export interface IBooking extends Document{
    busNumber:String,
    busId:mongoose.Schema.Types.ObjectId,
    customerID:mongoose.Schema.Types.ObjectId,
    origin:String,
    destination:String,
    bookingDate:Date,
    vendorID:String,
    seatNumbers: string[],
    status: 'CONFIRMED' | 'CANCELLED' | 'PENDING'
}
const BookingSchema:Schema = new Schema({
    busNumber:{

    },
    busId:{

    },
    vendorId:{

    },
    customerId:{

    },
    origin:{

    },
    destination:{

    },
    bookingDate:{

    },
    seatNumber:{

    },
    status:{

    }
})
export const Booking = mongoose.model('Booking',BookingSchema)