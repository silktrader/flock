import { Place } from 'src/models/place'
import { Driver } from 'src/models/driver'

export interface Lecture {
  readonly id: string;
  readonly date: Date
  readonly duration: number
  readonly courseId: string
  readonly location: Place
  readonly ridesAvailable?: number
  readonly drivers?: ReadonlyArray<Driver>
}
