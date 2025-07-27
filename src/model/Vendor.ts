import mongoose, {Document,Schema} from "mongoose";
import validator from 'validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
export interface IVendor extends Document{
    vendorName:string,
    vendorEmail:string,
    vendorPassword:string,
    vendorContact:string,
    vendorAddnlContact:string,
    vendorAddress:string,
    vendorPincode:string,
    vendorState:string,
    vendorCity:string
}
export interface IVendorMethods{
    getJWT():string
    getVendorPasswordVerified(password:string):Promise<Boolean>
}
export type VendorDocument = Document & IVendor & IVendorMethods;

const VendorSchema: Schema = new Schema<IVendor, mongoose.Model<VendorDocument>, IVendorMethods>({
    vendorName:{
        type:String,
        minLength:4,
        maxLength:15,
        required:true,
    },
    vendorEmail:{
        type: String,
        trim:true,
        lowercase:true,
        required:true,
        immutable:true,
        unique:true,
        validate(value:string){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email: '+value)
            }
        }
    },
    vendorPassword:{
        type:String,
        required:true,
        validate(value:string){
            if(!validator.isStrongPassword(value)){
                throw new Error('Need Strong Password')
            }
        }
    },
    vendorContact:{
        type:String,
        maxLength:10,
        required:true,
        validate(value:string){
            if(!validator.isMobilePhone(value)){
                throw new Error('Invalid Contact Number: '+value)
            }
        }
    },
    vendorAddnlContact:{
        type:String,
        maxLength:10,
        validate(value:string){
            if(!validator.isMobilePhone(value)){
                throw new Error('Invalid Contact Number: '+value)
            }
        }
    },
    vendorAddress:{
        type:String,
        required:true,
        minLength:6,
        maxLength:50,
        match:[/^[a-zA-Z0-9\s.,*\/]+$/,'Inavlid Address, Please dont add symbols except .,\/*']
    },
    vendorPincode:{
        type:String,
        maxLength:6,
        match:[/^\d{6}$/,'Invalid Pincode']
    },
    vendorState:{
        minLength:4,
        maxLength:15,
        type:String,
    },
    vendorCity:{
        minLength:4,
        maxLength:15,
        type:String,
    }
},{
    timestamps:true
})
VendorSchema.methods.getJWT = function():string{
    const vendor =this
    const token = jwt.sign({_id:vendor._id},"$Vendor$Bus$Booking$System$420",{expiresIn:"1h"})
    return token
}
VendorSchema.methods.getVendorPasswordVerified = async function(passwordInputValue:string){
    const vendor = this
    const passwordHash = vendor.vendorPassword
    const isPasswordValid = await bcrypt.compare(passwordInputValue,passwordHash)
    return isPasswordValid 
}
export const Vendor = mongoose.model<VendorDocument>('Vendor',VendorSchema)