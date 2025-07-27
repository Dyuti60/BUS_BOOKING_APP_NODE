import mongoose, {Document, Schema} from "mongoose";
import express from 'express'
import { Response, Request } from 'express'
const bookingDetailsRoute = express.Router()
import { customerAuth } from './customerAuth'
import { vendorAuth } from './vendorAuth'
import { VendorDocument } from '../model/Vendor'
import { CustomerDocument } from '../model/Customer'
import { Booking } from '../model/Booking'
import { Bus } from '../model/Bus'
import { IBooking } from '../model/Booking'

type VendorRequest = Request & { vendor?: VendorDocument }
type CustomerRequest = Request & { customer?: CustomerDocument }


bookingDetailsRoute.post('/customer/BookOneSeat/:busId',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const busIdParam = req.params.busId
    const busDetails = await Bus.findById(busIdParam)

    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    const bookingDetails = new Booking({
        busNumber: busDetails?.busNumber,
        busId: busIdParam,
        customerId: customer?._id,
        origin: req.body.origin,
        destination: req.body.destination,
        travelDate: req.body.travelDate,
        bookingDate: req.body.bookingDate,
        seatNumber: req.body.seatNumber,
        status: req.body.status
    })
    await bookingDetails.save()
    res.status(201).json({
        message:`${customer?.firstName} ${customer?.lastName} has booked ${req.body.seatNumber} in ${busDetails?.busName} having ${busDetails?.busNumber}
        on ${req.body.travelDate}`
    })
})
bookingDetailsRoute.post('/customer/bookManySeats/:busId',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const busIdParam = req.params.busId
    const busDetails = await Bus.findById(busIdParam)
    const seatBookingData = req.body.data
    const seatBookCount = seatBookingData.length
    const seatNumbers = []
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!customer){
        res.status(400).json({
            error:"Invalid Customer"
        })
    }
    for (let i=0;i<=seatBookCount;i++){
        const bookingDetails = new Booking({
            busId: busIdParam,
            seatNumber: seatBookingData[i].seatNumber,
            seatType: seatBookingData[i].seatType,
            isAvailable: seatBookingData[i].isAvailable,
            row: seatBookingData[i].row,
            column: seatBookingData[i].column,
            fareModifier: seatBookingData[i].fareModifier,
            fareModifierFlag: seatBookingData[i].fareModifierFlag
        })
        seatNumbers.push(seatBookingData[i].seatNumber)
        await bookingDetails.save()
    }

    res.status(201).json({
        message:`${customer?.firstName} ${customer?.lastName} has booked ${seatNumbers.toString()} in ${busDetails?.busName} having ${busDetails?.busNumber}`
    })
})
bookingDetailsRoute.get('/customer/bookedSeatDetails/:busId',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const busIdParam = req.params.busId
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    const busDetails = await Bus.findById(busIdParam)
    const allBookingDetails = await Booking.find({
        busId: busIdParam
    })
    if(!allBookingDetails){
        res.status(400).json({
            error:"No Seat Booked"
        })
    }
    res.status(200).json({
        message:`Fetched all seats in bus ${busDetails?.busName}`,
        data:allBookingDetails
    })
})
bookingDetailsRoute.get('/customer/boookingDetails/:busId/:bookingId',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const busIdParam = req.params.busId
    const bookIdParam = req.params.bookingId
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!bookIdParam){
        res.status(400).json({
            error:"Invalid Booking Id"
        })
    }
    const busDetails = await Bus.findById(busIdParam)
    const bookingDetails = await Booking.find({
        $and: [
            {_id: bookIdParam},
            {busId: busIdParam}
        ]
    })
    if(!bookingDetails){
        res.status(400).json({
            error:"No Seat Found"
        })
    }
    res.status(200).json({
        message:`Fetched Boooking Details Successfully`,
        data:bookingDetails
    })
})
bookingDetailsRoute.get('/customer/bookingDetails/:busId/:status',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const busIdParam = req.params.busId
    const statusParam = req.params.status
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!statusParam){
        res.status(400).json({
            error:"Invalid Status"
        })
    }
    const busDetails = await Bus.findById(busIdParam)
    const bookingDetails = await Booking.find({
        $and: [
            {busId: busIdParam},
            {status: statusParam}
        ]
    })
    if(!bookingDetails){
        res.status(400).json({
            error:"No Seat Found"
        })
    }
    res.status(200).json({
        message:`All booking details fetched having status in ${busDetails?.busName}`,
        data:bookingDetails
    })
})
bookingDetailsRoute.get('/customer/bookingDetails/:busId/:seatNumber',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const busIdParam = req.params.busId
    const seatNumberParam = req.params.seatNumber
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!seatNumberParam){
        res.status(400).json({
            error:"Invalid Seat Number"
        })
    }
    const busDetails = await Bus.findById(busIdParam)
    const bookingDetails = await Booking.find({
        $and: [
            {busId: busIdParam},
            {seatNumber: seatNumberParam}
        ]
    })
    if(!bookingDetails){
        res.status(400).json({
            error:"No Seat Found"
        })
    }
    res.status(200).json({
        message:`All booking details fetched having seatNumber ${seatNumberParam} in ${busDetails?.busName}`,
        data:bookingDetails
    })
})
bookingDetailsRoute.get('/customer/bookingDetails/:busId/:bookingDate',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const busIdParam = req.params.busId
    const bookingDateParam = req.params.bookingDate
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!bookingDateParam){
        res.status(400).json({
            error:"Invalid Booking Date"
        })
    }
    const busDetails = await Bus.findById(busIdParam)
    const bookingDetails = await Booking.find({
        $and: [
            {busId: busIdParam},
            {bookingDate: bookingDateParam}
        ]
    })
    if(!bookingDetails){
        res.status(400).json({
            error:"No Seat Found"
        })
    }
    res.status(200).json({
        message:`All booking details fetched booking on date ${bookingDateParam} in ${busDetails?.busName}`,
        data:bookingDetails
    })
})
bookingDetailsRoute.get('/customer/bookingDetails/:busId/:travelDate',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const busIdParam = req.params.busId
    const travelDateParam = req.params.travelDate
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!travelDateParam){
        res.status(400).json({
            error:"Invalid Travel Date"
        })
    }
    const busDetails = await Bus.findById(busIdParam)
    const bookingDetails = await Booking.find({
        $and: [
            {busId: busIdParam},
            {travelDate: travelDateParam}
        ]
    })
    if(!bookingDetails){
        res.status(400).json({
            error:"No Seat Found"
        })
    }
    res.status(200).json({
        message:`All booking details fetched for travel date on ${travelDateParam} in ${busDetails?.busName}`,
        data:bookingDetails
    })
})
bookingDetailsRoute.patch('/customer/:busId/:bookingId',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const busIdParam = req.params.busId
    const bookingIdParam = req.params.bookingId
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!bookingIdParam){
        res.status(400).json({
            error:"Invalid Booking Id"
        })
    }
    const updatedData = req.body
    const updatedBookingDetails = await Booking.findOneAndUpdate(
        {
            $and:[
                {_id:bookingIdParam},
                {busId:busIdParam}
            ]
        },
        updatedData,
        {new:true}
    )
    res.status(200).json({
        message:`Booking Details Updated Successfully having booking Id: ${bookingIdParam}`,
        data:updatedBookingDetails
    })

})
bookingDetailsRoute.delete('/customer/:busId/:bookingId',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const customer = req.customer
    const busIdParam = req.params.busId
    const bookingIdParam = req.params.bookingId
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!bookingIdParam){
        res.status(400).json({
            error:"Invalid Booking Id"
        })
    }
    const deletedBookingDetails = await Booking.findOneAndDelete(
        {
            $and:[
                {_id:bookingIdParam},
                {busId:busIdParam}
            ]
        }
    )
    res.status(200).json({
        message:`Booking Details Deleted Successfully having booking Id: ${bookingIdParam}`,
        data:deletedBookingDetails
    })
})
bookingDetailsRoute.get('/customer/bookingDetails',customerAuth,async(req:CustomerRequest,res:Response)=>{
    const query = req.query as unknown as Partial<IBooking>
    const filter: any = {};
    if (query.busNumber) filter.busNumber=query.busNumber
    if (query._id) filter._id = query._id
    if (query.busId) filter.busId = query._id
    if (query.customerId) filter.customerId = query.customerId
    if (query.origin) filter.origin = query.origin
    if (query.destination) filter.destination = query.destination
    if (query.travelDate) filter.travelDate = query.travelDate
    if (query.bookingDate) filter.bookingDate = query.bookingDate
    if (query.vendorID) filter.vendorID = query.vendorID
    if (query.seatNumber) filter.seatNumber = query.seatNumber
    if (query.status) filter.status = query.status

    const bookingDetails = await Booking.find(filter)
    res.status(200).json({
        message: `Booking Details as per filter`,
        data:bookingDetails
    })

    if(!bookingDetails){
        res.status(400).json({
            error:"No Seat Found"
        })
    }
})
