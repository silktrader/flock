import { Location } from 'stores/location-store'
import { MinutesDiff } from 'src/tools/date-tools'
import { Car, Drop, Transport } from 'stores/ride-store'
import { Pickup } from 'src/models/pickup'
import { User } from 'src/models/user'
import { Driver } from 'src/models/driver'

/* Interface extensions would be an ideal substitute to actual classes in this case
 but TS has no explicit support for them, requiring prototype pollution. */

export class Ride {
  Requested = false

  constructor (
    readonly Id: string,
    readonly Origin: Location,
    readonly Destination: Location,
    readonly Arrival: Date,
    readonly Departure: Date,
    readonly Driver: Driver,
    readonly Car: Car,
    readonly Drop: Drop,
    readonly Pickup: Pickup,
    readonly Expense: number,
    readonly Passengers: ReadonlyArray<User>
  ) {
    // checks ensure valid creation
    if (Arrival <= Departure) throw new Error('Ride departure follows arrival')

    if (Pickup.Date <= Departure) throw new Error('Ride departure follows pickup')

    const addresses = new Set([Origin.Address, Destination.Address, Drop.Address, Pickup.Address])
    if (addresses.size !== 4) throw new Error('One or more ride addresses match')

    if (Expense < 0) throw new Error('Negative ride expense')
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
