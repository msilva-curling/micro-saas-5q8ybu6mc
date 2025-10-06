import { useEffect, useState } from 'react'
import { useHabits } from '@/hooks/useHabits'
import { useNotifications } from '@/hooks/useNotifications'
import { isHabitScheduledForToday } from '@/lib/utils'
import { format } from 'date-fns'

export const NotificationManager = () => {
  const { habits } = useHabits()
  const { permission, sendNotification } = useNotifications()
  const [sentNotifications, setSentNotifications] = useState<Set<string>>(
    new Set(),
  )

  const getMillisecondsUntilMidnight = () => {
    const now = new Date()
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
    )
    return midnight.getTime() - now.getTime()
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (permission !== 'granted') return

      const now = new Date()
      const currentTime = format(now, 'HH:mm')
      const todayStr = format(now, 'yyyy-MM-dd')

      habits.forEach((habit) => {
        if (
          habit.reminderEnabled &&
          habit.reminderTime === currentTime &&
          isHabitScheduledForToday(habit) &&
          !habit.completions[todayStr] &&
          !sentNotifications.has(`${habit.id}-${todayStr}`)
        ) {
          sendNotification(`Lembrete: ${habit.name}`, {
            body: habit.description || 'É hora de completar seu hábito!',
            tag: habit.id,
          })
          setSentNotifications((prev) =>
            new Set(prev).add(`${habit.id}-${todayStr}`),
          )
        }
      })
    }, 60000)

    const midnightTimer = setTimeout(() => {
      setSentNotifications(new Set())
    }, getMillisecondsUntilMidnight())

    return () => {
      clearInterval(interval)
      clearTimeout(midnightTimer)
    }
  }, [habits, permission, sendNotification, sentNotifications])

  return null
}
