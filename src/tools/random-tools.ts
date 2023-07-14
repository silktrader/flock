export const RandomId = () => 'id' + Math.random().toString(16).slice(2)

// Returns an integer between the provided minimum (inclusive) and maximum (exclusive)
export const RandomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  return Math.floor(Math.random() * (Math.floor(max) - min) + min)
}

export const RandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}
