import { prisma } from "@/config";

async function findTicketsType() {
    return prisma.ticketType.findMany();
};

async function findTypeById(id: number) {
    return prisma.ticketType.findFirst({
        where: {
            id
        }
    })
};

async function findTicketById(id: number) {
    return prisma.ticket.findFirst({
        where: {
            id
        }
    })
}

async function findTicketsByEnrollmentId(enrollmentId: number) {
    return prisma.ticket.findMany({
        where: {
            enrollmentId
        },
        include: {
            TicketType: true
        }
    })
}

async function postTicket(ticketTypeId: number, enrollmentId: number) {
    return prisma.ticket.create({
        data: {
            ticketTypeId,
            enrollmentId,
            status: "RESERVED"
        },
        include: {
            TicketType: true
        }
    })
}

async function updateTicket(id: number) {
    return prisma.ticket.update({
        where: {
            id
        },
        data: {
            status: "PAID"
        }
    })
}

const ticketsRepository = {
    findTicketsType,
    findTypeById,
    findTicketById,
    findTicketsByEnrollmentId,
    postTicket,
    updateTicket
};

export default ticketsRepository;