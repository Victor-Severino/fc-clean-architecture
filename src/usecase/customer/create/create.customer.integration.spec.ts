import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model"
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository"
import CreateCustomerUseCase from "./create.customer.usecase"

const input = {
  name: "User 1",
  address: {
    street: "Street 1",
    number: 123,
    zip: "Zip 1",
    city: "City 1",
  },
}

describe("Unit test create customer use case", () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    })
    await sequelize.addModels([CustomerModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("Should create a customer", async () => {
    const customerRepository = new CustomerRepository()
    const customerCreateUseCase = new CreateCustomerUseCase(customerRepository)
    const output = await customerCreateUseCase.execute(input)

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      address: {
        street: input.address.street,
        number: input.address.number,
        zip: input.address.zip,
        city: input.address.city,
      },
    })
  })

  it("should thrown an error when name is missing", async () => {
    const customerRepository = new CustomerRepository()
    const customerCreateUseCase = new CreateCustomerUseCase(customerRepository)

    input.name = ""

    await expect(customerCreateUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    )
  })

  it("should thrown an error when street is missing", async () => {
    const customerRepository = new CustomerRepository()
    const customerCreateUseCase = new CreateCustomerUseCase(customerRepository)

    input.address.street = ""

    await expect(customerCreateUseCase.execute(input)).rejects.toThrow(
      "Street is required"
    )
  })
})
