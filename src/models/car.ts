export interface CarSpec {
  model: string
  seats: number
  electric: boolean
  airConditioning: boolean
  airBag: boolean
}

export interface Car extends CarSpec {
  vrm: string
  color: string
  usbChargers: boolean
  bootSpace: boolean
  soundSystem: boolean
}

export const cars: ReadonlyArray<CarSpec> = [{
  model: 'Mazda 2',
  seats: 4,
  electric: false,
  airConditioning: true,
  airBag: true
},
{
  model: 'Lancia Ypsilon',
  seats: 4,
  electric: false,
  airConditioning: false,
  airBag: false
},
{
  model: 'Volkswagen Golf',
  seats: 4,
  electric: false,
  airConditioning: false,
  airBag: true
},
{
  model: 'Volkswagen Polo',
  seats: 4,
  electric: false,
  airConditioning: true,
  airBag: true
},
{
  model: 'Smart Fortwo',
  seats: 1,
  electric: false,
  airConditioning: true,
  airBag: true
},
{
  model: 'Renault Clio',
  seats: 4,
  electric: false,
  airConditioning: true,
  airBag: true
},
{
  model: 'Lamborghini Murciélago',
  seats: 1,
  electric: false,
  airConditioning: true,
  airBag: true
},
{
  model: 'Ford Fiesta',
  seats: 4,
  electric: false,
  airConditioning: true,
  airBag: false
},
{
  model: 'Fiat 500',
  seats: 4,
  electric: false,
  airConditioning: true,
  airBag: true
},
{
  model: 'Tesla Model',
  seats: 3,
  electric: true,
  airConditioning: true,
  airBag: true
},
{
  model: 'Polestar 2',
  seats: 4,
  electric: true,
  airConditioning: true,
  airBag: true
},
{
  model: 'Nissan Leaf',
  seats: 4,
  electric: true,
  airConditioning: true,
  airBag: true
},
{
  model: 'Citroën Ami',
  seats: 1,
  electric: true,
  airConditioning: false,
  airBag: false
}
]
