import express from 'express'
import { Request,Response } from 'express'
const {customerAuth} = require('../middleware/userAuth')
import { Customer,CustomerDocument } from '../model/Customer'
import { Payment } from '../model/Payment'
import { Seat } from '../model/Seat'
import { Booking } from '../model/Booking'

const paymentDetailsRoute = express.Router()
type CustomerRequest = Request & {customer?:CustomerDocument}

paymentDetailsRoute.post('/customer/makePaymentForASeat',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer=req.customer
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const paymentDetails = new Payment({
        bookingId:req.body.bookingId,
        seatId:req.body.seatId,
        customerId:req.body.customerId,
        amount:req.body.amount,
        paymentMethod:req.body.paymentMethod,
        paymentStatus:req.body.paymentStatus,
        paymentGateway:req.body.paymentMethod,
        transactionId:req.body.transactionId,
        paidOnDate:req.body.paidOnDate,
        refundOnDate:req.body.refundOnDate
    })
    if(!paymentDetails){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    res.status(201).json({
        message:`Customer Made Payment Successful`,
        data:paymentDetails
    })
    
})
paymentDetailsRoute.get('/customer/paymentDetails/:transactionId',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const transactionIdParam = req.params.transactionId
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const paymentDetails = await Payment.find({
        transactionId: transactionIdParam
    })
    if(!paymentDetails){
        res.status(400).json({
            error:"Invalid Payment"
        })
    }
    res.status(200).json({
        message:`Payment details fetched successfully for transaction id ${transactionIdParam}`,
        data: paymentDetails
    })
})
paymentDetailsRoute.get('/customer/allpaymentDetails',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const transactionIdParam = req.params.transactionId
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const paymentDetails = await Payment.find({
        customerId: customer?._id
    })
    if(!paymentDetails){
        res.status(400).json({
            error:"Invalid Payment"
        })
    }
    res.status(200).json({
        message:`Payment details fetched successfully for customer ${customer?.firstName} ${customer?.lastName}`,
        data: paymentDetails
    })
})
paymentDetailsRoute.get('/customer/paymentDetails/:paymentStatus',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const paymentStatusParam = req.params.paymentStatus
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const paymentDetails = await Payment.find({
        $and: [
                {customerId: customer?._id},
                {paymentStatus: paymentStatusParam}
            ]
})
    if(!paymentDetails){
        res.status(400).json({
            error:"Invalid Payment"
        })
    }
    res.status(200).json({
        message:`Payment details fetched successfully for customer ${customer?.firstName} ${customer?.lastName} having payment status as ${paymentStatusParam}`,
        data: paymentDetails
    })
})
paymentDetailsRoute.get('/customer/paymentDetails/:paidOnDate',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const paidOnDateParam = req.params.paidOnDate
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const paymentDetails = await Payment.find({
        $and: [
                {customerId: customer?._id},
                {paidOnDate: paidOnDateParam}
            ]
})
    if(!paymentDetails){
        res.status(400).json({
            error:"Invalid Payment"
        })
    }
    res.status(200).json({
        message:`Payment details fetched successfully for customer ${customer?.firstName} ${customer?.lastName} paid on ${paidOnDateParam}`,
        data: paymentDetails
    })
})
paymentDetailsRoute.get('/customer/paymentDetails/:refundOnDate',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const refundOnDateParam = req.params.refundOnDate
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const paymentDetails = await Payment.find({
        $and: [
                {customerId: customer?._id},
                {refundOnDate: refundOnDateParam}
            ]
})
    if(!paymentDetails){
        res.status(400).json({
            error:"Invalid Payment"
        })
    }
    res.status(200).json({
        message:`Payment details fetched successfully for customer ${customer?.firstName} ${customer?.lastName} refunded on ${refundOnDateParam}`,
        data: paymentDetails
    })
})
paymentDetailsRoute.patch('/customer/updatePayment/:transactionId',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const transactionIdParam = req.params.transactionId
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const updatedData = req.body
    const paymentDetails = await Payment.findOneAndUpdate(
        {
            $and: [
                    {customerId: customer?._id},
                    {transactionId: transactionIdParam}
                ]
        },updatedData, {new:true})

    if(!paymentDetails){
        res.status(400).json({
            error:"Invalid Payment"
        })
    }
    res.status(200).json({
        message:`Payment details updated successfully for customer ${customer?.firstName} ${customer?.lastName} having transaction id:${transactionIdParam}`,
        data: paymentDetails
    })
})
paymentDetailsRoute.patch('/customer/updatePayment/:paymentId',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const paymentIdParam = req.params.paymentId
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const updatedData = req.body
    const paymentDetails = await Payment.findOneAndUpdate(
        {
            $and: [
                    {customerId: customer?._id},
                    {_id: paymentIdParam}
                ]
        },updatedData, {new:true})
        
    if(!paymentDetails){
        res.status(400).json({
            error:"Invalid Payment"
        })
    }
    res.status(200).json({
        message:`Payment details updated successfully for customer ${customer?.firstName} ${customer?.lastName} having payment id:${paymentIdParam}`,
        data: paymentDetails
    })
})
paymentDetailsRoute.patch('/customer/updatePayment/:transactionId/:paymentStatus',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const transactionIdParam = req.params.transactionId
    const paymentStatusParam = req.params.paymentStatus
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const paymentDetails = await Payment.findOneAndUpdate(
        {
            $and: [
                    {customerId: customer?._id},
                    {transactionId: transactionIdParam}
                ]
        },{paymentStatus:paymentStatusParam}, {new:true})
        
    if(!paymentDetails){
        res.status(400).json({
            error:"Invalid Payment"
        })
    }
    res.status(200).json({
        message:`Payment status updated successfully for customer ${customer?.firstName} ${customer?.lastName} having transaction Id ${transactionIdParam} to status ${paymentStatusParam}`,
        data: paymentDetails
    })
})
paymentDetailsRoute.delete('/customer/deletePayment/:transactionId',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const transactionIdParam = req.params.transactionId
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const deletePayment = Payment.findOneAndDelete({
        transactionId:transactionIdParam
    })
    res.status(200).json({
        message:`Deleted Successfully Payment Details of transaction Id${transactionIdParam}`,
        data: deletePayment
    })

})
paymentDetailsRoute.delete('/customer/deletePayment/:paymentId',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const paymentIdParam = req.params.paymentId
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const deletePayment = Payment.findByIdAndDelete(paymentIdParam)
    res.status(200).json({
        message:`Deleted Successfully Payment Details of payment Id${paymentIdParam}`,
        data: deletePayment
    })
})
