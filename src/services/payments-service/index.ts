import { notFoundError, unauthorizedError } from "@/errors";
import { CreatePaymentParams } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentRepository from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/ticket-repository";

async function getByTicketId(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.findTicketById(ticketId);

  if (!ticket) {
    throw notFoundError();
  }

  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (ticket.enrollmentId !== enrollment.id) {
    throw unauthorizedError();
  }  

  return await paymentRepository.findPaymentByTicketId(ticketId);
}

async function createPayment(body: CreatePaymentParams, userId: number) {
  const ticket = await ticketsRepository.findTicketById(body.ticketId);

  if (!ticket) {
    throw notFoundError();
  }  
  
  const ticketType = await ticketsRepository.findTypeById(ticket.ticketTypeId);
  
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);

  if (ticket.enrollmentId !== enrollment.id) {
    throw unauthorizedError();
  }  
  
  await ticketsRepository.updateTicket(body.ticketId);
  return await paymentRepository.createPayment(body, ticketType.price);
}

const paymentService = {
  getByTicketId,
  createPayment
};

export default paymentService;