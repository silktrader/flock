import { Place } from 'src/models/place'

export interface Lecture {
  readonly Date: Date
  readonly Duration: number
  readonly Course: string
  readonly Location: Place
}
