import { SapienzaPlace } from 'src/models/place'

export interface Course {
  id: string,
  name: string,
  acro: string,
  location: SapienzaPlace,
  days: ReadonlyArray<string>,
  start: ReadonlyArray<number>,
  color: string
}
