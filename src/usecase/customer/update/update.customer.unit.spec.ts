import CustomerFactory from "../../../domain/customer/factory/customer.factory"
import Address from "../../../domain/customer/value-object/address"
import UpdateCustomerUseCase from "./update.customer.usecase"

const customer = CustomerFactory.createWithAddress(
  "User 1",
  new Address("Street 1", 123, "Zip", "City 1")
)

const input = {
  id: customer.id,
  name: "User Updated",
  address: {
    street: "Street Updated",
    number: 456,
    zip: "Zip Updated",
    city: "City Updated",
  },
}

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    update: jest.fn(),
  }
}

describe("Unit test for customer update use case", () => {

  it("Should update a customer", async () => {
    const customerRepository = MockRepository()
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository)

    const output = await customerUpdateUseCase.execute(input)

    expect(output).toEqual(input)
  })
})
