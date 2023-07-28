import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { Location } from 'src/models/location'

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

  const getDefaultSapienzaLocation = (): Location => sapienzaLocations.value[0]

  const getDefaultHomeLocation = (): Location => (otherLocations.value[0])

  // const searchTimeLabel = computed<string>(() => ExtractTime(searchDate.value))
  // const searchDateLabel = computed<string>(() => FormatShortDate(searchDate.value))
  //
  // const searchDate = ref<Date>(new Date())
  // const searchMode = ref<DateMode>(DateMode.Arrive)

  // Checks if a location is among Sapienza's facilities
  const isSapLocation = (location: Location): boolean => sapienzaLocations.value.some(l => l.Address === location.Address)

  // function updateSearchDate (newDate: Date): void {
  //   searchDate.value = newDate
  // }
  //
  // function updateSearchMode (mode: DateMode): void {
  //   searchMode.value = mode
  // }

  return {
    sapienzaLocations: readonly(sapienzaLocations),
    otherLocations: readonly(otherLocations),
    // searchDate: readonly(searchDate),
    // searchMode: readonly(searchMode),
    // searchTimeLabel,
    // searchDateLabel,
    getDefaultSapienzaLocation,
    getDefaultHomeLocation,
    isSapLocation
    // updateSearchDate,
    // updateSearchMode
  }
})
