import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { FavouritePlace, Place, SapienzaPlace } from 'src/models/place'
import { fakerIT as faker } from '@faker-js/faker'

export const useLocationStore = defineStore('location-store', () => {
  const sapienzaPlaces = ref<SapienzaPlace[]>([{
    Label: 'Città Universitaria',
    Address: 'Piazzale Aldo Moro, 1',
    Avatar: 'https://metronews.it/wp-content/uploads/2021/05/universita_sapienza.jpg'
  }, {
    Label: 'Facoltà d\'Economia',
    Address: 'Via del Castro Laurenziano, 9',
    Avatar: 'https://web.uniroma1.it/cersites/sites/default/files/facolta_economia_latina.jpg'
  }, {
    Label: 'Facoltà d\'Ingegneria',
    Address: 'Via Eudossiana, 18',
    Avatar: 'https://www.ilgiornaledeltermoidraulico.it/files/2016/07/IT_PR_160523_Conferenza-acqua-sanitaria-Roma_01.jpg'
  }, {
    Label: 'Facoltà d\'Architettura',
    Address: 'Piazza Borghese, 9',
    Avatar: 'https://www.radiocolonna.it/public/images/2020/10/D940D26C-8E6B-49AF-B50C-C1B65A2E83D5-1280x720.jpeg'
  }, {
    Label: 'Centro Universitario Sportivo',
    Address: 'Via Fornaci di Tor di Quinto, 34',
    Avatar: 'https://web.uniroma1.it/sapienzasport/sites/default/files/styles/photonew/public/IMG_20200601_161308.jpg?itok=RdXs2U6g'
  }])

  const favouritePlaces = ref<FavouritePlace[]>([{
    Label: 'Home',
    Address: 'Via Archimede, 110',
    Icon: 'las la-home'
  }, {
    Label: 'Dad\'s Flat',
    Address: 'Viale Africa, 25',
    Icon: 'las la-building'
  }, {
    Label: 'Stazione Termini',
    Address: 'Via Giovanni Giolitti, 40',
    Icon: 'las la-train'
  }])

  const getDefaultSapienzaLocation = (): Place => sapienzaPlaces.value[0]

  const getDefaultHomeLocation = (): Place => (favouritePlaces.value[0])

  const prevSearches = new Map<string, string[]>()

  // contains all previously generated addresses for quick lookups; might grow large
  const prevAddresses = new Set<string>()

  // contains all previously selected places to populate a history list
  const recentAddresses: Array<string> = []

  // Checks if a location is among Sapienza's facilities
  const isSapLocation = (location: Place): boolean => sapienzaPlaces.value.some(l => l.Address === location.Address)

  // Generate unique address names, including prefixes, and memoize results for consistency
  function genAddresses (stem: string): ReadonlyArray<string> {
    // check if addresses were already generated
    let addresses = prevSearches.get(stem)
    if (addresses !== undefined) {
      return addresses
    }

    const places: Set<string> = new Set()
    const maxPlaces = 5

    // browse previous random results to improve consistency
    for (const address of prevAddresses) {
      if (address.includes(stem)) {
        places.add(address)
        if (places.size >= maxPlaces) break
      }
    }

    // generate random addresses that include the search string
    if (places.size < maxPlaces) {
      let attempts = 10000
      while (attempts > 0) {
        const newName = faker.location.street()
        attempts -= 1
        if (newName.includes(stem)) {
          places.add(newName)
          prevAddresses.add(newName)
          if (places.size >= maxPlaces) break
        }
      }
    }

    // memoize results
    addresses = Array.from(places)
    prevSearches.set(stem, addresses)

    return addresses
  }

  // Add places to a stack like array, to fetch recently searched places
  function addRecentAddress (address: string): void {
    // check if the place is among favourites
    if (favouritePlaces.value.map(p => p.Address).includes(address)) {
      return
    }

    // check if the recent place already exists to avoid duplicates
    const existingItemIndex = recentAddresses.indexOf(address)
    if (existingItemIndex >= 0) {
      const firstItem = recentAddresses[0]
      recentAddresses[0] = address
      recentAddresses[existingItemIndex] = firstItem
      return
    }

    recentAddresses.unshift(address)
    if (recentAddresses.length > 4) {
      recentAddresses.pop()
    }
  }

  return {
    sapienzaPlaces: readonly(sapienzaPlaces),
    favouritePlaces: readonly(favouritePlaces),
    recentAddresses: readonly(recentAddresses),
    getDefaultSapienzaLocation,
    getDefaultHomeLocation,
    isSapLocation,
    genAddresses,
    addRecentAddress
  }
})
