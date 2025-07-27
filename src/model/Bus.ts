import mongoose, {Document,Schema} from "mongoose";

export interface IBus extends Document{
    busName:string,
    busNumber:string,
    vendorId:mongoose.Schema.Types.ObjectId,
    busSeatRows:number,
    busSeatColumns:number,
    totalSeats:number,
    additionalSeats:number,
    origin:string,
    midOrigin:string,
    destination:string,
    departure:string,
    arrival:string
    price:number,
    midPrice:number,
    stops:[string],
    amenities:[string],
    description:string
    status:string
}

const BusSchema: Schema = new Schema<IBus>({
    busName:{
        type:String,
        minLength:4,
        maxLength:20,
        uppercase:true,
        required:true
    },
    busNumber:{
        type:String,
        minLength:4,
        maxLength:10,
        unique:true,
        uppercase:true,
        required:true
    },
    vendorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        uppercase:true,
        required:true
    },
    busSeatRows:{
        type:Number,
        min:1,
        max:10,
        required:true
    },
    busSeatColumns:{
        type:Number,
        min:1,
        max:4,
        required:true
    },
    additionalSeats:{
        type:Number,
        default:0,
        max:3
    },
    totalSeats:{
        type:Number,
        required:true,
        validate:{
            validator: function(this:IBus,value:number){
                return value==(this.busSeatRows*this.busSeatColumns) + this.additionalSeats
            },
            message:"Total Seat in a bus cant be greater than bus row multiplied by bus columns plus additional seats"
        }
    },
    origin:{
        type:String,
        uppercase:true,
        minLength:2,
        maxLength:15,
        required:true
    },
    midOrigin:{
        type:String,
        uppercase:true,
        minLength:2,
        maxLength:15
    },
    destination:{
        type:String,
        uppercase:true,
        minLength:2,
        maxLength:15,
        required:true
    },
    departure:{
        type:String,
        minLength:4,
        maxLength:6,
        required:true
    },
    arrival:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    midPrice:{
        type:Number,
        validate:{
            validator(this:IBus,value:number|undefined){
                if(this.midOrigin && (value === undefined || value === null)){
                    return false
                }
                if(!this.midOrigin && value !== undefined && value !==null){
                    return false
                }
                return true
            },
            message:"midPrice is mandatory when midOrigin is defined"
        }
    },
    stops:{
        type:[String],
        required:true
    },
    amenities:{
        type:[String],
        required:true
    },
    description:{
        type:String,
        maxLength:300,
        required:true,
    },
    status:{
        type:String,
        enum:{
            values:["Active","InActive","Cancelled"],
            message:'{VALUE} has invalid status type'
        },
        default:"Active",
        required:true
    },
},    
{
        timestamps:true
    }
)
export const Bus = mongoose.model<IBus>('Bus',BusSchema)
