import { Transport } from 'stores/ride-store'

export interface Pickup {
  readonly Address: string
  readonly Date: Date
  readonly Transport: Transport
  readonly TransportId?: string
}
