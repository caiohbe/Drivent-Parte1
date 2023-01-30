import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";

async function findTicketsType() {
    const tickets = await ticketsRepository.findTicketsType();

    if (!tickets) {
        throw notFoundError();
    }

    return tickets;
}

async function findTickets(userId: number) {
    const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);

    if(!enrollment) {
        throw notFoundError();
    }

    const tickets = await ticketsRepository.findTicketsByEnrollmentId(enrollment.id);

    if(tickets.length === 0) {
        throw notFoundError();
    }

    return tickets;
}
  
async function postTicket(ticketTypeId: number, userId: number) {
    const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);

    if (!enrollment) {
      throw notFoundError();
    }

    const tickets = await ticketsRepository.postTicket(ticketTypeId, enrollment.id);
    return tickets;
}

const ticketsService = {
    findTicketsType,
    findTickets,
    postTicket
};

export default ticketsService;
