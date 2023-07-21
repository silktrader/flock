import { date } from 'quasar'

const today = new Date()

export const ExtractTime = (d: Date) => date.formatDate(d, 'HH:mm')
export const ExtractDate = (d: Date) => date.formatDate(d, 'dddd, D MMMM ')
export const ExtractDay = (d: Date) => date.formatDate(d, 'dddd')
export const MinutesDiff = (first: Date, second: Date) => date.getDateDiff(first, second, 'minutes')

export function FormatFriendlyDate (d: Date): string {
  if (today.getFullYear() === d.getFullYear() || today.getMonth() === d.getMonth()) {
    if (today.getDate() === d.getDate()) return 'today'
    if (today.getDate() === d.getDate() - 1) return 'tomorrow'
  }
  return date.formatDate(d, 'dddd, [the] Do [of] MMMM')
}

export const FormatDuration = (earliest: Date, latest: Date): string =>
  `${Math.abs(date.getDateDiff(earliest, latest, 'minutes'))} min.`
