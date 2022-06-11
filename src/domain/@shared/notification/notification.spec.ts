import Notification from "./notification"

describe("Unit tests for notifications", () => {
  it("should create errors", () => {
    const notifications = new Notification()
    const error = {
      message: "error message",
      context: "customer",
    }
    notifications.addError(error)

    expect(notifications.messages("customer")).toBe("customer: error message,")

    const error2 = {
      message: "error message2",
      context: "customer",
    }
    notifications.addError(error2)

    expect(notifications.messages("customer")).toBe(
      "customer: error message,customer: error message2,"
    )
    const error3 = {
      message: "error message3",
      context: "order",
    }
    notifications.addError(error3)

    expect(notifications.messages("customer")).toBe(
      "customer: error message,customer: error message2,"
    )
    expect(notifications.messages()).toBe(
      "customer: error message,customer: error message2,order: error message3,"
    )
  })

  it("should check if notification has at least one error", () => {
    const notifications = new Notification()
    const error = {
      message: "error message",
      context: "customer",
    }
    notifications.addError(error)
    expect(notifications.hasErrors()).toBe(true)
  })

  it("should get all errors props", () => {
    const notifications = new Notification()
    const error = {
      message: "error message",
      context: "customer",
    }
    notifications.addError(error)
    expect(notifications.getErrors()).toEqual([error])
  })
})
