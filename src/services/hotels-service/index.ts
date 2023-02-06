import hotelsRepository from "@/repositories/hotels-repository";
import { notFoundError, BadRequestError, requestError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotelVerification(userId: number) {
    const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId)
    if (!enrollment) {
      throw notFoundError()
    }
  
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)
    if (!ticket) {
      throw notFoundError()
    }
  
    if (ticket.status !== "PAID") {
      throw requestError(402, "payment required")
    }
  
    if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
      throw BadRequestError()
    }
  }

async function getRoomsByHotelId(hotelId: number, userId: number) {
    await getHotelVerification(userId)

    const rooms = await hotelsRepository.findRoomsByHotelId(hotelId)
    if (!rooms) {
        throw notFoundError();
    } 
    return rooms
}

async function getHotels(userId: number) {
    await getHotelVerification(userId)
    
    const hotels = await hotelsRepository.findHotels()
    if (!hotels) {
        throw notFoundError();
    }
    return hotels
}

const hotelsService = {
    getHotels,
    getRoomsByHotelId
} 

export default hotelsService