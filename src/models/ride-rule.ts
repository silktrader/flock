import { RandomInt, RandomPercent } from 'src/tools/random-tools'

const rideRules: ReadonlyArray<string> = [
  'No Smoking',
  'No Food',
  'No Sleeping',
  'No Chats',
  'Chatting',
  'Compulsory Mask',
  'No Music',
  'Music',
  'Podcast',
  'Radio News'
]

export const getRandomRules = (): ReadonlyArray<string> => {
  const count = RandomInt(2, 5)
  const rules = new Set<string>()
  while (rules.size < count) {
    rules.add(rideRules[RandomInt(0, rideRules.length)])
  }

  // remove incompatible rules
  if (rules.has('Chatting')) {
    rules.delete('No Chats')
  }

  if (rules.has('No Music')) {
    rules.delete('Music')
  }

  // remove unlikely rule
  if (RandomPercent() > 0.5) {
    rules.delete('Compulsory Mask')
  }

  return Array.from(rules)
}
