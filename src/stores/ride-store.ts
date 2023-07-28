import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { date } from 'quasar'
import { RandomFloat, RandomId, RandomInt } from 'src/tools/random-tools'
import { useLocationStore } from 'stores/location-store'
import { Ride } from 'src/models/ride'
import { Pickup } from 'src/models/pickup'
import { useUserStore } from 'stores/user-store'
import { Location } from 'src/models/location'
import { DateMode } from 'src/tools/date-tools'
import subtractFromDate = date.subtractFromDate
import addToDate = date.addToDate

export const Badges = ['punctual', 'veteran', 'cordial']

export enum Transport {
  None = 'None',
  Bus = 'Bus',
  Subway = 'Subway'
}

export enum PickupThreshold {
  Minimal = 5,
  Short = 10,
  Average = 20,
  Long = 30
}

export const Degrees = [
  {
    Label: 'ACSAI',
    Addresses: ['Città Universitaria', 'Facoltà d\'Ingegneria']
  },
  {
    Label: 'Computer Science',
    Addresses: ['Città Universitaria', 'Facoltà d\'Ingegneria']
  },
  {
    Label: 'Sociology',
    Addresses: ['Città Universitaria']
  },
  {
    Label: 'Archaeology',
    Addresses: ['Città Universitaria']
  },
  {
    Label: 'Architecture',
    Addresses: ['Facoltà d\'Architettura']
  },
  {
    Label: 'Economics',
    Addresses: ['Facoltà d\'Economia', 'Città Universitaria']
  },
  {
    Label: 'Business Management',
    Addresses: ['Facoltà d\'Economia', 'Città Universitaria']
  },
  {
    Label: 'Chemistry',
    Addresses: ['Città Universitaria']
  },
  {
    Label: 'Nursing',
    Addresses: ['Città Universitaria']
  }

]

export interface Car {
  Model: string;
  Seats: number;
  Electric: boolean;
  AirConditioning: boolean;
}

export interface Drop {
  Address: string;
  Date: Date;
}

// tk add validation (reach time must be > 5)
export interface SearchParameters {
  Origin: Location;
  Destination: Location;
  Date: Date;
  DateMode: DateMode;
  ReachTime: number;
  BusAllowed: boolean;
  SubwayAllowed: boolean;
}

export const useRideStore = defineStore('ride',
  () => {
    const ls = useLocationStore()
    const us = useUserStore()

    const rides = ref<Ride[]>([])
    const ride = ref<Ride>()

    // setup default parameters for easy testing while avoiding undefined state
    const defaultParameters: Readonly<SearchParameters> = {
      Origin: ls.getDefaultHomeLocation(),
      Date: new Date(),
      DateMode: DateMode.Arrive,
      Destination: ls.getDefaultSapienzaLocation(),
      ReachTime: 15,
      BusAllowed: false,
      SubwayAllowed: true
    }

    const searchParameters = ref<SearchParameters>(defaultParameters)

    // Clears existing rides, selected ride and parameters.
    function reset (): void {
      rides.value.splice(0)
      searchParameters.value = defaultParameters
      ride.value = undefined
    }

    // Fetches new rides with updated parameters.
    function updateSearch (): void {
      rides.value.splice(0)
      ride.value = undefined
      generateNewRides()
    }

    function updateParameters (newParameters: Partial<SearchParameters>): void {
      searchParameters.value = {
        ...searchParameters.value,
        ...newParameters
      }
    }

    function generateNewRides () {
      // needs not track variable through changes
      const {
        Origin: origin,
        Destination: destination,
        Date: date,
        DateMode: dateMode,
        ReachTime: reachTime
      } = searchParameters.value

      // signal which addresses should be removed from newly randomly generated ones
      const usedAddresses: ReadonlyArray<string> = [origin.Address, destination.Address]

      // avoid creating rides whose drivers share the same avatar
      const avoidAvatarIds: Set<number> = new Set()

      // flag the creation of at least one recurring ride, if any ride at all is to be generated
      let hasRecurringRide = false

      // tk allow for 0 rides generated!! remember

      // create a random number of new rides
      for (let results = RandomInt(2, 7); results > 0; results--) {
        let arrival: Date, departure: Date

        // determine arrival and departure times
        if (dateMode === DateMode.Arrive) {
          arrival = subtractFromDate(date, { minutes: RandomInt(3, 20) })
          departure = subtractFromDate(arrival, { minutes: RandomInt(25, 90) })
        } else {
          departure = addToDate(date, { minutes: RandomInt(3, 20) })
          arrival = addToDate(departure, { minutes: RandomInt(25, 90) })
        }

        // determine pickup details
        let pickupMinutes: number
        if (ls.isSapLocation(origin)) {
          pickupMinutes = RandomInt(1, 6)
        } else {
          pickupMinutes = RandomInt(Math.max(1, reachTime * 0.8), reachTime - 3)
        }
        const pickup = generatePickup(departure, pickupMinutes, usedAddresses)

        // generate a suitable driver
        const driver = us.generateDriver(avoidAvatarIds)
        avoidAvatarIds.add(driver.AvatarId)

        // determine random number of total and available seats
        const car = generateCar()
        const passengers = []
        const passengerAvatarIds: Set<number> = new Set()
        for (let occupiedSeats = RandomInt(0, car.Seats - 1); occupiedSeats > 0; occupiedSeats--) {
          const user = us.generateUser(passengerAvatarIds)
          passengerAvatarIds.add(user.AvatarId)
          passengers.push(user)
        }

        // ensure that at least one ride in the whole set is recurring
        const recurring: boolean = !hasRecurringRide ? true : RandomFloat(0, 1) > 0.75
        hasRecurringRide = recurring || hasRecurringRide

        rides.value.push(new Ride({
          Id: RandomId(),
          Origin: origin,
          Destination: destination,
          Arrival: arrival,
          Departure: departure,
          Driver: driver,
          Car: car,
          Drop: generateDrop(arrival, reachTime - pickupMinutes, [...usedAddresses, pickup.Address]),
          Pickup: pickup,
          Expense: RandomInt(0, 4),
          Passengers: passengers,
          Recurring: recurring
        }))
      }
    }

    const carModels = ['Toyota Yaris', 'Fiat 500', 'Lancia Ypsilon', 'Mazda 2', 'Lamborghini Murcielago', 'Renault Clio', 'Ford Fiesta']
    const electricCarModels = ['Tesla Model 3', 'Nissan Leaf', 'Polestar 2']

    function generateCar (): Car {
      const electric = Math.random() < 0.2
      return {
        Model: electric ? electricCarModels[RandomInt(0, electricCarModels.length - 1)] : carModels[RandomInt(0, carModels.length - 1)],
        Seats: RandomInt(3, 5),
        AirConditioning: Math.random() < 0.8,
        Electric: electric
      }
    }

    // Create a drop with a random address and sensible date, close to arrival time
    function generateDrop (arrival: Date, availableMinutes: number, avoidAddresses: string[]): Drop {
      return {
        Address: getRandomAddress(avoidAddresses),
        Date: subtractFromDate(arrival, { minutes: RandomInt(1, availableMinutes) })
      }
    }

    function generatePickup (departure: Date, pickupDelay: number, avoidAddresses: ReadonlyArray<string>): Pickup {
      // determine which means of transport the user can rely on to get to a pickup
      const eligibleTransports = [Transport.None]
      if (searchParameters.value.BusAllowed && pickupDelay > 5) {
        eligibleTransports.push(Transport.Bus)
      }
      if (searchParameters.value.SubwayAllowed && pickupDelay > 10) {
        eligibleTransports.push(Transport.Subway)
      }

      // choose an appropriate random transportation mode
      const chosenTransport: Transport = eligibleTransports[RandomInt(0, eligibleTransports.length)]
      const chosenTransportId: string =
        chosenTransport === Transport.Bus ? RandomInt(10, 900).toString() : ['Metro A', 'Metro B'][RandomInt(0, 2)]

      return {
        Address: getRandomAddress(avoidAddresses),
        Date: addToDate(departure, { minutes: pickupDelay }),
        Transport: chosenTransport,
        TransportId: chosenTransportId
      }
    }

    const randomAddresses = [
      'Via Marco Polo',
      'Corso Magellano',
      'Largo Colombo',
      'Viale Costantino',
      'Viale Traiano',
      'Piazza Giulio Cesare',
      'Corso Impero',
      'Viale dei Giardini',
      'Vicolo Stretto',
      'Viale Vesuvio',
      'Piazza Dante',
      'Corso Raffaello',
      'Bastioni Gran Sasso',
      'Piazza Euclide',
      'Via Maupassant',
      'Corso Balzac',
      'Largo Zola'
    ]

    function getRandomAddress (avoidAddresses: ReadonlyArray<string>): string {
      const address = randomAddresses[RandomInt(0, randomAddresses.length)]
      return (avoidAddresses.includes(address)) ? getRandomAddress(avoidAddresses) : `${address}, ${RandomInt(1, 100)}`
    }

    function selectRide (newRide: Ride): void {
      ride.value = newRide
    }

    function requestSelectedRide (): void {
      if (ride.value) {
        ride.value.Requested = true
      } else {
        throw new Error('No ride to request')
      }
    }

    function colourCodePickup (minutes: number): string {
      if (minutes < PickupThreshold.Minimal) return 'green-3'
      if (minutes < PickupThreshold.Short) return 'yellow-3'
      if (minutes < PickupThreshold.Average) return 'orange-3'
      return 'red-3'
    }

    function setDestination (newLocation: Location): void {
      searchParameters.value.Destination = newLocation
    }

    function setOrigin (newLocation: Location): void {
      searchParameters.value.Origin = newLocation
    }

    return {
      rides: readonly(rides),
      ride: readonly(ride),
      searchParameters: readonly(searchParameters),
      generateNewRides,
      updateParameters,
      selectRide,
      requestSelectedRide,
      reset,
      colourCodePickup,
      setDestination,
      setOrigin,
      updateSearch
    }
  })
