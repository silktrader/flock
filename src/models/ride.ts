import { MinutesDiff } from 'src/tools/date-tools'
import { Drop, Transport } from 'stores/ride-store'
import { Pickup } from 'src/models/pickup'
import { User } from 'src/models/user'
import { Driver } from 'src/models/driver'
import { Place } from 'src/models/place'
import { Car } from 'src/models/car'
import { Lecture } from 'src/models/lecture'

/* Interface extensions would be an ideal substitute to actual classes in this case
 but TS has no explicit support for them, requiring prototype pollution. */

export interface RideConfig {
  Id: string
  Origin: Place
  Destination: Place
  Arrival: Date
  Departure: Date
  Driver: Driver
  Car: Car
  Drop: Drop
  Pickup: Pickup
  Expense: number
  passengers: ReadonlyArray<User>
  rules: ReadonlyArray<string>
  Recurring: boolean
  before?: Lecture
  after?: Lecture
  comment?: string
}

export class Ride {
  readonly Id: string
  readonly Origin: Place
  readonly Destination: Place
  readonly Arrival: Date
  readonly Departure: Date
  readonly Driver: Driver
  readonly Car: Car
  readonly Drop: Drop
  readonly Pickup: Pickup
  readonly Expense: number
  readonly passengers: ReadonlyArray<User>
  readonly Recurring: boolean
  readonly before?: Lecture
  readonly after?: Lecture
  readonly comment?: string
  readonly rules: ReadonlyArray<string>

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
    this.passengers = config.passengers
    this.rules = config.rules
    this.Recurring = config.Recurring
    this.before = config.before
    this.after = config.after
    this.comment = config.comment
  }

  // Provides an estimate of the trip's duration, including pick-up, drop-off and carpooling times.
  get TotalDuration (): number {
    return MinutesDiff(this.Departure, this.Arrival)
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
    return this.DropDuration + (this.Pickup.Transport === Transport.None ? this.PickupDuration : 0)
  }

  get FreeSeats (): number {
    return this.Car.seats - this.passengers.length
  }
}

// Extended ride class which includes request data
export class RequestedRide extends Ride {
  readonly requested: Date

  constructor (config: RideConfig & { requested: Date }) {
    super(config)
    this.requested = config.requested
  }
}

export class AcceptedRide extends RequestedRide {
  readonly accepted: Date

  constructor (config: RideConfig & { requested: Date, accepted: Date }) {
    super(config)
    this.accepted = config.accepted
  }
}
