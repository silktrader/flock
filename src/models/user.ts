export interface UserConfig {
  Id: string,
  FirstName: string,
  LastName: string,
  AvatarId: number,
  Age: number,
  Degree: string,
  Badges: ReadonlyArray<string>
}

export class User {
  readonly Id: string
  readonly FirstName: string
  readonly LastName: string
  readonly AvatarId: number
  readonly Age: number
  readonly Degree: string
  readonly Badges: ReadonlyArray<string>

  constructor (config: UserConfig) {
    this.Id = config.Id
    this.FirstName = config.FirstName
    this.LastName = config.LastName
    this.AvatarId = config.AvatarId
    this.Age = config.Age
    this.Degree = config.Degree
    this.Badges = config.Badges
  }

  get AvatarUrl (): string {
    return `https://i.pravatar.cc/150?img=${this.AvatarId}`
  }

  get DisplayName (): string {
    return `${this.FirstName} ${this.LastName[0]}.`
  }
}
