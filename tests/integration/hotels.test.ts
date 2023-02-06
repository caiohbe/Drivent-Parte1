import app, { init } from "@/app"
import faker from "@faker-js/faker"
import supertest from "supertest"
import httpStatus from "http-status"
import * as jwt from "jsonwebtoken"
import { TicketStatus } from "@prisma/client"
import { cleanDb, generateValidToken } from "../helpers"
import { createEnrollmentWithAddress, createHotels, createTicket, createTicketType, createUser } from "../factories"

beforeAll(async () => {
  await init()
})

afterEach(async () => {
  await cleanDb()
})

const server = supertest(app)

describe("GET /hotels", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels")

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word()
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser()
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET)
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    describe("when token is valid", () => {
        it("should respond with status 404 if query param enrollment is missing", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })

        it("should respond with status 404 if query param ticket is missing", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            await createEnrollmentWithAddress(user)
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        
            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })
    
        it("should reply with 402 status when given ticket unpaid", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType()
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
        })
    
        it("should reply with 400 status when remote selected", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)        
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
        
            expect(response.status).toEqual(httpStatus.BAD_REQUEST)
        })

        it("should respond with status 400 when hosting not selected", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false)
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
            
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
            expect(response.status).toEqual(httpStatus.BAD_REQUEST)
        })

        it("should respond with status 200 and hotel details", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(true, false)
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
            await createHotels()
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
            
            expect(response.status).toEqual(httpStatus.OK)
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                        image: expect.any(String),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    })
                ])
            )
        })

        it("should respond with status 200 and hotel empty details", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(true, false)
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
            
            expect(response.status).toEqual(httpStatus.OK)
            expect(response.body).toEqual( expect.arrayContaining([]) )
        })        
    })
})

describe("GET /hotels/:hotelId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels")
        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word()
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser()
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET)
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })

    describe("when token is valid", () => {
        it("should respond with status 404 if query param enrollment is missing", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)        
            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })

        it("should respond with status 404 if query param ticket is missing", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            await createEnrollmentWithAddress(user)        
            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`)
        
            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })
    
        it("should reply with 402 status when given ticket unpaid", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType()
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)  
            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`)
        
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
        })
    
        it("should reply with 400 status when remote selected", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)       
            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`)
        
            expect(response.status).toEqual(httpStatus.BAD_REQUEST)
        })

        it("should respond with status 400 when hosting not selected", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false)
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)            
            const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.BAD_REQUEST)
        })

        it("should respond with status 404 when hotel doesn't exits", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const response = await server.get("/hotels/0").set("Authorization", `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })

        it("should respond with status 200 and hotel details", async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(true, false)
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
            const hotelWithRooms = await createHotels()
            const response = await server.get("/hotels/" + hotelWithRooms.id).set("Authorization", `Bearer ${token}`)
            
            expect(response.status).toEqual(httpStatus.OK)
            expect(response.body).toEqual(
                {
                    id: hotelWithRooms.id,
                    name: hotelWithRooms.name,
                    image: hotelWithRooms.image,
                    createdAt: hotelWithRooms.createdAt.toISOString(),
                    updatedAt: hotelWithRooms.updatedAt.toISOString(),
                    Rooms: [
                        {
                        id: hotelWithRooms.Rooms[0].id,
                        name: hotelWithRooms.Rooms[0].name,
                        capacity: hotelWithRooms.Rooms[0].capacity,
                        hotelId: hotelWithRooms.Rooms[0].hotelId,
                        createdAt: hotelWithRooms.Rooms[0].createdAt.toISOString(),
                        updatedAt: hotelWithRooms.Rooms[0].updatedAt.toISOString(),
                        }
                    ]
                }
            )
        })
  })
})
