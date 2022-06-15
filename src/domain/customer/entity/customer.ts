import Entity from "../../@shared/entity/entity.abstract";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import NotificationError from "../../@shared/notification/notification.error";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import SendConsoleLogWhenCustomerAddressChangedHandler from "../event/handler/send-console-log-handler";
import SendConsoleLog1WhenCustomerIsCreatedHandler from "../event/handler/send-console-log1-handler";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "../event/handler/send-console-log2-handler";
import CustomerValidatorFactory from "../factory/customer.validator.factory";
import Address from "../value-object/address";

export default class Customer extends Entity {
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;
  private _eventDispatcher = new EventDispatcher();

  constructor(id: string, name: string) {
    super()
    this._id = id;
    this._name = name;
    this.validate();

    if(this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors())
    }

    const eventHandler1: SendConsoleLog1WhenCustomerIsCreatedHandler = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const eventHandler2: SendConsoleLog2WhenCustomerIsCreatedHandler = new SendConsoleLog2WhenCustomerIsCreatedHandler();
    this._eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    this._eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const customerAddressChanged = new SendConsoleLogWhenCustomerAddressChangedHandler()
    this._eventDispatcher.register("CustomerAddressChangedEvent", customerAddressChanged);
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  get eventDispatcher(): EventDispatcher {
    return this._eventDispatcher;
  }

  validate() {
    CustomerValidatorFactory.create().validate(this)
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;
    this.eventDispatcher.notify(new CustomerAddressChangedEvent(this));
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
