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
  id: string
  origin: Place
  destination: Place
  arrival: Date
  departure: Date
  driver: Driver
  car: Car
  drop: Drop
  pickup: Pickup
  expense: number
  passengers: ReadonlyArray<User>
  rules: ReadonlyArray<string>
  recurring: boolean
  before?: Lecture
  after?: Lecture
  comment?: string
}

export class Ride implements RideConfig {
  readonly id: string
  readonly origin: Place
  readonly destination: Place
  readonly arrival: Date
  readonly departure: Date
  readonly driver: Driver
  readonly car: Car
  readonly drop: Drop
  readonly pickup: Pickup
  readonly expense: number
  readonly passengers: ReadonlyArray<User>
  readonly recurring: boolean
  readonly before?: Lecture
  readonly after?: Lecture
  readonly comment?: string
  readonly rules: ReadonlyArray<string>

  constructor (
    config: RideConfig
  ) {
    // checks ensure valid creation
    if (config.arrival <= config.departure) throw new Error('Ride departure follows arrival')

    if (config.pickup.Date <= config.departure) throw new Error('Ride departure follows pickup')

    const addresses = new Set([config.origin.Address, config.destination.Address, config.drop.Address, config.pickup.Address])
    if (addresses.size !== 4) throw new Error('One or more ride addresses match')

    if (config.expense < 0) throw new Error('Negative ride expense')

    this.id = config.id
    this.origin = config.origin
    this.destination = config.destination
    this.arrival = config.arrival
    this.departure = config.departure
    this.driver = config.driver
    this.car = config.car
    this.drop = config.drop
    this.pickup = config.pickup
    this.expense = config.expense
    this.passengers = config.passengers
    this.rules = config.rules
    this.recurring = config.recurring
    this.before = config.before
    this.after = config.after
    this.comment = config.comment
  }

  // Provides an estimate of the trip's duration, including pick-up, drop-off and carpooling times.
  get TotalDuration (): number {
    return MinutesDiff(this.departure, this.arrival)
  }

  get PickupDuration (): number {
    return MinutesDiff(this.pickup.Date, this.departure)
  }

  get CarpoolDuration (): number {
    return MinutesDiff(this.drop.Date, this.pickup.Date)
  }

  get DropDuration (): number {
    return MinutesDiff(this.arrival, this.drop.Date)
  }

  get WalkDuration (): number {
    return this.DropDuration + (this.pickup.Transport === Transport.None ? this.PickupDuration : 0)
  }

  get FreeSeats (): number {
    return this.car.seats - this.passengers.length
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
