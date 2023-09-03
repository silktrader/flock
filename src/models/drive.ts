import { MinutesDiff } from 'src/tools/date-tools'
import { Drop, Transport } from 'stores/ride-store'
import { Pickup } from 'src/models/pickup'
import { User } from 'src/models/user'
import { Driver } from 'src/models/driver'
import { Place } from 'src/models/place'
import { Car } from 'src/models/car'
import { Lecture } from 'src/models/lecture'

export interface Drive {
    Id: string,
    Origin: Place,
    Destination: Place,
    Arrival: Date,
    Departure: Date,
    Car: Car,
    Earning: number,
    FreeSeats: number,
    Recurring: boolean,
    before?: Lecture,
    after?: Lecture
    [key: string]: any; // Index signature to allow access by string keys
  }
