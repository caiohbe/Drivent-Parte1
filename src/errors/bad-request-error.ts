import { ApplicationError } from "@/protocols";

export function BadRequestError(): ApplicationError {
    return {
        name: "BadRequest ",
        message: "Bad Request!",
    };
}