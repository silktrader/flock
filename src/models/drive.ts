import { MinutesDiff } from 'src/tools/date-tools'
import { Drop, Transport } from 'stores/ride-store'
import { Pickup } from 'src/models/pickup'
import { User } from 'src/models/user'
import { Driver } from 'src/models/driver'
import { Place } from 'src/models/place'
import { CarSpec } from 'src/models/car'
import { Lecture } from 'src/models/lecture'

export interface Drive {
    Id: number,
    Origin: Place,
    Destination: Place,
    Arrival: Date,
    Departure: Date,
    CarS: CarSpec,
    Earning: number,
    FreeSeats: number,
    Recurring: boolean,
    before?: Lecture,
    after?: Lecture
    [key: string]: any; // Index signature to allow access by string keys
  }
