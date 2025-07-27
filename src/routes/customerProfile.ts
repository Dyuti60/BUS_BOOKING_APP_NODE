import express from 'express'
import { Request,Response } from 'express'
const {customerAuth} = require('../middleware/userAuth')
import { Customer,CustomerDocument } from '../model/Customer'

const customerProfile = express.Router()
type CustomerRequest = Request & { customer?: CustomerDocument }

customerProfile.get('/customer/getDetail',customerAuth,async(req:CustomerRequest, res:Response)=>{
    const customer = req.customer
    if(!customer){
        res.status(400).json({
            message:"customer not found"
        })
    return
    }
    const customerDetails = await Customer.findById({
        _id:customer?._id
    })
    if(!customerDetails){
        res.status(400).json({
            message:"No Customer Details Fetched"
        })
    }
    res.status(200).json({
        message:"Customer Details Fetched Successfully",
        data:customerDetails
    })
})
customerProfile.get('/getAllCustomerDetails',async(req:CustomerRequest, res:Response)=>{
    const customerDetails = await Customer.find({})
    if(!customerDetails){
        res.status(400).json({
            message:"No Customer Details Fetched"
        })
    }
    res.status(200).json({
        message:"Customer Details Fetched Successfully",
        data:customerDetails
    })
})

customerProfile.patch('/customer/profile',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const updatedDetails = req.body
    const updatedCustomerDetails = await Customer.findByIdAndUpdate(customer?._id, updatedDetails,
        {new:true}
    )
    if(!updatedCustomerDetails){
        res.status(400).json({
            error:"Customer Details Not Updated"
        })
        return
    }
    res.status(200).json({
        message:"Customer Details Got Updated Successfully",
        data:updatedCustomerDetails
    })
})
customerProfile.delete('/customer/profile',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const deletedCustomerDetails = await Customer.findByIdAndDelete(customer?._id)
    if(!deletedCustomerDetails){
        res.status(400).json({
            error:"Customer Details Not Deleted"
        })
        return
    }
    res.status(200).json({
        message:"Customer Details Got Deleted Successfully",
        data:deletedCustomerDetails
    })
})
