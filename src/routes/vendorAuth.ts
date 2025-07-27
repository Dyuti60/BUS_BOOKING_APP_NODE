import express from 'express'
import { Request,Response } from 'express'
import { IVendor, Vendor, IVendorMethods } from '../model/Vendor'
import bcrypt from 'bcrypt'
// import { validateVendorSignUpData } from '../utils/validator'

export const vendorAuth = express.Router()
vendorAuth.post('/vendor/signup',async (req: Request<{}, {}, IVendor>,res:Response)=>{
    try{
        const passwordHash = await bcrypt.hash(req.body.vendorPassword,10)
        // validateVendorSignUpData()
        const vendor = new Vendor({
            vendorName:req.body.vendorName,
            vendorPassword:passwordHash,
            vendorEmail:req.body.vendorEmail,
            vendorContact:req.body.vendorContact,
            vendorAddnlContact:req.body.vendorAddnlContact,
            vendorAddress:req.body.vendorAddress,
            vendorPincode:req.body.vendorPincode,
            vendorState:req.body.vendorState,
            vendorCity:req.body.vendorCity
        })
        const vendorObj = await Vendor.findOne({
            vendorEmail:req.body.vendorEmail
        })
        if(vendorObj){
            res.status(400).json({error:`Vendor with emailId: ${req.body.vendorEmail} exists`})
        }else{
            await vendor.save()
            res.json({
                message:`${req.body.vendorName} signed up successfully`
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
vendorAuth.post('/vendor/login',async(req: Request<{}, {}, IVendor>,res:Response)=>{
    try{
        const {vendorEmail,vendorPassword}=req.body
        const vendor = await  Vendor.findOne({
            vendorEmail:vendorEmail
        })
        if(vendorEmail.length==0){
            res.status(400).json({error:'Please Enter Email'})
        }
        if(!vendor){
            res.status(400).json({error:'Email doesnt exist'})
        }
        else{
            if(vendorPassword.length==0){
                res.status(400).json({error:'Please Enter Password'})
            }
            const isPasswordVerified= await vendor.getVendorPasswordVerified(vendorPassword)
            console.log(isPasswordVerified)
            if(!isPasswordVerified){
                res.status(400).json({error:'Invalid Credentials'})
            }else{
                const token = vendor.getJWT()
                res.cookie('token',token,{expires:new Date(Date.now()+1*3600000)})
                res.status(200).json({
                    message:`${vendor.vendorName} logged in successfully`
                })
            }
        }
        
        // else if(vendor.vendorPassword==vendorPassword){
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
vendorAuth.post('/vendor/logout',async(req,res)=>{
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