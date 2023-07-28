import { Location } from 'src/models/location'

export interface Lecture {
  readonly Date: Date
  readonly Duration: number
  readonly Course: string
  readonly Location: Location
}
