import mongoose, {Document, Schema} from "mongoose";
export interface ISeat extends Document{
    busId:mongoose.Schema.Types.ObjectId,
    seatNumber: string,
    seatType: 'REGULAR' | 'SLEEPER' | 'SEMI-SLEEPER',
    isAvailable:boolean,
    row:Number,
    column:Number,
    fareModifier?:Number
}
const SeatSchema: Schema = new Schema({
    busId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Bus'
    },
    seatNumber:{
        type:String,
        required:true,
        maxLength:2,
    },
    seatType:{
        type:String,
        enum:['REGULAR','SLEEPER','SEMI-SLEEPER'],
        default:'REGULAR',
        required:true
    },
    isAvailable:{
        type:Boolean,
        required:true
    },
    row:{
        type:Number,
        maxLength:2,
        minLength:1,
        required:true
    },
    column:{
        type:Number,
        maxLength:2,
        minLength:1,
        required:true
    },
    fareModifier:{
        type:Number,
        default:0
    }
})
export const Seat = mongoose.model('Seat',SeatSchema)