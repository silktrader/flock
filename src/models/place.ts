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

export const isSapienzaPlace = (place: Place): place is SapienzaPlace => (place as SapienzaPlace).Avatar !== undefined
