import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import hotelsService from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req

    try {
        const hotels = await hotelsService.getHotels(userId)
        return res.send(hotels) 
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND)

        } else if (error.name === "RequestError") {            
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED)
          
        }
        return res.sendStatus(httpStatus.BAD_REQUEST)
    }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    const hotelId = +req.params.hotelId
    
    try {
        const rooms = await hotelsService.getRoomsByHotelId(hotelId, userId)
        return res.send(rooms) 
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND)

        } else if (error.name === "RequestError") {
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED)

        }
        return res.sendStatus(httpStatus.BAD_REQUEST)
    }
}