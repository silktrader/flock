export interface UserConfig {
  id: string,
  firstName: string,
  lastName: string,
  avatarUrl: string,
  age: number,
  degree: string,
  badges: ReadonlyArray<string>
  languages: ReadonlyArray<string>
  followedCourses?: ReadonlyArray<string>
  onTime: number
}

export class User {
  readonly id: string
  readonly firstName: string
  readonly lastName: string
  readonly avatarUrl: string
  readonly age: number
  readonly degree: string
  readonly badges: ReadonlyArray<string>
  readonly followedCourses: ReadonlyArray<string>
  readonly languages: ReadonlyArray<string>
  readonly onTime: number

  constructor (config: UserConfig) {
    this.id = config.id
    this.firstName = config.firstName
    this.lastName = config.lastName
    this.avatarUrl = config.avatarUrl
    this.age = config.age
    this.degree = config.degree
    this.badges = config.badges
    this.followedCourses = config.followedCourses ?? []
    this.languages = config.languages
    this.onTime = config.onTime
  }

  get onTimeRating (): number {
    return Math.round(this.onTime / 0.33)
  }

  get displayName (): string {
    return `${this.firstName} ${this.lastName[0]}.`
  }
}
