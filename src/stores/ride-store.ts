import { defineStore } from 'pinia'
import { readonly, ref, toRaw } from 'vue'
import { date } from 'quasar'
import { getRandomAddress, RandomFloat, RandomId, RandomInt } from 'src/tools/random-tools'
import { useLocationStore } from 'stores/location-store'
import { Ride } from 'src/models/ride'
import { Pickup } from 'src/models/pickup'
import { useUserStore } from 'stores/user-store'
import { DateMode, today } from 'src/tools/date-tools'
import { Car, cars } from 'src/models/car'
import { SearchParameters } from 'src/models/search-parameters'
import { faker } from '@faker-js/faker/locale/it'
import { getRandomRideComment } from 'src/models/ride-comment'
import { getRandomRules } from 'src/models/ride-rule'
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

export interface Drop {
  Address: string;
  Date: Date;
}

export interface RideSearch {
  Date: Date,
  Rides: ReadonlyArray<Ride>
}

export const useRideStore = defineStore('ride',
  () => {
    const ls = useLocationStore()
    const us = useUserStore()

    // setup default parameters for easy testing while avoiding undefined state
    const defaultParameters: Readonly<SearchParameters> = {
      Origin: ls.getDefaultHomeLocation(),
      Date: us.getNextLecture()?.date ?? today,
      DateMode: DateMode.Arrive,
      Destination: us.getNextLecture()?.location ?? ls.getDefaultSapienzaLocation(),
      reachTime: 20,
      busAllowed: true,
      subwayAllowed: true,
      ladiesOnly: false,
      freeSeats: 1
    }

    const searchParameters = ref<SearchParameters>(defaultParameters)

    // contains the rides returned by the user search
    const rides = ref<Ride[]>([])

    // holds a reference to the selected ride ready to be inspected
    const ride = ref<Ride>()

    // contains a history of previous searches
    const searches = ref<Map<string, RideSearch>>(new Map())

    // contains all the rides a user booked, include an initial sample
    const bookedRides = ref<Array<Ride>>(generateBookedRides())

    // mocks a hypothetical round trip to a database
    const searching = ref<boolean>(false)

    // Clears existing rides, selected ride and parameters.
    function reset (): void {
      rides.value.splice(0)
      searchParameters.value = defaultParameters
      ride.value = undefined
    }

    // Takes parameters and turn them into JSON strings.
    // This horrible expedient is required to bypass JS maps equalities.
    function serialiseParameters (parameters: SearchParameters): string {
      return JSON.stringify({
        origin: toRaw(parameters.Origin),
        destination: toRaw(parameters.Destination),
        date: toRaw(parameters.Date),
        dateMode: parameters.DateMode,
        reachTime: parameters.reachTime,
        busAllowed: parameters.busAllowed,
        subwayAllowed: parameters.subwayAllowed,
        ladiesOnly: parameters.ladiesOnly,
        results: parameters.results
      })
    }

    // Fetches new rides with updated parameters.
    function updateSearch (): void {
      const serialisedParameters = serialiseParameters(searchParameters.value)
      const oldSearch = searches.value.get(serialisedParameters)
      ride.value = undefined

      // either fetch previously stored results or generate new ones
      if (oldSearch === undefined || date.getDateDiff(oldSearch.Date, new Date(), 'minutes') > 10) {
        rides.value.splice(0, rides.value.length, ...generateNewRides())
        searches.value.set(serialisedParameters, {
          Rides: [...rides.value],
          Date: new Date()
        })
      } else {
        // when the search is repeated populate the results with old rides
        rides.value.splice(0, rides.value.length, ...oldSearch.Rides)
      }

      searching.value = true
      setTimeout(() => {
        searching.value = false
      }, RandomInt(500, 1500))
    }

    function updateParameters (newParameters: Partial<SearchParameters>): void {
      searchParameters.value = {
        ...searchParameters.value,
        ...newParameters
      }
      updateSearch()
    }

    function getRandomRideEssentials () {
      return {
        Id: RandomId(),
        rules: getRandomRules(),
        comment: getRandomRideComment(),
        Expense: RandomInt(0, 4)
      }
    }

    function generateBookedRides (): Array<Ride> {
      // generate a couple of rides related to the user's home and lectures
      const rides: Array<Ride> = []

      // pick a random lecture
      const now = new Date()
      const soon = date.addToDate(now, { day: 10 })
      const nextLectures = us.lectures.filter(l => l.date >= now && l.date < soon)
      for (let i = RandomInt(1, 3); i >= 0; i--) {
        // pick a random lecture
        const lecture = nextLectures[RandomInt(0, nextLectures.length)]

        // from home to the lecture
        const arrival = subtractFromDate(lecture.date, { minutes: RandomInt(3, 20) })
        const departure = subtractFromDate(arrival, { minutes: RandomInt(25, 90) })

        // determine random number of total and available seats
        const passengers = []
        const passengerAvatars: Set<string> = new Set()
        for (let occupiedSeats = RandomInt(0, 3); occupiedSeats > 0; occupiedSeats--) {
          const user = us.generateUser(passengerAvatars, false)
          passengerAvatars.add(user.avatarUrl)
          passengers.push(user)
        }

        rides.push(new Ride({
          ...getRandomRideEssentials(),
          Origin: defaultParameters.Origin,
          Destination: lecture.location,
          Arrival: arrival,
          Departure: departure,
          Driver: us.generateDriver(passengerAvatars, false),
          Car: generateCar(),
          Drop: generateDrop(arrival, RandomInt(3, 10)),
          Pickup: generatePickup(departure, RandomInt(3, 15)),
          passengers,
          Recurring: false,
          before: lecture,
          accepted: true
        }))

        if (RandomFloat(0, 1) > 0.5) {
          const departure = date.addToDate(lecture.date, { minute: lecture.duration + 15 })
          const arrival = date.addToDate(departure, { minute: RandomInt(20, 45) })
          rides.push(new Ride({
            ...getRandomRideEssentials(),
            Origin: lecture.location,
            Destination: defaultParameters.Origin,
            Arrival: arrival,
            Departure: departure,
            Driver: us.generateDriver(passengerAvatars, false),
            Car: generateCar(),
            Drop: generateShortDrop(arrival, defaultParameters.Origin.Address),
            Pickup: generateShortPickup(departure, lecture.location.Address),
            passengers,
            Recurring: false,
            after: lecture,
            accepted: true
          }))
        }
      }

      return rides
    }

    function generateNewRides (): ReadonlyArray<Ride> {
      // needs not track variable through changes
      const {
        Origin: origin,
        Destination: destination,
        Date: date,
        DateMode: dateMode,
        reachTime,
        ladiesOnly
      } = searchParameters.value

      // avoid creating rides whose drivers share the same avatar
      const avoidAvatars: Set<string> = new Set()

      // flag the creation of at least one recurring ride, if any ride at all is to be generated
      let hasRecurringRide = false

      // the most frequent durations are more desirable
      const maxDurationDistribution = [30, 30, 60, 90]

      const rides: Array<Ride> = []

      // create a random number of new rides
      for (let results = searchParameters.value.results ?? RandomInt(0, 7); results > 0; results--) {
        let arrival: Date, departure: Date
        const tripDuration = RandomInt(25, maxDurationDistribution[RandomInt(0, maxDurationDistribution.length)])

        // determine arrival and departure times
        if (dateMode === DateMode.Arrive) {
          arrival = subtractFromDate(date, { minutes: RandomInt(3, 20) })
          departure = subtractFromDate(arrival, { minutes: tripDuration })
        } else {
          departure = addToDate(date, { minutes: RandomInt(3, 20) })
          arrival = addToDate(departure, { minutes: tripDuration })
        }

        // determine pickup details
        const pickupMinutes = ls.isSapLocation(origin) ? RandomInt(1, 6) : RandomInt(Math.max(tripDuration * 0.33, reachTime - 6), reachTime - 3)
        const pickup = generatePickup(departure, pickupMinutes)

        // generate a suitable driver
        const driver = us.generateDriver(avoidAvatars, ladiesOnly)
        avoidAvatars.add(driver.avatarUrl)

        // determine random number of total and available seats
        const car = generateCar()
        const passengers = []
        const passengerAvatars: Set<string> = new Set()
        for (let occupiedSeats = RandomInt(0, car.seats - 1); occupiedSeats > 0; occupiedSeats--) {
          const user = us.generateUser(passengerAvatars, ladiesOnly)
          passengerAvatars.add(user.avatarUrl)
          passengers.push(user)
        }

        // ensure that at least one ride in the whole set is recurring
        const recurring: boolean = !hasRecurringRide ? true : RandomFloat(0, 1) > 0.75
        hasRecurringRide = recurring || hasRecurringRide

        rides.push(new Ride({
          ...getRandomRideEssentials(),
          Origin: origin,
          Destination: destination,
          Arrival: arrival,
          Departure: departure,
          Driver: driver,
          Car: car,
          Drop: generateDrop(arrival, reachTime - pickupMinutes),
          Pickup: pickup,
          passengers,
          Recurring: recurring
        }))
      }

      return rides
    }

    function generateCar (): Car {
      const carSpec = cars[RandomInt(0, cars.length - 1)]
      return {
        ...carSpec,
        vrm: faker.vehicle.vrm(),
        color: faker.color.rgb(),
        usbChargers: Boolean(RandomInt(0, 2)),
        bootSpace: Boolean(RandomInt(0, 3)),
        soundSystem: Boolean(RandomInt(0, 2))
      }
    }

    function generateCloseAddress (baseAddress: string): string {
      const closeAddress = baseAddress.replace(/\b\d+\b/g, String(RandomInt(1, 300)))
      if (closeAddress === baseAddress) return generateCloseAddress(baseAddress)
      return closeAddress
    }

    // Create a drop with a random address and sensible date, close to arrival time
    function generateDrop (arrival: Date, availableMinutes: number): Drop {
      return {
        Address: getRandomAddress(),
        Date: subtractFromDate(arrival, { minutes: RandomInt(1, availableMinutes) })
      }
    }

    function generateShortDrop (arrival: Date, address: string): Drop {
      return {
        Address: generateCloseAddress(address),
        Date: subtractFromDate(arrival, { minutes: RandomInt(1, 6) })
      }
    }

    function generatePickup (departure: Date, minutes: number): Pickup {
      // determine which means of transport the user can rely on to get to a pickup
      const eligibleTransports = []
      if (minutes < 20 || (!searchParameters.value.busAllowed && !searchParameters.value.subwayAllowed)) {
        eligibleTransports.push(Transport.None)
      }
      if (searchParameters.value.busAllowed && minutes > 5) {
        eligibleTransports.push(Transport.Bus)
      }
      if (searchParameters.value.subwayAllowed && minutes > 10) {
        eligibleTransports.push(Transport.Subway)
      }

      // choose an appropriate random transportation mode
      const chosenTransport: Transport = eligibleTransports[RandomInt(0, eligibleTransports.length)]
      const chosenTransportId: string =
        chosenTransport === Transport.Bus ? RandomInt(10, 900).toString() : ['Metro A', 'Metro B'][RandomInt(0, 2)]

      return {
        Address: getRandomAddress(),
        Date: addToDate(departure, { minutes }),
        Transport: chosenTransport,
        TransportId: chosenTransportId
      }
    }

    function generateShortPickup (departure: Date, address: string): Pickup {
      return {
        Address: generateCloseAddress(address),
        Date: addToDate(departure, { minutes: RandomInt(2, 6) }),
        Transport: Transport.None
      }
    }

    function selectRide (newRide: Ride): void {
      ride.value = newRide
    }

    function colourCodePickup (minutes: number): string {
      if (minutes <= PickupThreshold.Minimal) return 'green-3'
      if (minutes <= PickupThreshold.Short) return 'yellow-3'
      if (minutes <= PickupThreshold.Average) return 'orange-3'
      return 'red-3'
    }

    function requestSelectedRide (): void {
      if (ride.value === undefined) {
        throw new Error('No ride to request')
      }
      ride.value = new Ride({
        ...ride.value,
        requested: new Date()
      })
      bookedRides.value.push(ride.value)
    }

    function cancelSelectedRequest (): void {
      if (ride.value === undefined) {
        throw new Error('No ride to cancel')
      }
      // unnecessary null navigator, side steps language server issues
      const rideIndex = bookedRides.value.findIndex(r => r.Id === ride.value?.Id)
      bookedRides.value.splice(rideIndex, 1)
      ride.value = new Ride({
        ...ride.value,
        requested: null
      })
    }

    return {
      rides: readonly(rides),
      bookedRides: readonly(bookedRides),
      ride: readonly(ride),
      searchParameters: readonly(searchParameters),
      searching: readonly(searching),
      updateParameters,
      selectRide,
      reset,
      colourCodePickup,
      requestSelectedRide,
      cancelSelectedRequest
    }
  })
