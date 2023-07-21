import { Location } from 'stores/location-store'
import { MinutesDiff } from 'src/tools/date-tools'
import { Car, Drop, Transport } from 'stores/ride-store'
import { Pickup } from 'src/models/pickup'
import { User } from 'src/models/user'
import { Driver } from 'src/models/driver'

/* Interface extensions would be an ideal substitute to actual classes in this case
 but TS has no explicit support for them, requiring prototype pollution. */

export interface RideConfig {
  Id: string,
  Origin: Location,
  Destination: Location,
  Arrival: Date,
  Departure: Date,
  Driver: Driver,
  Car: Car,
  Drop: Drop,
  Pickup: Pickup,
  Expense: number,
  Passengers: ReadonlyArray<User>,
  Recurring: boolean
}

export class Ride {
  readonly Id: string
  readonly Origin: Location
  readonly Destination: Location
  readonly Arrival: Date
  readonly Departure: Date
  readonly Driver: Driver
  readonly Car: Car
  readonly Drop: Drop
  readonly Pickup: Pickup
  readonly Expense: number
  readonly Passengers: ReadonlyArray<User>
  readonly Recurring: boolean
  Requested = false

  constructor (
    config: RideConfig
  ) {
    // checks ensure valid creation
    if (config.Arrival <= config.Departure) throw new Error('Ride departure follows arrival')

    if (config.Pickup.Date <= config.Departure) throw new Error('Ride departure follows pickup')

    const addresses = new Set([config.Origin.Address, config.Destination.Address, config.Drop.Address, config.Pickup.Address])
    if (addresses.size !== 4) throw new Error('One or more ride addresses match')

    if (config.Expense < 0) throw new Error('Negative ride expense')

    this.Id = config.Id
    this.Origin = config.Origin
    this.Destination = config.Destination
    this.Arrival = config.Arrival
    this.Departure = config.Departure
    this.Driver = config.Driver
    this.Car = config.Car
    this.Drop = config.Drop
    this.Pickup = config.Pickup
    this.Expense = config.Expense
    this.Passengers = config.Passengers
    this.Recurring = config.Recurring
  }

  get PickupDuration (): number {
    return MinutesDiff(this.Pickup.Date, this.Departure)
  }

  get CarpoolDuration (): number {
    return MinutesDiff(this.Drop.Date, this.Pickup.Date)
  }

  get DropDuration (): number {
    return MinutesDiff(this.Arrival, this.Drop.Date)
  }

  get WalkDuration (): number {
    return this.DropDuration + this.Pickup.Transport === Transport.None ? this.PickupDuration : 0
  }

  get FreeSeats (): number {
    return this.Car.Seats - this.Passengers.length
  }
}
