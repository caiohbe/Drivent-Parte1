import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketsById, getTicketsType, postTickets } from "@/controllers";

const ticketsRouter = Router()

ticketsRouter
    .all("/*", authenticateToken)
    .get("/", getTicketsById)
    .get("/types", getTicketsType)
    .post("/", postTickets);

export { ticketsRouter };
