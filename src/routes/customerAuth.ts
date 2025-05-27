import express from 'express'
import { Customer } from '../model/Customer'
import { validateCustomerSignUpData } from '../utils/validator'
export const customerAuth = express.Router()
customerAuth.post('/customer/signup',async (req,res)=>{
    try{
        validateCustomerSignUpData(req)
        const customer = new Customer({
            firstName:req.body.firstName,
            lastName: req.body.lastName,
            contactNumber: req.body.contactNumber,
            emailId: req.body.emailId,
            password: req.body.password,
            address: req.body.address,
            pincode: req.body.pincode,
            city: req.body.city,
            state: req.body.state,
        })
        await customer.save()
        res.json({
            message:`${req.body.firstName} ${req.body.lastName} signed up successfully`
        })
    }catch(err){
        if (err instanceof Error) {
            res.status(400).send(`Error: ${err.message}`)
        } else {
            res.status(400).send('Unknown error occurred');
  }
    }
})