import mongoose, {Document, Schema} from "mongoose";
export interface ISeat extends Document{
    busId:mongoose.Schema.Types.ObjectId,
    seatNumber: String,
    seatType: 'REGULAR' | 'SLEEPER' | 'SEMI-SLEEPER',
    isAvailable:boolean,
    row:Number,
    column:Number,
    fareModifier?:Number,
    fareModifierFlag?:Boolean
}
const SeatSchema: Schema = new Schema<ISeat>({
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
    },
    fareModifierFlag:{
        type:Boolean,
        default:"Neutral",
        enum: ['Neutral','Positive','Negative']
    }
})
export const Seat = mongoose.model<ISeat>('Seat',SeatSchema)