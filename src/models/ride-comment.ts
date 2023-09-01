import { RandomInt } from 'src/tools/random-tools'

const rideComments: ReadonlyArray<string> = [

  'Make sure you\'re on time! I will wait a couple of minutes at the pickup spot, then leave in a heartbeat!',

  'Beware wimps, I am a sporty driver. ' +
  'I racked up over 1500+ practice hours on Gran Turismo, so I obviously know what I am doing!',

  'Hello folks! I kindly ask that you stash your backpack in the boot of the car before hopping in, so that we ' +
  'can all be comfy.',

  'Lazio fans, keep clear of this ride! I am sorry but I can\'t stand the stench of goat cheese in the morning.',

  'Don\'t ask to change pickup location at the last minute. I am not going to fiddle with my GPS while I' +
  'rush to uni. Thanks!'
]

export const getRandomRideComment = (): string => rideComments[RandomInt(0, rideComments.length)]
