import express from 'express'
import { Vendor } from '../model/Vendor'
// import { validateVendorSignUpData } from '../utils/validator'

export const vendorAuth = express.Router()
vendorAuth.post('/vendor/signup',async (req,res)=>{
    try{
        // validateVendorSignUpData()
        const vendor = new Vendor({
            vendorName:req.body.vendorName,
            vendorPassword:req.body.vendorPassword,
            vendorEmail:req.body.vendorEmail,
            vendorContact:req.body.vendorContact,
            vendorAddnlContact:req.body.vendorAddnlContact,
            vendorAddress:req.body.vendorAddress,
            vendorPincode:req.body.vendorPincode,
            vendorState:req.body.vendorState,
            vendorCity:req.body.vendorCity
        })
        await vendor.save()
        res.json({
            message:`${req.body.vendorName} signed up successfully`
        })
    }catch(err){
        if (err instanceof Error) {
            res.status(400).send(`Error: ${err.message}`)
        } else {
            res.status(400).send('Unknown error occurred');
  }
    }
})