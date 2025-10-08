/* General utility functions (exposes cn) */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Day, AllDays, Habit } from '@/types/habit'
import {
  format,
  getDay,
  isToday,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Merges multiple class names into a single string
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  const weekday = format(date, 'EEEE', { locale: ptBR })
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)
  return `Hoje é ${capitalizedWeekday}, ${format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`
}

export function isHabitScheduledForToday(habit: Habit): boolean {
  const todayIndex = getDay(new Date()) // Sunday = 0, Monday = 1, etc.
  const todayDay: Day = AllDays[todayIndex]
  return habit.frequency.includes(todayDay)
}

export function getWeeklyCompletions(
  completions: Record<string, boolean>,
): number {
  const today = new Date()
  const weekStart = startOfWeek(today, { locale: ptBR })
  const weekEnd = endOfWeek(today, { locale: ptBR })

  return Object.keys(completions).filter((dateStr) => {
    if (!completions[dateStr]) return false
    const completionDate = new Date(dateStr)
    const utcCompletionDate = new Date(
      completionDate.getUTCFullYear(),
      completionDate.getUTCMonth(),
      completionDate.getUTCDate(),
    )
    return isWithinInterval(utcCompletionDate, {
      start: weekStart,
      end: weekEnd,
    })
  }).length
}

export function getStreak(completions: Record<string, boolean>): {
  current: number
  best: number
} {
  const dates = Object.keys(completions)
    .filter((date) => completions[date])
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  if (dates.length === 0) {
    return { current: 0, best: 0 }
  }

  let currentStreak = 0
  let bestStreak = 0
  let lastDate = new Date()

  if (
    isToday(new Date(dates[0])) ||
    new Date().getTime() - new Date(dates[0]).getTime() < 86400000 * 2
  ) {
    if (dates.length > 0) {
      currentStreak = 1
      lastDate = new Date(dates[0])
    }
  }

  for (let i = 1; i < dates.length; i++) {
    const currentDate = new Date(dates[i])
    const diff =
      (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    if (diff <= 1.5) {
      // Allow for some timezone flexibility
      currentStreak++
    } else {
      bestStreak = Math.max(bestStreak, currentStreak)
      currentStreak = 1
    }
    lastDate = currentDate
  }
  bestStreak = Math.max(bestStreak, currentStreak)

  const today = new Date()
  const mostRecentCompletion = new Date(dates[0])
  const diffDays =
    (today.getTime() - mostRecentCompletion.getTime()) / (1000 * 60 * 60 * 24)

  if (diffDays > 1.5) {
    currentStreak = 0
  }

  return { current: currentStreak, best: bestStreak }
}
