import { date } from 'quasar'

export type IsoDate = string

const today = new Date()

export enum DateMode {
  Arrive = 'arrive',
  Leave = 'leave'
}

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

export const IsoDateFromDate = (d: Date): IsoDate => (date.formatDate(d, 'YYYY-MM-DD'))

export const DateFromIso = (s: string): Date => (date.extractDate(s, 'YYYY-MM-DD'))

export function FormatShortDate (d: Date): string {
  if (today.getFullYear() === d.getFullYear() && today.getMonth() === d.getMonth()) {
    if (today.getDate() === d.getDate()) return 'Today'
    if (today.getDate() === d.getDate() - 1) return 'Tomorrow'
  }
  return date.formatDate(d, 'ddd, D MMM')
}

export const FormatISODate = (d: Date): string =>
  `${date.formatDate(d, 'YYYY-MM-DD')}`

export const FormatDuration = (earliest: Date, latest: Date): string =>
  `${Math.abs(date.getDateDiff(earliest, latest, 'minutes'))} min.`
