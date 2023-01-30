import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { postPaymentSchema } from "@/schemas";
import { getPayment, postPayments } from "@/controllers/payments-controller";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPayment)
  .post("/process", validateBody(postPaymentSchema), postPayments);

export { paymentsRouter };