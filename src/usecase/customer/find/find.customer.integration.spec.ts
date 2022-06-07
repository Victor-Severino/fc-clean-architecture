import { Sequelize } from "sequelize-typescript"
import Customer from "../../../domain/customer/entity/customer"
import Address from "../../../domain/customer/value-object/address"
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model"
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository"
import FindCustomerUseCase from "./find.customer.usecase"

describe("Test find customer use case", () => {
  let sequelize: Sequelize

  beforeEach(async ()=> {
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

  it("should find a customer", async () => {
    const customerRepository = new CustomerRepository()
    const usecase = new FindCustomerUseCase(customerRepository)
    const customer = new Customer("123", "Customer 1")
    const address = new Address("Street 1", 123, "Zip 1", "City 1")
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const input = {
      id: "123",
    }

    const output = {
      id: "123",
      name: "Customer 1",
      address: {
        street: "Street 1",
        number: 123,
        zip: "Zip 1",
        city: "City 1",
      }
    }

    const result = await usecase.execute(input)

    expect(result).toEqual(output)
  })
})
