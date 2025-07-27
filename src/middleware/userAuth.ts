import jwt, {JwtPayload} from 'jsonwebtoken'
import { Request,Response,NextFunction } from 'express'
import { Customer,ICustomer, CustomerDocument } from '../model/Customer'
import { Vendor, IVendor, VendorDocument } from '../model/Vendor';

interface MyJwtPayload extends JwtPayload {
  _id: string;
}
type CustomerRequest = Request & { customer?: CustomerDocument }
type VendorRequest = Request & { vendor?: VendorDocument }

const customerAuth = async (req:CustomerRequest,res:Response,next:NextFunction)=>{
    try{
        const {token} = req.cookies
        if(!token) res.status(403).json({error:"Invalid Token"})
        
        const decodedMessage=await jwt.verify(token,"Customer$Bus$Booking$System$720") as MyJwtPayload
        const customer = await Customer.findOne({
            _id:decodedMessage._id
        })
        if(!customer){
            res.status(403).json({error:"Invalid Token"})
        }else{
            req.customer=customer
            next()
        }
    }catch(err){
        if (err instanceof Error) {
            res.status(403).json({error:`Unauthorised Error: ${err.message}`})
        } else {
            res.status(403).json({error:'Unknown error occurred'});
    }
}
}
const vendorAuth = async(req:VendorRequest,res:Response,next:NextFunction)=>{
    try{
        const {token} = req.cookies
        if(!token) return res.status(403).json({error:"Invalid Token"})
        
        const decodedMessage = await jwt.verify(token,"$Vendor$Bus$Booking$System$420") as MyJwtPayload
        const vendor = await Vendor.findOne({
            _id:decodedMessage._id
        })
        if(!vendor){
            return res.status(403).json({error:"Invalid Token"})
        }else{
            (req as VendorRequest).vendor = vendor;
            next()
        }
    }catch(err){
        if(err instanceof Error){
            res.status(403).json({error:`Unauthorised Access: ${err.message}`})
        }else{
            res.status(403).json({error:`Unknown Error Occurred`})
        }
    }
}
module.exports = {customerAuth,vendorAuth}