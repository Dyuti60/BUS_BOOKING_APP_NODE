import express from 'express'
import { Response, Request } from 'express'
const {vendorAuth} = require('../middleware/userAuth')
import {validateAddBusDetails} from '../utils/validator'
import { VendorDocument } from '../model/Vendor'
import { Bus } from '../model/Bus'
export const busDetailsRoute = express.Router()

type VendorRequest = Request & { vendor?: VendorDocument }
busDetailsRoute.post('/vendor/addBus',vendorAuth,async(req:VendorRequest,res:Response)=>{
    validateAddBusDetails()
    const vendor = req.vendor
    if(!vendor){
        res.status(400).json({error:"Invalid Vendor"})
    }else{
        const busDetail = new Bus({
            busName:req.body.busName,
            busNumber:req.body.busNumber,
            vendorId:vendor._id,
            busSeatRows:req.body.busSeatRows,
            busSeatColumns:req.body.busSeatColumns,
            totalSeats:req.body.totalSeats,
            additionalSeats:req.body.additionalSeats,
            origin:req.body.origin,
            midOrigin:req.body.midOrigin,
            destination:req.body.destination,
            departure:req.body.departure,
            arrival:req.body.arrival,
            price:req.body.price,
            midPrice:req.body.midPrice,
            stops:req.body.stops,
            amenities:req.body.amenities,
            description:req.body.description,
            status:req.body.status,
    })
    await busDetail.save()
    res.status(201).json({
        message:`${req.body.busName} details added under vendor ${vendor.vendorName}`
    })
    }

})
busDetailsRoute.patch('/vendor/editBus/:busID',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busId = req.params.busID
    const busDetails = await Bus.findOne({
        _id:busId
    })
    const updatedData = req.body
    if(!vendor){
        res.status(400).json({
            error:"Vendor not found"
        })
        return
    }
    if(!busDetails){
        res.status(400).json({
            error:"Bus not found"
        })
        return
    }
    const updatedBusDetails=await Bus.findByIdAndUpdate(busId,updatedData,
        {new:true}
    )
    res.status(200).json({
        message:`Bus ${updatedBusDetails?.busName} details updated successfully`,
        data: updatedBusDetails
    })

})
busDetailsRoute.get('/vendor/busDetails/:busID',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const {busID} = req.params
    if(!vendor){
        res.status(400).json({
            error:`Vendor not found`
        })
        return
    }
    const busesUnderVendor = await Bus.find({
        $and:[
            {vendorId:vendor?._id},
            {_id:busID}
        ]
        
        
    })
    res.status(200).json({
        message:"Bus by bus id under vendor fetched successfully",
        data:busesUnderVendor
    })
})
busDetailsRoute.get('/busDetails/:busID',async(req:VendorRequest,res:Response)=>{
    const busId = req.params.busID
    const busesUnderVendor = await Bus.find({
        _id:busId
    })
    res.status(200).json({
        message:"Bus by bus id under vendor fetched successfully",
        data:busesUnderVendor
    })
})
busDetailsRoute.get('/getAllBuses',async(req:VendorRequest,res:Response)=>{
    const getAllBuses = await Bus.find({})
    if(!getAllBuses){
        res.status(400).json({
            error:"No bus found"
        })
        return
    }
    res.status(200).json({
        message:"All Bus Details Fetched Successfully",
        data:getAllBuses
    })
})
busDetailsRoute.get('/vendor/getAllBusBetween/:origin/:destination',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    if(!vendor){
        res.status(400).json({
            error:`Vendor not found`
        })
        return
    }
    const busOrigin = req.params.origin
    const busDestination = req.params.destination

    const getAllBuses = await Bus.find({
        $or:[
            {$and:[
                {origin:busOrigin},
                {destination:busDestination}
            ]},
            {$and:[
                {midOrigin:busOrigin},
                {destination:busDestination}
            ]},
            {$and:[
                {origin:busOrigin},
                {midOrigin:busDestination}
            ]}, 
        ]
    })
    if(!getAllBuses){
            res.status(400).json({
            error:`Bus not found`
        })
        return
    }
    res.status(200).json({
        message:`Get All Buses Running InBetween ${busOrigin} and ${busDestination}`,
        data:getAllBuses
    })
})
busDetailsRoute.get('/getAllBusBetween/:origin/:destination',async(req:VendorRequest,res:Response)=>{
    const busOrigin = req.params.origin
    const busDestination = req.params.destination
    const getAllBuses = await Bus.find({
        $or:[
            {$and:[
                {origin:busOrigin},
                {destination:busDestination}
            ]},
            {$and:[
                {midOrigin:busOrigin},
                {destination:busDestination}
            ]},
            {$and:[
                {origin:busOrigin},
                {midOrigin:busDestination}
            ]}, 
        ]
    })
    if(!getAllBuses){
            res.status(400).json({
            error:`Bus not found`
        })
        return
    }
    res.status(200).json({
        message:`Get All Buses Running InBetween ${busOrigin} and ${busDestination}`,
        data:getAllBuses
    })
})
busDetailsRoute.get('/vendor/getAllBusByDepartureTime',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const {minDepartureTime, maxDepartureTime}=req.query
    const getBusDetails = await Bus.find({
        $or:[
            {
                $and:[
                {vendorId:vendor?._id},
                {departure: {$gte:`${minDepartureTime}`}}
                ]
            },
            {
                $and:[
                    {vendorId:vendor?._id},
                    {departure: {$gte:`${minDepartureTime}`, $lte:`${maxDepartureTime}`}}
                ]
            },
            {
                $and:[
                    {vendorId:vendor?._id},
                    {departure: {$lte:`${maxDepartureTime}`}}
                ]
            },
            {vendorId:vendor?._id}
        ]

    })
    if(!vendor){
        res.status(400).json({
            error:"Vendor not found"
        })
        return
    }
    if(!getBusDetails){
        res.status(400).json({
            error:"No Bus Details Found"
        })
        return
    }
    res.status(200).json({
        message:`All Bus Details Departure between ${minDepartureTime} and ${maxDepartureTime} under vendor ${vendor?.vendorName} fetched successfully`,
        data:getBusDetails
    })

})
busDetailsRoute.get('/getAllBusByDepartureTime',async(req:VendorRequest,res:Response)=>{
    const {minDepartureTime, maxDepartureTime}=req.query
    const getBusDetails = await Bus.find({
        $or:[
                {departure: {$gte:`${minDepartureTime}`}},
                {departure: {$gte:`${minDepartureTime}`, $lte:`${maxDepartureTime}`}},
                {departure: {$lte:`${maxDepartureTime}`}},
                {}
            ]
    })
    if(!getBusDetails){
        res.status(400).json({
            error:"No Bus Details Found"
        })
        return
    }
    res.status(200).json({
        message:`All Bus Details Departure between ${minDepartureTime} and ${maxDepartureTime} fetched successfully`,
        data:getBusDetails
    })
})
busDetailsRoute.get('/vendor/getAllBusByArrivalTime',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const {minArrivalTime, maxArrivalTime}=req.query
    const getBusDetails = await Bus.find({
        $or:[
            {
                $and:[
                {vendorId:vendor?._id},
                {departure: {$gte:`${minArrivalTime}`}}
                ]
            },
            {
                $and:[
                    {vendorId:vendor?._id},
                    {departure: {$gte:`${minArrivalTime}`, $lte:`${maxArrivalTime}`}}
                ]
            },
            {
                $and:[
                    {vendorId:vendor?._id},
                    {departure: {$lte:`${minArrivalTime}`}}
                ]
            },
            {vendorId:vendor?._id}
        ]

    })
    if(!vendor){
        res.status(400).json({
            error:"Vendor not found"
        })
        return
    }
    if(!getBusDetails){
        res.status(400).json({
            error:"No Bus Details Found"
        })
        return
    }
    res.status(200).json({
        message:`All Bus Details Arrival between ${minArrivalTime} and ${maxArrivalTime} under vendor ${vendor?.vendorName} fetched successfully`,
        data:getBusDetails
    })

})
busDetailsRoute.get('/getAllBusByArrivalTime',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const {minArrivalTime, maxArrivalTime}=req.query
    const getBusDetails = await Bus.find({
        $or:[
                {departure: {$gte:`${minArrivalTime}`}},
                {departure: {$gte:`${minArrivalTime}`, $lte:`${maxArrivalTime}`}},
                {departure: {$lte:`${maxArrivalTime}`}},
                {}
            ]
    })
    if(!getBusDetails){
        res.status(400).json({
            error:"No Bus Details Found"
        })
        return
    }
    res.status(200).json({
        message:`All Bus Details Departure between ${minArrivalTime} and ${maxArrivalTime} fetched successfully`,
        data:getBusDetails
    })
})
busDetailsRoute.get('/vendor/getAllBus/:status',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const statusValue = req.params.status
    if(!vendor){
        res.status(400).json({
            error:"Vendor not found"
        })
        return
    }
    const getBusDetails = await Bus.find({
        $and:[
            {status:statusValue},
            {vendorId:vendor?._id}
        ]
    })
    if(!getBusDetails){
        res.status(400).json({
            error:`No Bus Details Found`
        })
        return
    }
    res.status(200).json({
        message:"Bus Details Fetched Successfully",
        data:getBusDetails
    })
})

busDetailsRoute.get('/getAllBus/:status',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const statusValue = req.params.status
    const getBusDetails = await Bus.find({
            status:statusValue
    })
    if(!getBusDetails){
        res.status(400).json({
            error:`No Bus Details Found`
        })
        return
    }
    res.status(200).json({
        message:"Bus Details Fetched Successfully",
        data:getBusDetails
    })

})
busDetailsRoute.get('/vendor/getAllBusDetails',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busesUnderVendor = await Bus.find({
        vendorId:vendor?._id
    })
    if(!vendor){
        res.status(400).json({
            error:"Vendor not found"
        })
        return
    }
    if(!busesUnderVendor){
        res.status(400).json({
            error:`No Bus found under vendor ${vendor?.vendorName}`
        })
        return
    }
    res.status(200).json({
        message:`Bus Details Under Vendor ${vendor?.vendorName} fetched successfully`,
        data: busesUnderVendor
    })

})
busDetailsRoute.delete('/vendor/deleteBus/:busID',vendorAuth,async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busIdValue = req.params.busID
   if(!vendor){
        res.status(400).json({
            error:"Vendor not found"
        })
        return
    }
    const busDetailsDeleted = await Bus.findOneAndDelete({
        $and:[
            {vendorId:vendor?._id},
            {_id:busIdValue}
        ]
    })
    if(!busDetailsDeleted){
        res.status(400).json({
            error:`No Bus found under vendor ${vendor?.vendorName}`
        })
        return
    }
    res.status(200).json({
        message:`${busDetailsDeleted.busName} got deleted under vendor ${vendor.vendorName}`,
        data:busDetailsDeleted
    })

})
busDetailsRoute.patch('/vendor/updateStatus/:busId',async(req:VendorRequest,res:Response)=>{
    const vendor = req.vendor
    const busIdValue = req.params.busID
    const {status} = req.body
    if(!vendor){
        res.status(400).json({
            error:"Vendor not found"
        })
        return
    }
    const updatedBusDetails = await Bus.findByIdAndUpdate(
        busIdValue,
        status,
        {new:true}
    )
    if(!updatedBusDetails){
        res.status(400).json({
            error:`No Bus found under vendor ${vendor?.vendorName}`
        })
        return
    }
    res.status(200).json({
        message:`${updatedBusDetails.busName} status got updated under vendor ${vendor.vendorName}`,
        data:updatedBusDetails
    })

})
busDetailsRoute.get('/getAllLocations',async(req:VendorRequest,res:Response)=>{
    const busDetails = await Bus.find({})
    const busDetailsCount = busDetails.length
    console.log(busDetails)
    const originLocation = []
    const destinationLocation = []
    for(let i=0;i<busDetailsCount;i++){
        originLocation.push(busDetails[i]?.origin)
        originLocation.push(busDetails[i]?.midOrigin)
        
        destinationLocation.push(busDetails[i]?.midOrigin)
        destinationLocation.push(busDetails[i]?.destination)
    }
    res.status(200).json({
        message:"Locations fetched successfully",
        data:{
            from: originLocation,
            to: destinationLocation
        }
    })
})
