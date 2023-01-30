import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
    try {
        const tickets = await ticketsService.findTicketsType();
        return res.status(httpStatus.OK).send(tickets);
    } catch (error) {
        res.status(httpStatus.NOT_FOUND).send(error.message);
    }
}

export async function getTicketsById(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
  
    try {
      const tickets = await ticketsService.findTickets(userId);
      res.status(httpStatus.OK).send(tickets[0]);
    } catch (error) {
      if (error.name === "NotFoundError") {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      res.sendStatus(500);
    }
}
  
  export async function postTickets(req: AuthenticatedRequest, res: Response) {
    const ticketTypeId = req.body.ticketTypeId;
    const { userId } = req;
  
    try {
      if (!ticketTypeId) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
      }
      const result = await ticketsService.postTicket(ticketTypeId, userId);
  
      res.status(201).send(result);
    } catch (error) {
      if (error.name === "NotFoundError") {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      res.sendStatus(500);
    }
}