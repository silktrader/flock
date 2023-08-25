export interface UserConfig {
  id: string,
  firstName: string,
  lastName: string,
  avatarUrl: string,
  age: number,
  degree: string,
  badges: ReadonlyArray<string>
  followedCourses?: ReadonlyArray<string>
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

  constructor (config: UserConfig) {
    this.id = config.id
    this.firstName = config.firstName
    this.lastName = config.lastName
    this.avatarUrl = config.avatarUrl
    this.age = config.age
    this.degree = config.degree
    this.badges = config.badges
    this.followedCourses = config.followedCourses ?? []
  }

  get DisplayName (): string {
    return `${this.firstName} ${this.lastName[0]}.`
  }
}
