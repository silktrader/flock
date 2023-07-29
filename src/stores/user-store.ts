import { defineStore } from 'pinia'
import { RandomFloat, RandomId, RandomInt } from 'src/tools/random-tools'
import { Badges, Degrees } from 'stores/ride-store'
import { User, UserConfig } from 'src/models/user'
import { Driver } from 'src/models/driver'
import { Lecture } from 'src/models/lecture'
import { date } from 'quasar'
import { readonly } from 'vue'

const femaleNames = ['Federica', 'Agnese', 'Francesca', 'Guinevere', 'Desdemona', 'Eva', 'Anna-Laura', 'Katalyn', 'So-Jin', 'Daphne', 'Rachel', 'Barbara']
const maleNames = ['Francesco', 'Alessandro', 'Lorenzo', 'Benjamin', 'Carlo', 'Konstantin', 'Gianfranco', 'Ubaldo', 'Ignazio', 'Paulo', 'Gabriel Omar']
const lastNames = ['Nicolai', 'Misoponia', 'Tonetto', 'Perrotta', 'Spinazzola', 'Uribe', 'Borghese', 'Scozzafava', 'Jordan', 'Sbrojavacca', 'Domacavallo', 'Young', 'Keitel', 'Aldobrandini', 'Ercolani', 'de l\'Isle-Adam', 'Richemont', 'Green']

export const useUserStore = defineStore('user', () => {
  const femaleAvatarIds = [1, 5, 9, 10, 16, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 38, 39,
    40, 41, 42, 43, 44, 45, 47, 48, 49]

  const maleAvatarIds = [3, 6, 7, 8, 11, 12, 13, 14, 15, 33, 50, 51, 52, 55, 56, 57, 59, 60, 61, 62, 68]

  const lectures: Array<Lecture> = []

  generateRandomLectures()

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

  function generateRandomLectures (): void {
    // reinitialise store's lectures
    lectures.splice(0, lectures.length)

    const courses = [
      {
        name: 'Human Computer Interaction',
        days: ['mon', 'thu'],
        start: [10, 14]
      },
      {
        name: 'Database Management',
        days: ['tue', 'wed'],
        start: [9, 16]
      },
      {
        name: 'Computer Architecture',
        days: ['mon', 'wed'],
        start: [16, 8]
      },
      {
        name: 'Statistics',
        days: ['thu', 'fri'],
        start: [8, 8]
      },
      {
        name: 'Calculus',
        days: ['tue', 'fri'],
        start: [15, 16]
      }]

    const today = new Date()

    for (const course of courses) {
      for (const [index, day] of course.days.entries()) {
        // find the next day of the week after today
        let startDate = date.adjustDate(today, {
          hours: course.start[index],
          minutes: 0,
          second: 0
        })
        startDate = getNextDayOfTheWeek(day, startDate)
        for (let weeks = 0; weeks <= 6; weeks++) {
          lectures.push({
            Course: course.name,
            Location: {
              Label: 'Campus',
              Address: 'Stocazzo'
            },
            Duration: 120,
            Date: date.addToDate(startDate, { days: weeks * 7 })

          })
        }
      }
    }
  }

  function getNextDayOfTheWeek (dayName: string, refDate: Date): Date {
    const weekDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(dayName)
    if (weekDay < 0) {
      throw new Error('Could not select proper weekday')
    }
    refDate.setDate(refDate.getDate() +
      (weekDay + (7 - refDate.getDay())) % 7)
    return refDate
  }

  return {
    generateUser,
    generateDriver,
    lectures: readonly(lectures)
  }
})