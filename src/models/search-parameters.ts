import { Place } from 'src/models/place'
import { DateMode } from 'src/tools/date-tools'

export interface SearchParameters {
  Origin: Place;
  Destination: Place;
  Date: Date;
  DateMode: DateMode;
  reachTime: number;
  busAllowed: boolean;
  subwayAllowed: boolean;
  ladiesOnly: boolean;
  freeSeats: number;
  results?: number
}
