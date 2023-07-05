import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

/**
 * Defines location data structures, to be expanded with GPS location.
 */
export interface Location {
  Label: string
  Address: string,
}

export const useLocationStore = defineStore('location', () => {
  const sapienzaLocations = ref<Location[]>([{
    Label: 'Città Universitaria',
    Address: 'Piazzale Aldo Moro, 1'
  }, {
    Label: 'Facoltà d\'Economia',
    Address: 'Via del Castro Laurenziano, 9'
  }, {
    Label: 'Facoltà d\'Ingegneria',
    Address: 'Via Eudossiana, 18'
  }, {
    Label: 'Facoltà d\'Architettura',
    Address: 'Piazza Borghese, 9'
  }, {
    Label: 'Centro Sportivo Universitario',
    Address: 'Via Fornaci di Tor di Quinto, 34'
  }])

  const otherLocations = ref<Location[]>([{
    Label: 'Home',
    Address: 'Via Archimede, 110'
  }, {
    Label: 'Home',
    Address: 'Viale Africa, 25'
  }, {
    Label: 'Home',
    Address: 'Viale degli Estensi, 3'
  }])

  const GetDefaultSapienzaLocation = (): Location => sapienzaLocations.value[0]

  const GetDefaultHomeLocation = (): Location => (otherLocations.value[0])

  return {
    sapienzaLocations: readonly(sapienzaLocations),
    otherLocations: readonly(otherLocations),
    GetDefaultSapienzaLocation,
    GetDefaultHomeLocation
  }
})
