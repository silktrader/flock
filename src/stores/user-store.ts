import { defineStore } from 'pinia'
import { RandomFloat, RandomId, RandomInt, RandomPercent } from 'src/tools/random-tools'
import { Badges, Degrees } from 'stores/ride-store'
import { User, UserConfig } from 'src/models/user'
import { Driver } from 'src/models/driver'
import { Lecture } from 'src/models/lecture'
import { date } from 'quasar'
import { readonly, ref } from 'vue'
import { useLocationStore } from 'stores/location-store'
import { fakerIT as faker } from '@faker-js/faker'
import { today } from 'src/tools/date-tools'
import { Course } from 'src/models/course'
import { SearchParameters } from 'src/models/search-parameters'

export const useUserStore = defineStore('user', () => {
  const femaleAvatars: ReadonlyArray<string> =
    [1, 5, 9, 10, 16, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 38, 39,
      40, 41, 42, 43, 44, 45, 47, 48, 49]
      .map(n => `https://i.pravatar.cc/150?img=${n}`)

  const maleAvatars: ReadonlyArray<string> =
    [3, 6, 7, 8, 11, 12, 13, 14, 15, 33, 50, 51, 52, 55, 56, 57, 59, 60, 61, 62, 68]
      .map(n => `https://i.pravatar.cc/150?img=${n}`)

  const ls = useLocationStore()

  const user: Readonly<User> = new User({
    id: RandomId(),
    firstName: 'Christiane',
    lastName: 'F.',
    age: 22,
    avatarUrl: 'images/christiane.png',
    badges: [],
    degree: 'ACSAI',
    followedCourses: ['HCI', 'DBM', 'CAR', 'STA', 'CLC'],
    languages: ['english', 'italian', 'spanish', 'french'],
    onTime: 0.8
  })

  const getRandomSapLocation = () => ls.sapienzaPlaces[RandomInt(0, ls.sapienzaPlaces.length)]

  // few courses justify the use of arrays instead of maps
  const courses: ReadonlyArray<Course> = [
    {
      id: RandomId(),
      name: 'Human Computer Interaction',
      acro: 'HCI',
      days: ['mon', 'thu'],
      start: [10, 14],
      location: getRandomSapLocation(),
      color: '#56282D'
    },
    {
      id: RandomId(),
      name: 'Database Management',
      acro: 'DBM',
      days: ['tue', 'wed'],
      start: [9, 16],
      location: getRandomSapLocation(),
      color: '#83781b'
    },
    {
      id: RandomId(),
      name: 'Computer Architecture',
      acro: 'CAR',
      days: ['mon', 'wed'],
      start: [16, 8],
      location: getRandomSapLocation(),
      color: '#c4621c'
    },
    {
      id: RandomId(),
      name: 'Statistics',
      acro: 'STA',
      days: ['thu', 'fri'],
      start: [8, 8],
      location: getRandomSapLocation(),
      color: '#ffd23f'
    },
    {
      id: RandomId(),
      name: 'Calculus',
      acro: 'CLC',
      days: ['tue', 'fri'],
      start: [15, 16],
      location: getRandomSapLocation(),
      color: '#52414c'
    }]

  const lectures: ReadonlyArray<Lecture> = generateLectures()

  // user added notifications about new rides at desired dates
  const rideNotifications = ref<Array<SearchParameters>>([])

  function getRandomAvatar (isFemale: boolean, avoidAvatars: ReadonlySet<string>): string {
    const validAvatars = (isFemale ? femaleAvatars : maleAvatars).filter(id => !avoidAvatars.has(id))
    return validAvatars[RandomInt(0, validAvatars.length)]
  }

  function configureNewUser (avoidAvatars: ReadonlySet<string>, forceFemale: boolean): UserConfig {
    // choose gender first for naming and avatar purposes
    const isFemale = forceFemale || Boolean(RandomInt(0, 2))

    return {
      id: RandomId(),
      firstName: faker.person.firstName(isFemale ? 'female' : 'male'),
      lastName: faker.person.lastName(isFemale ? 'female' : 'male'),
      avatarUrl: getRandomAvatar(isFemale, avoidAvatars),
      age: RandomInt(18, 39),
      degree: Degrees[RandomInt(0, Degrees.length - 1)].Label,
      badges: [
        RandomFloat(0, 1) > 0.5 ? Badges[0] : '',
        RandomFloat(0, 1) > 0.7 ? Badges[1] : '',
        RandomFloat(0, 1) > 0.6 ? Badges[2] : '']
        .filter(i => i !== ''),
      languages: randomLanguages(),
      onTime: randomOnTime()
    }
  }

  function generateUser (avoidAvatars: ReadonlySet<string>, forceFemale: boolean): User {
    return new User(configureNewUser(avoidAvatars, forceFemale))
  }

  function generateDriver (avoidAvatars: ReadonlySet<string>, forceFemale: boolean): Driver {
    return new Driver({
      ...generateUser(avoidAvatars, forceFemale),
      Rating: RandomFloat(2.9, 4.9)
    })
  }

  function randomLanguages (): ReadonlyArray<string> {
    const languages = []
    if (RandomPercent() > 0.15) languages.push('italian')
    if (RandomPercent() > 0.4) languages.push('english')
    if (RandomPercent() > 0.7) languages.push('spanish')
    if (RandomPercent() > 0.9) languages.push('french')
    return languages
  }

  function randomOnTime (): number {
    const minDist = [0.3, 0.5, 0.8]
    return RandomFloat(minDist[RandomInt(0, minDist.length)], 1)
  }

  function getCourseById (id: string): Course {
    const course = courses.find(c => c.id === id)
    if (course === undefined) throw new Error(`Course ${id} not found`)
    return course
  }

  function generateLectures (): Array<Lecture> {
    // decide on a random rides distribution
    const lecturesRides = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3]

    const lectures: Array<Lecture> = []
    // generate about three months worth of lectures for each followed course, going back a few days from today
    let cursorDate: Date = date.subtractFromDate(today, { days: RandomInt(3, 8) })
    for (let i = 0; i <= 89; i++) {
      cursorDate = date.addToDate(cursorDate, { days: 1 })
      const day = date.formatDate(cursorDate, 'ddd').toLowerCase()

      for (const course of courses) {
        const index = course.days.indexOf(day)
        if (index >= 0) {
          const actualDate = new Date(cursorDate)
          actualDate.setHours(course.start[index])
          lectures.push({
            id: RandomId(),
            courseId: course.id,
            date: actualDate,
            duration: [120, 100, 90][RandomInt(0, 3)],
            location: course.location,
            ridesAvailable: lecturesRides[RandomInt(0, lecturesRides.length)]
          })
        }
      }
    }

    return lectures
  }

  function notifyRide (params: SearchParameters): void {
    rideNotifications.value.push(params)
  }

  return {
    lectures: readonly(lectures),
    rideNotifications: readonly(rideNotifications),
    user,
    generateUser,
    generateDriver,
    getCourseById,
    notifyRide
  }
})
