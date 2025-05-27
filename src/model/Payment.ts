import mongoose,{Document,Schema} from "mongoose";
export interface IPayment extends Document{
    bookingId:mongoose.Schema.Types.ObjectId,
    customerId:mongoose.Schema.Types.ObjectId,
    amount:number,
    paymentMethod:string,
    paymentStatus:'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUND',
    paymentGateway:string,
    transactionId:string,
    paidOnDate:Date,
    refundOnDate:Date
}
const PaymentSchema:Schema = new Schema({
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Booking',
        required:true
    },
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Customer'
    },
    amount:{
        type:Number,
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        enum:['PENDING','SUCCESS','FAILED','REFUND'],
        required:true,
        default:'PENDING'
    },
    paymentGateway:{
        type:String,
        required:true
    },
    transactionId:{
        type:String,
        required:true
    },
    paidOnDate:{
        type:Date
    },
    refundOnDate:{
        type:Date
    }
})
export const Payment = mongoose.model('Payment',PaymentSchema)