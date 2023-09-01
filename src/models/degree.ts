import { SapienzaPlace, sapienzaPlaces } from 'src/models/place'

export interface Degree {
  Label: string
  Places: ReadonlyArray<SapienzaPlace>
}

export const Degrees: ReadonlyArray<Degree> = [
  {
    Label: 'ACSAI',
    Places: [sapienzaPlaces[0], sapienzaPlaces[2]]
  },
  {
    Label: 'Computer Science',
    Places: [sapienzaPlaces[0], sapienzaPlaces[2]]
  },
  {
    Label: 'Sociology',
    Places: [sapienzaPlaces[0]]
  },
  {
    Label: 'Archaeology',
    Places: [sapienzaPlaces[0]]
  },
  {
    Label: 'Architecture',
    Places: [sapienzaPlaces[3]]
  },
  {
    Label: 'Economics',
    Places: [sapienzaPlaces[0], sapienzaPlaces[1]]
  },
  {
    Label: 'Business Management',
    Places: [sapienzaPlaces[0], sapienzaPlaces[1]]
  },
  {
    Label: 'Chemistry',
    Places: [sapienzaPlaces[0]]
  },
  {
    Label: 'Nursing',
    Places: [sapienzaPlaces[0]]
  }
]
