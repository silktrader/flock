const femaleNames = ['Federica', 'Agnese', 'Francesca', 'Guinevere', 'Desdemona', 'Eva', 'Anna-Laura', 'Katalyn', 'So-Jin', 'Daphne', 'Rachel', 'Barbara']
const maleNames = ['Francesco', 'Alessandro', 'Lorenzo', 'Benjamin', 'Carlo', 'Konstantin', 'Gianfranco', 'Ubaldo', 'Ignazio', 'Paulo', 'Gabriel Omar']

const familyNames = ['Nicolai', 'Scozzafava', 'Jordan', 'Sbrojavacca', 'Domacavallo', 'Young', 'Keitel', 'Aldobrandini', 'Ercolani', 'de l\'Isle-Adam', 'Richemont', 'Green']

export const RandomId = () => 'id' + Math.random().toString(16).slice(2)

// Returns an integer between the provided minimum (inclusive) and maximum (exclusive)
export const RandomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  return Math.floor(Math.random() * (Math.floor(max) - min + 1)) + min
}

export const RandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export function RandomName (isFemale: boolean, withInitial: boolean): string {
  const firstName = isFemale ? femaleNames[RandomInt(0, femaleNames.length - 1)] : maleNames[RandomInt(0, maleNames.length - 1)]
  const lastName = familyNames[RandomInt(0, familyNames.length - 1)]
  return `${firstName} ${withInitial ? `${lastName[0]}.` : lastName}`
}
