import { User, UserConfig } from 'src/models/user'

export interface DriverConfig extends UserConfig {
  Rating: number
}

export class Driver extends User {
  readonly Rating: number

  constructor (config: DriverConfig) {
    super(config)
    this.Rating = config.Rating
  }
}
