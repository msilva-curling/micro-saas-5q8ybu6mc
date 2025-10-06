export const ALL_DAYS_TUPLE = [
  'Dom',
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb',
] as const
export type Day = (typeof ALL_DAYS_TUPLE)[number]

export const Weekdays: Day[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
export const Weekends: Day[] = ['Dom', 'Sáb']
export const AllDays: Day[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export type Frequency = Day[]

export interface Habit {
  id: string
  name: string
  description: string
  frequency: Frequency
  color: string
  createdAt: string // ISO string
  completions: Record<string, boolean> // { 'YYYY-MM-DD': true }
}
