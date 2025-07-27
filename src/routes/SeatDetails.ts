import express from 'express'
import { Response, Request } from 'express'
const seatDetailsRoute = express.Router()
import { vendorAuth } from './vendorAuth'
import { VendorDocument } from '../model/Vendor'
import { Seat } from '../model/Seat'
import { Bus } from '../model/Bus'
import { runInNewContext } from 'vm'

type VendorRequest = Request & { vendor?: VendorDocument }


seatDetailsRoute.post('/vendor/AddOneSeat/:busId',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busIdParam = req.params.busId
    const busDetails = await Bus.findById(busIdParam)

    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!vendor){
        res.status(400).json({
            error:"Invalid Vendor"
        })
    }
    const seatDetails = new Seat({
        busId: busIdParam,
        seatNumber: req.body.seatNumber,
        seatType: req.body.seatType,
        isAvailable: req.body.isAvailable,
        row: req.body.row,
        column: req.body.column,
        fareModifier: req.body.fareModifier,
        fareModifierFlag: req.body.fareModifierFlag
    })
    await seatDetails.save()
    res.status(201).json({
        message:`${vendor?.vendorName} has added ${req.body.seatNumber} in ${busDetails?.busName} having ${busDetails?.busNumber}`
    })
})
seatDetailsRoute.post('/vendor/addManySeat/:busId',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busIdParam = req.params.busId
    const busDetails = await Bus.findById(busIdParam)
    const seatBodyData = req.body.data
    const seatAddedCount = seatBodyData.length
    const seatNumbers = []
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!vendor){
        res.status(400).json({
            error:"Invalid Vendor"
        })
    }
    for (let i=0;i<=seatAddedCount;i++){
        const bookingDetails = new Seat({
            busId: busIdParam,
            seatNumber: seatBodyData[i].seatNumber,
            seatType: seatBodyData[i].seatType,
            isAvailable: seatBodyData[i].isAvailable,
            row: seatBodyData[i].row,
            column: seatBodyData[i].column,
            fareModifier: seatBodyData[i].fareModifier,
            fareModifierFlag: seatBodyData[i].fareModifierFlag
        })
        seatNumbers.push(seatBodyData[i].seatNumber)
        await bookingDetails.save()
    }

    res.status(201).json({
        message:`${vendor?.vendorName} has added ${seatNumbers.toString()} in ${busDetails?.busName} having ${busDetails?.busNumber}`
    })
})
seatDetailsRoute.get('/vendor/allAddedSeatDetails/:busId',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busIdParam = req.params.busId
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    const busDetails = await Bus.findById(busIdParam)
    const allSeatDetails = await Seat.findById(busIdParam)
    if(!allSeatDetails){
        res.status(400).json({
            error:"No Seat Found"
        })
    }
    res.status(200).json({
        message:`Fetched all seats in bus ${busDetails?.busName}`,
        data:allSeatDetails
    })
})
seatDetailsRoute.get('/vendor/seatDetails/:busId/:seatId',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busIdParam = req.params.busId
    const seatIdParam = req.params.seatId
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!seatIdParam){
        res.status(400).json({
            error:"Invalid Seat Id"
        })
    }
    const busDetails = await Bus.findById(busIdParam)
    const seatDetails = await Seat.find({
        $and: [
            {_id: seatIdParam},
            {busId: busIdParam}
        ]
    })
    if(!seatDetails){
        res.status(400).json({
            error:"No Seat Found"
        })
    }
    res.status(200).json({
        message:`Fetched seat details of a seat in bus ${busDetails?.busName}`,
        data:seatDetails
    })
})
seatDetailsRoute.get('/vendor/seatDetails/:busId/:seatType',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busIdParam = req.params.busId
    const seatTypeParam = req.params.seatType
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!seatTypeParam){
        res.status(400).json({
            error:"Invalid Seat Id"
        })
    }
    const busDetails = await Bus.findById(busIdParam)
    const seatDetails = await Seat.find({
        $and: [
            {busId: busIdParam},
            {seatType: seatTypeParam}
        ]
    })
    if(!seatDetails){
        res.status(400).json({
            error:"No Seat Found"
        })
    }
    res.status(200).json({
        message:`Fetched seat details in bus ${busDetails?.busName} having seat type ${seatTypeParam}`,
        data:seatDetails
    })
})
seatDetailsRoute.get('/vendor/busDetails/:busId/:fareModifierFlag',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busIdParam = req.params.busId
    const seatFareModifierFlag = req.params.fareModifierFlag
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }
    if(!seatFareModifierFlag){
        res.status(400).json({
            error:"Invalid Seat Id"
        })
    }
    const busDetails = await Bus.findById(busIdParam)
    const seatDetails = await Seat.find({
        $and: [
            {busId: busIdParam},
            {fareModifier: seatFareModifierFlag}
        ]
    })
    if(!seatDetails){
        res.status(400).json({
            error:"No Seat Found"
        })
    }
    res.status(200).json({
        message:`Fetched seat details in bus ${busDetails?.busName} having fare modifier`,
        data:seatDetails
    })
})
seatDetailsRoute.patch('/vendor/seatDetails/:busId/:seatId',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busIdParam = req.params.busId
    const seatIdParam = req.params.seatId
    const seatDetails = req.body
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }

    const updatedSeatDeatils = await Seat.findOneAndUpdate(
        {
            $and:[
                {_id:seatIdParam},
                {busId:busIdParam}
            ]
        },
        seatDetails,
        {new:true}
    )
    if(!updatedSeatDeatils){
        res.status(400).json({
            error:"No Seat Updated"
        })
    }
    res.status(200).json({
        message:`Seat Details updated for seat ${updatedSeatDeatils?.seatNumber}`,
        data:updatedSeatDeatils
    })
})
seatDetailsRoute.delete('/vendor/seatDetails/:busId/:seatId',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busIdParam = req.params.busId
    const seatIdParam = req.params.seatId
    if(!busIdParam){
        res.status(400).json({
            error:"Invalid Bus Id"
        })
    }

    const deletedSeat = await Seat.findOneAndDelete(
        {
            $and:[
                {_id:seatIdParam},
                {busId:busIdParam}
            ]
        }
    )
    if(!deletedSeat){
        res.status(400).json({
            error:"No Seat Deleted"
        })
    }
    res.status(200).json({
        message:`Seat Details deleted having seat ${deletedSeat?.seatNumber}`,
        data:deletedSeat
    })
})