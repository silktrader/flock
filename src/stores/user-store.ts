import { defineStore } from 'pinia'
import { RandomFloat, RandomId, RandomInt } from 'src/tools/random-tools'
import { Badges, Degrees } from 'stores/ride-store'
import { User, UserConfig } from 'src/models/user'
import { Driver } from 'src/models/driver'

const femaleNames = ['Federica', 'Agnese', 'Francesca', 'Guinevere', 'Desdemona', 'Eva', 'Anna-Laura', 'Katalyn', 'So-Jin', 'Daphne', 'Rachel', 'Barbara']
const maleNames = ['Francesco', 'Alessandro', 'Lorenzo', 'Benjamin', 'Carlo', 'Konstantin', 'Gianfranco', 'Ubaldo', 'Ignazio', 'Paulo', 'Gabriel Omar']
const lastNames = ['Nicolai', 'Misoponia', 'Tonetto', 'Perrotta', 'Spinazzola', 'Uribe', 'Borghese', 'Scozzafava', 'Jordan', 'Sbrojavacca', 'Domacavallo', 'Young', 'Keitel', 'Aldobrandini', 'Ercolani', 'de l\'Isle-Adam', 'Richemont', 'Green']

export const useUserStore = defineStore('user', () => {
  const femaleAvatarIds = [1, 5, 9, 10, 16, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 38, 39,
    40, 41, 42, 43, 44, 45, 47, 48, 49]

  const maleAvatarIds = [3, 6, 7, 8, 11, 12, 13, 14, 15, 33, 50, 51, 52, 55, 56, 57, 59, 60, 61, 62, 68]

  function getRandomAvatar (isFemale: boolean, avoidIds: ReadonlySet<number>): number {
    const validIds = (isFemale ? femaleAvatarIds : maleAvatarIds).filter(id => !avoidIds.has(id))
    return validIds[RandomInt(0, validIds.length)]
  }

  function configureNewUser (avoidAvatars: ReadonlySet<number>): UserConfig {
    // choose gender first for naming and avatar purposes
    const isFemale = Boolean(RandomInt(0, 2))

    return {
      Id: RandomId(),
      FirstName: isFemale ? femaleNames[RandomInt(0, femaleNames.length)] : maleNames[RandomInt(0, maleNames.length)],
      LastName: lastNames[RandomInt(0, lastNames.length)],
      AvatarId: getRandomAvatar(isFemale, avoidAvatars),
      Age: RandomInt(18, 39),
      Degree: Degrees[RandomInt(0, Degrees.length - 1)].Label,
      Badges: [
        RandomFloat(0, 1) > 0.5 ? Badges[0] : '',
        RandomFloat(0, 1) > 0.7 ? Badges[1] : '',
        RandomFloat(0, 1) > 0.6 ? Badges[2] : '']
        .filter(i => i !== '')
    }
  }

  function generateUser (avoidAvatars: ReadonlySet<number>): User {
    return new User(configureNewUser(avoidAvatars))
  }

  function generateDriver (avoidAvatars: ReadonlySet<number>): Driver {
    return new Driver({
      ...generateUser(avoidAvatars),
      Rating: RandomFloat(2.9, 4.9)
    })
  }

  return {
    generateUser,
    generateDriver
  }
})
