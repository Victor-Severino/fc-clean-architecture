import { Sequelize } from "sequelize-typescript"
import Product from "../../../domain/product/entity/product"
import ProductFactory from "../../../domain/product/factory/product.factory"
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model"
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository"
import UpdateProductUseCase from "./update.product.usecase"

const product = ProductFactory.create("a", "Product 1", 10)
const input = {
  id: product.id,
  name: "Product Updated",
  price: 20
}

describe("Unit test for product update use case", () => {

  let sequelize: Sequelize

  beforeEach(async ()=> {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    })
    await sequelize.addModels([ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })


  it("Should update a product", async () => {
    const productRepository = new ProductRepository()
    productRepository.create(new Product(product.id, product.name, product.price))

    const productUpdateUseCase = new UpdateProductUseCase(productRepository)

    const output = await productUpdateUseCase.execute(input)

    expect(output).toEqual(input)
  })
})
