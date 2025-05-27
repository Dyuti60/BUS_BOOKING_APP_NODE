import mongoose, {Document, Schema} from "mongoose";
import validator from 'validator'
export interface ICustomer extends Document{
    firstName:string,
    lastName:string,
    contactNumber:string,
    emailId:string,
    password:string,
    address:string,
    pincode:string,
    state:string,
    city:string
}
const CustomerSchema: Schema = new Schema({
    firstName: {
        type:String,
        minLength:4,
        maxLength:15,
        required:true,
    },
    lastName:{
        type:String,
        minLength:4,
        maxLength:15,
        required:true
    },
    contactNumber:{
        type:String,
        minLength:10,
        required:true,
        validate(value:string){
            if(!validator.isMobilePhone(value)){
                throw new Error('Invalid Mobile Number: '+value)
            }
        }
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true,
        validate(value:string){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email: "+value)
            }
        }
    },
    password:{
        required:true,
        type:String,
        validate(value:string){
            if(!validator.isStrongPassword(value)){
                throw new Error('Please Enter A Strong Password: '+value)
            }
        }
    },
    address:{
        type:String,
        required:true,
        match:[/^[a-zA-Z0-9\s\/.,*]+$/,'Invalid Address, Please dont include symbolic characters except ,.*/']
    },
    pincode:{
        type:String,
        minLength:6,
        match: [/^\d{6}$/, 'Invalid Indian postal code'],
        required:true
    },
    city:{
        type:String,
        minLength:4,
        maxLength:15,
        required:true
    },
    state:{
        type:String,
        minLength:4,
        maxLength:15,
        required:true
    }
})
export const Customer = mongoose.model<ICustomer>('Customer',CustomerSchema)