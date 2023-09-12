import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { FavouritePlace, Place, sapienzaPlaces } from 'src/models/place'
import { fakerIT as faker } from '@faker-js/faker'

export const useLocationStore = defineStore('location-store', () => {
  const favouritePlaces = ref<FavouritePlace[]>([{
    Label: 'Home',
    Address: 'Via Aldrovandi, 3',
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

  const getDefaultSapienzaLocation = (): Place => sapienzaPlaces[0]

  const getDefaultHomeLocation = (): Place => (favouritePlaces.value[0])

  const prevSearches = new Map<string, string[]>()

  // contains all previously generated addresses for quick lookups; might grow large
  const prevAddresses = new Set<string>()

  // contains all previously selected places to populate a history list
  const recentAddresses: Array<string> = []

  // Checks if a location is among Sapienza's facilities
  const isSapLocation = (location: Place): boolean => sapienzaPlaces.some(l => l.Address === location.Address)

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

    // avoid these modifiers when generating random addresses
    const avoidList = ['Contrada', 'Rotonda', 'Borgo', 'Strada', 'Incrocio']

    // generate random addresses that include the search string
    if (places.size < maxPlaces) {
      let attempts = 10000
      while (attempts > 0) {
        const newName = faker.location.street()
        if (avoidList.some(avoid => newName.startsWith(avoid))) continue
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
