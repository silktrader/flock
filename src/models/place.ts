/**
 * Defines location data structures, to be expanded with GPS location.
 */
export interface Place {
  Label: string
  Address: string,

}

export interface SapienzaPlace extends Place {
  Avatar: string
}
