import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { date } from 'quasar'
import { RandomFloat, RandomId, RandomInt, RandomName } from 'src/tools/random-tools'
import { Location, useLocationStore } from 'stores/location-store'
import { Ride } from 'src/models/ride'
import { Pickup } from 'src/models/pickup'
import subtractFromDate = date.subtractFromDate
import addToDate = date.addToDate

export interface User {
  Id: string;
  Name: string;
  AvatarUrl: string;
  Age: number;
  Degree: string;
  Badges: ReadonlyArray<string>;
}

export const Badges = ['punctual', 'veteran', 'cordial']

export enum Transport {
  None = 'None',
  Bus = 'Bus',
  Subway = 'Subway'
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

export interface Driver extends User {
  Rating: number;
}

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
export interface RideParameters {
  Origin: Location;
  Destination: Location;
  ArriveBy: Date;
  ReachTime: number;
  BusAllowed: boolean;
  SubwayAllowed: boolean;
}

export const useRideStore = defineStore('ride',
  () => {
    const ls = useLocationStore()

    const rides = ref<Ride[]>([])
    const ride = ref<Ride>()

    // setup default parameters for easy testing while avoiding undefined state
    const defaultParameters = {
      Origin: ls.GetDefaultHomeLocation(),
      ArriveBy: new Date(),
      Destination: ls.GetDefaultSapienzaLocation(),
      ReachTime: 15,
      BusAllowed: false,
      SubwayAllowed: true
    }

    const rideParameters = ref<RideParameters>(defaultParameters)

    function reset (): void {
      rides.value.splice(0)
      rideParameters.value = defaultParameters
      ride.value = undefined
    }

    function setNewParameters (parameters: RideParameters): void {
      rideParameters.value = parameters
    }

    function generateNewRides () {
      if (rideParameters.value === undefined) throw new Error('Missing search parameters')

      // needs not track variable through changes
      const {
        ArriveBy: arriveBy,
        ReachTime: reachTime
      } = rideParameters.value

      // signal which addresses should be removed from newly randomly generated ones
      const searchAddresses: ReadonlyArray<string> = [rideParameters.value.Origin.Address, rideParameters.value.Destination.Address]

      // tk allow for 0 rides generated!! remember

      // create a random number of new rides
      for (let results = RandomInt(2, 7); results > 0; results--) {
        // determine a random arrival time close to the user's specified limit
        const arrival = subtractFromDate(arriveBy, { minutes: RandomInt(5, 20) })

        // determine a random departure time
        const departure = subtractFromDate(arrival, { minutes: RandomInt(25, 90) })

        // determine how long it takes to reach the pickup point
        // allow some time for the drop; 3 minutes at least
        const pickupTime = RandomInt(Math.max(1, reachTime * 0.5), reachTime - 3)
        const pickup = generatePickup(departure, pickupTime, searchAddresses)

        // determine random number of total and available seats
        const car = generateCar()
        const passengers = []
        for (let occupiedSeats = RandomInt(0, car.Seats - 1); occupiedSeats > 0; occupiedSeats--) {
          passengers.push(generateUser())
        }

        // build ride with debatable passing of unnamed arguments
        rides.value.push(new Ride(
          RandomId(),
          rideParameters.value.Origin,
          rideParameters.value.Destination,
          arrival,
          departure,
          generateDriver(),
          car,
          generateDrop(arrival, reachTime - pickupTime, [...searchAddresses, pickup.Address]),
          pickup,
          RandomInt(0, 3),
          passengers
        ))
      }
    }

    function generateUser (): User {
      // choose gender first for naming and avatar purposes
      const isFemale = Boolean(RandomInt(0, 1))
      return {
        Id: RandomId(),
        Name: RandomName(isFemale, true),
        AvatarUrl: `https://i.pravatar.cc/150?img=${RandomInt(0, 40)}`,
        Age: RandomInt(18, 39),
        Degree: Degrees[RandomInt(0, Degrees.length - 1)].Label,
        Badges: [
          RandomFloat(0, 1) > 0.5 ? Badges[0] : '',
          RandomFloat(0, 1) > 0.7 ? Badges[1] : '',
          RandomFloat(0, 1) > 0.6 ? Badges[2] : '']
          .filter(i => i !== '')
      }
    }

    function generateDriver (): Driver {
      return {
        ...generateUser(),
        Rating: RandomFloat(2.9, 4.9)
      }
    }

    const carModels = ['Toyota Yaris', 'Fiat 500', 'Lancia Ypsilon', 'Mazda 2', 'Lamborghini Murcielago', 'Renault Clio', 'Ford Fiesta']
    const electricCarModels = ['Tesla Model 3', 'Nissan Leaf', 'Polestar 2']

    function generateCar (): Car {
      const electric = Math.random() < 0.2
      return {
        Model: electric ? electricCarModels[RandomInt(0, electricCarModels.length - 1)] : carModels[RandomInt(0, carModels.length - 1)],
        Seats: RandomInt(1, 4),
        AirConditioning: Math.random() < 0.8,
        Electric: electric
      }
    }

    // Create a drop with a random address and sensible date, close to arrival time
    function generateDrop (arrival: Date, dropTime: number, avoidAddresses: string[]): Drop {
      return {
        Address: getRandomAddress(avoidAddresses),
        Date: subtractFromDate(arrival, { minutes: RandomInt(1, dropTime) })
      }
    }

    function generatePickup (departure: Date, pickupDelay: number, avoidAddresses: ReadonlyArray<string>): Pickup {
      // determine which means of transport the user can rely on to get to a pickup
      const eligibleTransports = [Transport.None]
      if (rideParameters.value.BusAllowed && pickupDelay > 5) {
        eligibleTransports.push(Transport.Bus)
      }
      if (rideParameters.value.SubwayAllowed && pickupDelay > 10) {
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

    return {
      rides: readonly(rides),
      ride: readonly(ride),
      rideParameters: readonly(rideParameters),
      generateNewRides,
      setNewParameters,
      selectRide,
      requestSelectedRide,
      reset
    }
  })
