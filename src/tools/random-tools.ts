import { uid } from 'quasar'
import { faker } from '@faker-js/faker/locale/it'

export const RandomId = (): string => uid()

// Returns an integer between the provided minimum (inclusive) and maximum (exclusive)
// export const RandomInt = (min: number, max: number): number => {
//   min = Math.ceil(min)
//   return Math.floor(Math.random() * (Math.floor(max) - min) + min)
// }

export function RandomInt (min: number, max: number): number {
  const arr = new Uint32Array(1)

  // populate the array with random values
  window.crypto.getRandomValues(arr)

  const randomFloat = arr[0] / 0xffffffff

  min = Math.ceil(min)
  return Math.floor(randomFloat * (Math.floor(max) - min) + min)
}

export const RandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export const RandomPercent = (): number => {
  const int = window.crypto.getRandomValues(new Uint32Array(1))[0]
  return int / 2 ** 32
}

const avoidList = ['Contrada', 'Rotonda', 'Borgo', 'Strada', 'Incrocio']

export function getRandomAddress (): string {
  // avoid these modifiers when generating random addresses
  const address = faker.location.street()
  return avoidList.some(avoid => address.startsWith(avoid))
    ? getRandomAddress()
    : (`${address}, ${faker.location.buildingNumber()}`)
}
