import express from 'express'
import { Response, Request } from 'express'
const {vendorAuth} = require('../middleware/userAuth')
import { Vendor, VendorDocument } from '../model/Vendor'

export const vendorProfile = express.Router()
type VendorRequest = Request & { vendor?: VendorDocument }

vendorProfile.get('/vendor/getAllVendorDetails', async(req,res:Response)=>{
    try{
        const vendorDetails=await Vendor.find({
        })
        res.status(200).json({
            message:"All Vendor fetched successfully",
            data:vendorDetails
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
vendorProfile.get('/vendor/profile',vendorAuth, async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
        res.status(200).json({
            message:`Vendor ${vendor?.vendorName} fetched successfully`,
            data:vendor
        })
})
vendorProfile.patch('/vendor/profile',vendorAuth, async(req:VendorRequest,res:Response)=>{
    try{
        const vendor = req.vendor
        const updatedData= await req.body
        console.log(updatedData)
        const updatedVendorDetails = await Vendor.findByIdAndUpdate(
        vendor?._id,
        updatedData,
        {new:true, runValidators:true}
        )
        res.status(200).json({
            message:`Vendor ${vendor?.vendorName} detail updated successfully`,
            data:updatedVendorDetails
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
vendorProfile.delete('/vendor/profile',vendorAuth,async(req:VendorRequest,res:Response): Promise<void>=>{
    const vendor = req.vendor
    const vendorId= await vendor?._id
    const deletedVendor = await Vendor.findByIdAndDelete(vendorId)
    if(!deletedVendor){
        res.status(400).json({
            error:"Vendor doesnt exist"
        })
        return
    }
    res.status(200).json({
        message:`vendor ${vendor?.vendorName} successfully deleted`,
        data:deletedVendor?.toObject
    })
})