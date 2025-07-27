import { Request } from 'express'
import validator from 'validator'
import { ICustomer } from '../model/Customer'
export const validateCustomerSignUpData = (req: Request<{}, {}, ICustomer>)=>{
    const {firstName,lastName,emailId,password}=req.body
    if(!firstName && !lastName){
        throw new Error('Name is not valid')
    }else if(!validator.isEmail(emailId)){
        throw new Error('EmailId is not valid')
    }else if(!validator.isStrongPassword(password)){
        throw new Error('Password is not strong enough')
    }
}
export const validateVendorSignUpData = ()=>{

}
export const validateAddBusDetails = ()=>{
    
}