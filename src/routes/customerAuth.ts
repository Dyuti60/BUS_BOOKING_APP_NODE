import express from 'express'
import { Response,Request } from 'express'
import { Customer, ICustomer, ICustomerMethods } from '../model/Customer'
import { validateCustomerSignUpData } from '../utils/validator'
import bcrypt from 'bcrypt'
export const customerAuth = express.Router()
customerAuth.post('/customer/signup',async (req,res)=>{
    try{
        validateCustomerSignUpData(req)
        const {password} = req.body
        const passwordHash = await bcrypt.hash(password,10)

        const customer = new Customer({
            firstName:req.body.firstName,
            lastName: req.body.lastName,
            contactNumber: req.body.contactNumber,
            emailId: req.body.emailId,
            password: passwordHash,
            address: req.body.address,
            pincode: req.body.pincode,
            city: req.body.city,
            state: req.body.state,
        })
        const customerObj = await  Customer.findOne({
            emailId:req.body.emailId
        })
        if(customerObj){
            res.status(400).json({error:`User with emailId: ${req.body.emailId} exists`})
        }else{
            await customer.save()
            res.json({
                message:`${req.body.firstName} ${req.body.lastName} signed up successfully`
            })
        }

    }catch(err){
        if (err instanceof Error) {
            res.status(400).json({error:`Error: ${err.message}`})
        } else {
            res.status(400).json({error:'Unknown error occurred'});
  }
    }
})
customerAuth.post('/customer/login',async(req: Request<{}, {}, ICustomer>,res:Response)=>{
    try{
        const {emailId,password}=req.body
        const customer = await  Customer.findOne({
            emailId:emailId
        })
        if(emailId.length==0){
            res.status(400).json({error:'Please Enter Email'})
        }
        if(!customer){
            res.status(400).json({error:'EmailId doesnt exist'})
        }else{
            if(password.length==0){
                res.status(400).json({error:'Please Enter Password'})
            }
            const isPasswordValid =await customer.getCustomerPasswordVerified(password)
            if(!isPasswordValid){
                res.status(400).json({error:'Invalid Credentials'})
            }else{
                const token = customer.getJWT()
                res.cookie('token',token,{expires: new Date(Date.now()+1*3600000)})
                res.status(200).json({
                    message:`${customer.firstName} ${customer.lastName} logged in successfully`
                })
            }

        }
        

        // if(!customer){
        //     res.status(400).json({error:'Invalid Credentials'})
        // }else if(customer.password==password){
        //     res.json({
        //         message:"User Logged In Successfully"
        //     })
        // }else{
        //     res.status(400).json({error:'Invalid Credentials'})
        // }

    }catch(err){
        if (err instanceof Error) {
            res.status(400).json({error:`Error: ${err.message}`})
        } else {
            res.status(400).json({error:'Unknown error occurred'});
        }
    }
})
customerAuth.post('/customer/logout',async(req,res)=>{
    try{
        res.cookie('token',null,{expires:new Date(Date.now())})
        res.status(200).json({
            message:"User Logged Out Successfully"
        })
    }catch(err){
        if(err instanceof Error){
            res.status(400).json({
                error:"Error: "+err.message
            })
        }else{
            res.status(400).json({
                error:"Unknown error occurred"
            })
        }
    }
})