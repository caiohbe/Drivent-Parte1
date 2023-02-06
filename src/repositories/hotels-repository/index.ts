import { prisma } from "@/config";

async function findRoomsByHotelId(hotelId: number) {
    return prisma.hotel.findFirst({
        where: {
            id: hotelId,
        },
        include: {
            Rooms: true,
        }
    })
}

async function findHotels() {
    return prisma.hotel.findMany()
}

const hotelsRepository = {
    findRoomsByHotelId,
    findHotels
}

export default hotelsRepository