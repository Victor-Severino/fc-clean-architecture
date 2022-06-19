import { app, sequelize } from "../express"
import request from "supertest"

describe("E2E test for customer", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it("should create a customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "User 1",
        address: {
          street: "Street 1",
          city: "City 1",
          number: 123,
          zip: "Zip 1",
        },
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe("User 1")
    expect(response.body.address.street).toBe("Street 1")
    expect(response.body.address.city).toBe("City 1")
    expect(response.body.address.number).toBe(123)
    expect(response.body.address.zip).toBe("Zip 1")
  })

  it("should not create a customer", async () => {
    const response = await request(app).post("/customer").send({
      name: "User 1",
    })

    expect(response.status).toBe(500)
  })

  it("should list all customers", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "User 1",
        address: {
          street: "Street 1",
          city: "City 1",
          number: 123,
          zip: "Zip 1",
        },
      })
    expect(response.status).toBe(200)

    const response2 = await request(app)
      .post("/customer")
      .send({
        name: "User 2",
        address: {
          street: "Street 2",
          city: "City 2",
          number: 1234,
          zip: "Zip 2",
        },
      })
    expect(response2.status).toBe(200)

    const listResponse = await request(app).get("/customer").send()

    expect(listResponse.status).toBe(200)
    expect(listResponse.body.customers.length).toBe(2)
    const customer = listResponse.body.customers[0]
    expect(customer.name).toBe("User 1")
    expect(customer.address.street).toBe("Street 1")
    const customer2 = listResponse.body.customers[1]
    expect(customer2.name).toBe("User 2")
    expect(customer2.address.street).toBe("Street 2")

    const listResponseXML = await request(app)
      .get("/customer")
      .set("Accept", "application/xml")
      .send()

    expect(listResponseXML.status).toBe(200)
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`)
    expect(listResponseXML.text).toContain(`<customers>`)
    expect(listResponseXML.text).toContain(`<customer>`)
    expect(listResponseXML.text).toContain(`<name>User 1</name>`)
    expect(listResponseXML.text).toContain(`<address>`)
    expect(listResponseXML.text).toContain(`<street>Street 1</street>`)
    expect(listResponseXML.text).toContain(`<city>City 1</city>`)
    expect(listResponseXML.text).toContain(`<number>123</number>`)
    expect(listResponseXML.text).toContain(`<zip>Zip 1</zip>`)
    expect(listResponseXML.text).toContain(`</address>`)

    expect(listResponseXML.text).toContain(`<customers>`)
    expect(listResponseXML.text).toContain(`<customer>`)
    expect(listResponseXML.text).toContain(`<name>User 2</name>`)
    expect(listResponseXML.text).toContain(`<address>`)
    expect(listResponseXML.text).toContain(`<street>Street 2</street>`)
    expect(listResponseXML.text).toContain(`<city>City 2</city>`)
    expect(listResponseXML.text).toContain(`<number>1234</number>`)
    expect(listResponseXML.text).toContain(`<zip>Zip 2</zip>`)
    expect(listResponseXML.text).toContain(`</address>`)
  })
})
